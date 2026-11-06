-- ============================================================================
-- CTU RESEARCH DATA HUB - POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Hệ thống Cơ sở dữ liệu lưu trữ dữ liệu khoa học phục vụ nghiên cứu cho Sinh viên
-- Hỗ trợ 4 nhóm: Tabular (CSV/Excel), Multimedia/AI, GIS/IoT, Academic/Notebook
-- ============================================================================

-- 1. Kích hoạt các Extension cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Hỗ trợ tìm kiếm mờ (Fuzzy / Full-text search)

-- 2. Các kiểu dữ liệu liệt kê (ENUMs)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'lecturer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dataset_type AS ENUM ('tabular', 'multimedia', 'gis_iot', 'academic_code');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dataset_visibility AS ENUM ('public', 'internal_university', 'restricted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dataset_status AS ENUM ('draft', 'pending_review', 'published', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. BẢNG PROFILES (Tài khoản Sinh viên / Giảng viên / Nghiên cứu viên)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    student_or_staff_id TEXT UNIQUE, -- Mã số SV (VD: B2110001) hoặc Mã CB
    department TEXT NOT NULL,        -- Khoa/Viện (CNTT&TT, Nông nghiệp, Thủy sản, Kinh tế...)
    role user_role NOT NULL DEFAULT 'student',
    contribution_points INTEGER NOT NULL DEFAULT 50, -- Tặng 50 điểm khởi đầu khi đăng ký
    uploads_count INTEGER NOT NULL DEFAULT 0,
    downloads_count INTEGER NOT NULL DEFAULT 0,
    avatar_url TEXT,
    bio TEXT,
    is_verified_edu BOOLEAN NOT NULL DEFAULT FALSE,  -- True nếu dùng email @student.ctu.edu.vn / @ctu.edu.vn
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. BẢNG CATEGORIES (Lĩnh vực / Khoa nghiên cứu)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT DEFAULT 'Database',
    dataset_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. BẢNG DATASETS (Thông tin Metadata cốt lõi của Bộ dữ liệu)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.datasets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    
    -- Thông tin định danh & mô tả
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,           -- Tóm tắt ngắn (1-2 câu)
    description TEXT NOT NULL,       -- Mô tả chi tiết: Phương pháp thu thập, thời gian, không gian, ý nghĩa biến
    tags TEXT[] DEFAULT '{}',        -- Từ khóa tìm kiếm
    
    -- Phân loại & Trạng thái
    data_type dataset_type NOT NULL DEFAULT 'tabular',
    visibility dataset_visibility NOT NULL DEFAULT 'public',
    status dataset_status NOT NULL DEFAULT 'pending_review',
    license TEXT NOT NULL DEFAULT 'CC-BY-4.0',
    
    -- Thông tin học thuật & Trích dẫn (FAIR Principles)
    doi TEXT UNIQUE,                 -- Mã DOI nội bộ hoặc quốc tế (VD: 10.5281/ctudata.2026.001)
    authors TEXT[] NOT NULL DEFAULT '{}',
    collection_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW()),
    geographic_coverage TEXT,        -- VD: "Cần Thơ, Đồng bằng sông Cửu Long"
    associated_paper_url TEXT,       -- Link bài báo khoa học / khóa luận liên quan
    
    -- Lưu trữ Lai (Hybrid Storage: R2/Supabase + Google Drive/Zenodo cho Dataset lớn > 50MB)
    storage_provider TEXT NOT NULL DEFAULT 'cloudflare_r2', -- 'cloudflare_r2' | 'supabase_storage' | 'google_drive' | 'zenodo' | 'onedrive'
    external_storage_url TEXT,       -- Link Google Drive (@student.ctu.edu.vn), Zenodo, hoặc HuggingFace cho file hàng chục GB
    
    -- Thống kê & Cấu trúc dữ liệu đặc thù cho 4 nhóm
    total_size_bytes BIGINT NOT NULL DEFAULT 0,
    files_count INTEGER NOT NULL DEFAULT 1,
    view_count INTEGER NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,
    citation_count INTEGER NOT NULL DEFAULT 0,
    credit_cost INTEGER NOT NULL DEFAULT 5,     -- Số điểm cần để tải (hoặc 0 nếu miễn phí)
    credit_reward INTEGER NOT NULL DEFAULT 30,  -- Số điểm thưởng cho tác giả khi được duyệt
    
    -- JSONB lưu schema riêng cho từng loại:
    -- 1. Tabular: [{"column": "pH", "type": "float", "missing_pct": 0.2, "description": "Độ pH nước"}]
    -- 2. Multimedia/AI: {"classes": ["Healthy", "Blast", "Blight"], "image_count": 4500, "resolution": "512x512"}
    -- 3. GIS/IoT: {"crs": "EPSG:4326", "bbox": [105.0, 9.5, 106.0, 10.5], "sensor_interval": "15m"}
    -- 4. Academic/Code: {"language": "Python 3.11", "libraries": ["pandas", "scikit-learn"], "notebook_cells": 18}
    metadata_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Thông tin kiểm duyệt
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_note TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tạo chỉ mục (Index) tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_datasets_data_type ON public.datasets(data_type);
CREATE INDEX IF NOT EXISTS idx_datasets_status ON public.datasets(status);
CREATE INDEX IF NOT EXISTS idx_datasets_category ON public.datasets(category_id);
CREATE INDEX IF NOT EXISTS idx_datasets_tags ON public.datasets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_datasets_title_trgm ON public.datasets USING GIN(title gin_trgm_ops);

