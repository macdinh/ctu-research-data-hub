import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const bucketName = process.env.R2_BUCKET_NAME || 'ctu-research-datasets';

/**
 * Khởi tạo S3 Client tương thích với Cloudflare R2.
 * Ưu điểm: Miễn phí 100% phí băng thông tải xuống (Egress = $0),
 * rất phù hợp khi hàng trăm sinh viên tải các bộ dữ liệu AI/GIS lớn.
 */
export const r2Client = accountId && accessKeyId && secretAccessKey
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  : null;

/**
 * Tạo Presigned URL để trình duyệt của Sinh viên tải thẳng file lên Cloudflare R2
 * (Không bị giới hạn dung lượng payload của Vercel Serverless).
 */
export async function createUploadPresignedUrl(
  datasetSlug: string,
  fileName: string,
  contentType: string
) {
  const storageKey = `datasets/${datasetSlug}/${Date.now()}-${fileName}`;

  if (!r2Client) {
    return {
      storageKey,
      uploadUrl: `/api/local-upload?key=${encodeURIComponent(storageKey)}`,
      provider: 'local_mock',
    };
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: storageKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
  return {
    storageKey,
    uploadUrl,
    provider: 'cloudflare_r2',
  };
}

/**
 * Tạo Presigned URL có thời hạn (15 phút) khi sinh viên đủ điểm và bấm "Tải dữ liệu"
 */
export async function createDownloadPresignedUrl(storageKey: string, downloadFileName: string) {
  if (!r2Client) {
    return `/api/datasets/download?key=${encodeURIComponent(storageKey)}&filename=${encodeURIComponent(downloadFileName)}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: storageKey,
    ResponseContentDisposition: `attachment; filename="${downloadFileName}"`,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 900 });
}
