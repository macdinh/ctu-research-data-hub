import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Khởi tạo Supabase Client dùng cho cả truy vấn Metadata (PostgreSQL)
 * và xác thực người dùng (Supabase Auth).
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface DatasetRecord {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  data_type: 'tabular' | 'multimedia' | 'gis_iot' | 'academic_code';
  category_name: string;
  department: string;
  authors: string[];
  owner_email: string;
  collection_year: number;
  geographic_coverage: string;
  license: string;
  doi: string;
  status: 'published' | 'pending_review' | 'draft';
  total_size_bytes: number;
  view_count: number;
  download_count: number;
  citation_count: number;
  credit_cost: number;
  credit_reward: number;
  tags: string[];
  file_name: string;
  file_extension: string;
  metadata_schema: Record<string, any>;
  preview_data: Record<string, any>;
  created_at: string;
}

/**
 * Tạo chuỗi trích dẫn chuẩn học thuật (APA, IEEE, BibTeX) tự động cho Sinh viên
 */
export function generateCitations(ds: DatasetRecord) {
  const authorStr = ds.authors.join(', ');
  const year = ds.collection_year || new Date().getFullYear();
  const doiUrl = `https://doi.org/${ds.doi}`;
  const bibKey = `${ds.authors[0]?.split(' ').pop()?.toLowerCase() || 'ctu'}${year}${ds.slug.split('-')[0]}`;

  return {
    apa: `${authorStr} (${year}). ${ds.title} [Data set]. Cổng Dữ liệu Khoa học Sinh viên (CTU Research Data Hub). ${doiUrl}`,
    ieee: `${authorStr}, "${ds.title}," CTU Research Data Hub, ${year}. [Online]. Available: ${doiUrl}`,
    bibtex: `@dataset{${bibKey},
  author    = {${ds.authors.join(' and ')}},
  title     = {{${ds.title}}},
  year      = {${year}},
  publisher = {CTU Research Data Hub},
  doi       = {${ds.doi}},
  url       = {${doiUrl}}
}`
  };
}