-- ============================================================================
-- 6. BẢNG DATASET_VERSIONS (Quản lý phiên bản dữ liệu - Versioning)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dataset_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
    version_number TEXT NOT NULL DEFAULT '1.0.0',
    changelog TEXT NOT NULL DEFAULT 'Phiên bản khởi tạo ban đầu',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(dataset_id, version_number)
);

-- ============================================================================
-- 7. BẢNG DATASET_FILES (Quản lý các file vật lý trên Cloudflare R2 / Supabase)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dataset_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
    version_id UUID REFERENCES public.dataset_versions(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_extension TEXT NOT NULL,    -- csv, xlsx, parquet, geojson, zip, ipynb, pdf, py, r
    mime_type TEXT,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    storage_provider TEXT NOT NULL DEFAULT 'cloudflare_r2', -- 'cloudflare_r2' | 'supabase_storage'
    storage_key TEXT NOT NULL,       -- Đường dẫn object key trên R2/S3
    checksum_sha256 TEXT,            -- Đảm bảo tính toàn vẹn dữ liệu khoa học
    
    -- Dữ liệu xem trước (Preview) trực tiếp trên trình duyệt không cần tải file:
    -- CSV: 20 dòng đầu; GeoJSON: mẫu các điểm tọa độ; IPYNB: nội dung các cell code/markdown
    preview_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. BẢNG DATASET_DOWNLOADS (Nhật ký tải dữ liệu & Mục đích sử dụng)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dataset_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_id UUID NOT NULL REFERENCES public.datasets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL DEFAULT 'course_project', -- 'thesis' | 'paper' | 'course_project' | 'explore'
    purpose_detail TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 9. BẢNG CREDIT_TRANSACTIONS (Lịch sử cộng/trừ điểm đóng góp)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    dataset_id UUID REFERENCES public.datasets(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,         -- Dương (+30 khi đóng góp) hoặc Âm (-5 khi tải)
    reason TEXT NOT NULL,            -- 'signup_bonus' | 'dataset_published' | 'dataset_downloaded' | 'author_royalty'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. TRIGGERS TỰ ĐỘNG HÓA NGHIỆP VỤ
-- ============================================================================

-- Trigger 1: Tự động cộng điểm thưởng (+30 điểm) cho sinh viên khi Dataset được duyệt (Published)
CREATE OR REPLACE FUNCTION public.handle_dataset_published()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND (OLD.status IS DISTINCT FROM 'published') THEN
        NEW.published_at := NOW();
        
        -- Cộng điểm cho người đóng góp
        UPDATE public.profiles
        SET contribution_points = contribution_points + NEW.credit_reward,
            uploads_count = uploads_count + 1,
            updated_at = NOW()
        WHERE id = NEW.owner_id;

        -- Ghi log giao dịch điểm
        INSERT INTO public.credit_transactions (user_id, dataset_id, amount, reason)
        VALUES (NEW.owner_id, NEW.id, NEW.credit_reward, 'dataset_published');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_dataset_published ON public.datasets;
CREATE TRIGGER trg_dataset_published
    BEFORE UPDATE ON public.datasets
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_dataset_published();

-- Trigger 2: Tự động tăng lượt tải & thưởng thêm +2 điểm cho tác giả mỗi khi có sinh viên khác tải
CREATE OR REPLACE FUNCTION public.handle_dataset_download()
RETURNS TRIGGER AS $$
DECLARE
    v_owner_id UUID;
BEGIN
    -- Tăng số lượt tải của dataset
    UPDATE public.datasets
    SET download_count = download_count + 1
    WHERE id = NEW.dataset_id
    RETURNING owner_id INTO v_owner_id;

    -- Tăng số lượt tải của người dùng
    UPDATE public.profiles
    SET downloads_count = downloads_count + 1
    WHERE id = NEW.user_id;

    -- Nếu người tải không phải là chủ sở hữu, thưởng +2 điểm đóng góp cho tác giả
    IF v_owner_id IS NOT NULL AND v_owner_id <> NEW.user_id THEN
        UPDATE public.profiles
        SET contribution_points = contribution_points + 2
        WHERE id = v_owner_id;

        INSERT INTO public.credit_transactions (user_id, dataset_id, amount, reason)
        VALUES (v_owner_id, NEW.dataset_id, 2, 'author_royalty');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_dataset_download ON public.dataset_downloads;
CREATE TRIGGER trg_dataset_download
    AFTER INSERT ON public.dataset_downloads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_dataset_download();

-- ============================================================================
-- 11. ROW LEVEL SECURITY (RLS) - BẢO MẬT PHÂN QUYỀN TRÊN SUPABASE
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_downloads ENABLE ROW LEVEL SECURITY;

-- Ai cũng có thể xem hồ sơ công khai
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

-- Người dùng chỉ được sửa hồ sơ của chính mình
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Ai cũng xem được dataset đã published, hoặc chủ sở hữu/giảng viên xem được bản nháp/chờ duyệt
CREATE POLICY "Published datasets are viewable by everyone"
    ON public.datasets FOR SELECT
    USING (
        status = 'published'
        OR auth.uid() = owner_id
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('lecturer', 'admin')
        )
    );

-- Sinh viên đã đăng nhập được phép tải lên dataset mới
CREATE POLICY "Authenticated users can insert datasets"
    ON public.datasets FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- Chủ sở hữu hoặc Giảng viên/Admin được phép cập nhật dataset
CREATE POLICY "Owners and reviewers can update datasets"
    ON public.datasets FOR UPDATE
    USING (
        auth.uid() = owner_id
        OR EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('lecturer', 'admin')
        )
    );
