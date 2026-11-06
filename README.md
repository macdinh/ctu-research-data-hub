# CTU Research Data Hub — Cổng Dữ Liệu Khoa Học Sinh Viên

Hệ thống Cơ sở dữ liệu lưu trữ và chia sẻ dữ liệu khoa học phục vụ nghiên cứu cho Sinh viên & Giảng viên theo nguyên tắc **FAIR Data** (Findable, Accessible, Interoperable, Reusable).

---

## 1. Cấu Trúc Thư Mục Dự Án

- `supabase/schema.sql`: Toàn bộ câu lệnh khởi tạo Cơ sở dữ liệu PostgreSQL trên Supabase (6 bảng cốt lõi, chỉ mục tìm kiếm `GIN`, phân quyền `Row Level Security`, và `Triggers` tự động cộng/trừ điểm đóng góp).
- `supabase/seed.sql`: Dữ liệu mẫu khởi tạo các lĩnh vực nghiên cứu.
- `src/lib/supabase.ts`: Kết nối Supabase Auth + PostgreSQL và bộ sinh trích dẫn học thuật tự động (**APA 7th, IEEE, BibTeX**).
- `src/lib/r2-storage.ts`: Tích hợp **Cloudflare R2 (S3-Compatible)** sử dụng cơ chế `Presigned URL` giúp tải lên/tải xuống trực tiếp các tập dữ liệu lớn (miễn phí 100% băng thông tải xuống).
- `server.mjs` & `public/index.html`: Ứng dụng Web Portal chạy thử nghiệm ngay lập tức tại máy cục bộ (kèm CSDL JSON tự động lưu tại `data/db.json`).
- `sample_data/mekong_water_quality_sample.csv`: File dữ liệu mẫu để bạn thử tính năng **Kéo thả & Tự động trích xuất cấu trúc bảng CSV** trên giao diện web.

---

## 2. Chạy Thử Nghiệm Ngay Trên Máy (Zero-Config)

Không cần cài đặt thêm thư viện ngoài, bạn có thể khởi chạy ngay cổng dữ liệu tại máy bằng lệnh:

```bash
npm start
# Hoặc: node server.mjs
```

Sau đó mở trình duyệt tại địa chỉ: **http://localhost:3000**

### Các tính năng bạn có thể trải nghiệm ngay:
1. **Xem trước 4 nhóm dữ liệu khoa học (Interactive Preview):**
   - 📊 **Dữ liệu dạng bảng (`CSV/Excel`):** Xem bảng dữ liệu mẫu + Từ điển biến (Data Dictionary).
   - 🗺️ **Không gian GIS & IoT (`GeoJSON / Time-series`):** Tọa độ các trạm quan trắc sông Hậu + Biểu đồ chuỗi thời gian độ mặn.
   - 🖼️ **Đa phương tiện & AI (`Image Dataset`):** Phân bố mẫu theo nhãn lớp bệnh lá lúa (`YOLOv8`) + Cấu trúc gói `.zip`.
   - 📓 **Học thuật & Mã nguồn (`Jupyter Notebook .ipynb`):** Xem trực tiếp các ô Code Python và kết quả thực thi mô hình.
2. **Đóng góp dữ liệu & Tự động phân tích file (`+ Đóng góp Dữ liệu`):**
   - Chọn file `sample_data/mekong_water_quality_sample.csv` để hệ thống tự động đếm số dòng, trích xuất tên cột và cộng **+30 Credits**.
3. **Tạo trích dẫn chuẩn học thuật (`APA 7th`, `IEEE`, `BibTeX`)** và **Tải file dữ liệu thực tế** về máy.
4. **Kiểm duyệt dữ liệu (`Tab Kiểm duyệt`):** Duyệt bộ dữ liệu đang chờ (`Pending Review`) và tự động thưởng điểm cho sinh viên đóng góp.

---

## 3. Hướng Dẫn Triển Khai Cloud Miễn Phí (Supabase + Cloudflare R2 + Vercel)

1. **Bước 1 — Tạo Database trên Supabase (Free Tier):**
   - Truy cập https://supabase.com, tạo Project mới.
   - Mở mục **SQL Editor**, copy toàn bộ nội dung file `supabase/schema.sql` và nhấn **Run** để tạo bảng, RLS và Triggers.
2. **Bước 2 — Tạo Bucket lưu trữ trên Cloudflare R2 (Free 10GB, $0 Egress):**
   - Vào Cloudflare Dashboard -> **R2 Object Storage** -> Tạo bucket tên `ctu-research-datasets`.
   - Cấu hình CORS cho phép phương thức `GET`, `PUT` và tạo cặp khóa `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`.
3. **Bước 3 — Kết nối biến môi trường & Deploy lên Vercel:**
   - Sao chép file `.env.example` thành `.env.local` và điền thông tin khóa từ Supabase & Cloudflare R2.
   - Đẩy mã nguồn lên GitHub và kết nối với https://vercel.com để triển khai tự động.
