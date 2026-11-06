-- ============================================================================
-- CTU RESEARCH DATA HUB - SEED DATA (Đơn vị trực thuộc & Lĩnh vực nghiên cứu ĐH Cần Thơ)
-- Nguồn tham chiếu: https://www.ctu.edu.vn/don-vi-truc-thuoc.html
-- ============================================================================

INSERT INTO public.categories (name, slug, description, icon_name, dataset_count) VALUES
    -- 1. Khối Các Trường trực thuộc ĐH Cần Thơ
    ('Trường Bách khoa', 'truong-bach-khoa', 'Kỹ thuật cơ khí, điện - điện tử, tự động hóa, xây dựng, kỹ thuật hóa học, giao thông', 'Cpu', 12),
    ('Trường Công nghệ Thông tin và Truyền thông', 'truong-cntt-tt', 'Khoa học máy tính, trí tuệ nhân tạo (AI), kỹ thuật phần mềm, mạng máy tính, hệ thống thông tin', 'Terminal', 25),
    ('Trường Kinh tế', 'truong-kinh-te', 'Kinh tế học, quản trị kinh doanh, tài chính - ngân hàng, kế toán - kiểm toán, marketing', 'TrendingUp', 14),
    ('Trường Nông nghiệp', 'truong-nong-nghiep', 'Khoa học cây trồng, bảo vệ thực vật, chăn nuôi, thú y, khoa học đất, di truyền giống', 'Sprout', 19),
    ('Trường Thủy sản', 'truong-thuy-san', 'Nuôi trồng thủy sản, bệnh học thủy sản, quản lý nguồn lợi thủy sản, chế biến thủy sản', 'Waves', 18),
    ('Trường Sư phạm', 'truong-su-pham', 'Khoa học giáo dục, phương pháp giảng dạy, tâm lý giáo dục và đào tạo giáo viên', 'BookOpen', 9),

    -- 2. Khối Các Khoa trực thuộc ĐH Cần Thơ
    ('Khoa Khoa học Tự nhiên', 'khoa-kh-tu-nhien', 'Toán ứng dụng, thống kê, vật lý kỹ thuật, hóa học, sinh học ứng dụng', 'Atom', 11),
    ('Khoa Môi trường và Tài nguyên Thiên nhiên', 'khoa-moi-truong-tntn', 'Kỹ thuật môi trường, quản lý tài nguyên đất - nước, GIS & viễn thám, sinh thái học', 'MapPin', 16),
    ('Khoa Khoa học Xã hội và Nhân văn', 'khoa-kh-xh-nv', 'Xã hội học, văn học, lịch sử, du lịch, thông tin - thư viện', 'Users', 8),
    ('Khoa Luật', 'khoa-luat', 'Luật kinh tế, luật hành chính, luật dân sự và tư pháp', 'Scale', 6),
    ('Khoa Ngoại ngữ', 'khoa-ngoai-ngu', 'Ngôn ngữ Anh, ngôn ngữ Pháp, biên - phiên dịch và giảng dạy ngoại ngữ', 'Globe', 7),
    ('Khoa Khoa học Chính trị', 'khoa-kh-chinh-tri', 'Triết học, chính trị học, giáo dục công dân', 'Landmark', 5),
    ('Khoa Phát triển Nông thôn', 'khoa-pt-nong-thon', 'Kinh doanh nông nghiệp, khuyến nông, phát triển cộng đồng nông thôn (Khu Hòa An)', 'Home', 7),
    ('Khoa Giáo dục Thể chất', 'khoa-gd-the-chat', 'Khoa học thể dục thể thao, y sinh học thể thao', 'Activity', 3),
    ('Khoa Dự bị Dân tộc', 'khoa-du-bi-dan-toc', 'Đào tạo dự bị đại học và nghiên cứu văn hóa dân tộc vùng ĐBSCL', 'Award', 2),
    ('Khoa Sau đại học', 'khoa-sau-dai-hoc', 'Luận văn thạc sĩ, luận án tiến sĩ và các nghiên cứu chuyên sâu liên ngành', 'GraduationCap', 15),

    -- 3. Khối Các Viện Nghiên cứu trực thuộc ĐH Cần Thơ
    ('Viện Công nghệ Sinh học và Thực phẩm', 'vien-cnsh-thuc-pham', 'Vi sinh vật học, công nghệ gen, sinh học phân tử, công nghệ chế biến thực phẩm', 'FlaskConical', 13),
    ('Viện Nghiên cứu Biến đổi Khí hậu (DRAGON-Mekong)', 'vien-dragon-mekong', 'Biến đổi khí hậu, xâm nhập mặn, sạt lở bờ sông, sinh kế bền vững vùng ĐBSCL', 'CloudRain', 14),
    ('Viện Nghiên cứu Phát triển Đồng bằng sông Cửu Long', 'vien-ncpt-dbscl', 'Kinh tế - xã hội vùng ĐBSCL, hệ thống canh tác, chính sách phát triển vùng', 'Compass', 11)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- TÀI KHOẢN QUẢN TRỊ VIÊN CAO NHẤT (SUPER ADMIN / ROOT ADMIN)
-- Tên đăng nhập: admin | Mật khẩu khởi tạo: 123Ctu?!
-- Email: admin@ctu.edu.vn | Mã định danh: ADMIN-ROOT | is_super_admin = TRUE
-- ============================================================================
