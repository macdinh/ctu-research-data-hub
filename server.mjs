import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const TMP_DB_FILE = path.join(os.tmpdir(), 'ctu_data_hub_db.json');

const initialDb = {
  users: [
    {
      id: 'usr-student-1',
      username: 'B2110942',
      password: '123',
      email: 'khoab2110942@student.ctu.edu.vn',
      full_name: 'Nguyễn Minh Khoa',
      student_or_staff_id: 'B2110942',
      department: 'Trường Công nghệ Thông tin và Truyền thông',
      role: 'student',
      member_group: 'ctu_student',
      member_group_label: 'Sinh viên (@student.ctu.edu.vn)',
      is_ctu_domain: true,
      email_verified: true,
      admin_approved: true,
      account_status: 'active',
      contribution_points: 65,
      uploads_count: 2,
      downloads_count: 4,
      is_verified_edu: true,
      is_locked: false
    },
    {
      id: 'usr-student-2',
      username: 'B2204115',
      password: '123',
      email: 'ngocb2204115@gstudent.ctu.edu.vn',
      full_name: 'Lê Thảo Ngọc',
      student_or_staff_id: 'B2204115',
      department: 'Trường Nông nghiệp',
      role: 'graduate',
      member_group: 'ctu_graduate',
      member_group_label: 'Học viên Sau đại học (@gstudent.ctu.edu.vn)',
      is_ctu_domain: true,
      email_verified: true,
      admin_approved: true,
      account_status: 'active',
      contribution_points: 95,
      uploads_count: 3,
      downloads_count: 2,
      is_verified_edu: true,
      is_locked: false
    },
    {
      id: 'usr-dttx-1',
      username: 'TX24091',
      password: '123',
      email: 'minhtx24091@dttx.ctu.edu.vn',
      full_name: 'Phạm Quốc Minh',
      student_or_staff_id: 'TX24091',
      department: 'Trường Kinh tế',
      role: 'distance_student',
      member_group: 'ctu_distance',
      member_group_label: 'SV Đào tạo Từ xa (@dttx.ctu.edu.vn)',
      is_ctu_domain: true,
      email_verified: true,
      admin_approved: true,
      account_status: 'active',
      contribution_points: 50,
      uploads_count: 1,
      downloads_count: 1,
      is_verified_edu: true,
      is_locked: false
    },
    {
      id: 'usr-lecturer-1',
      username: 'CB00241',
      password: '123',
      email: 'tvhai@ctu.edu.vn',
      full_name: 'TS. Trần Văn Hải',
      student_or_staff_id: 'CB00241',
      department: 'Trường Công nghệ Thông tin và Truyền thông',
      role: 'lecturer',
      member_group: 'ctu_staff',
      member_group_label: 'Cán bộ, Giảng viên (@ctu.edu.vn)',
      is_ctu_domain: true,
      email_verified: true,
      admin_approved: true,
      account_status: 'active',
      contribution_points: 250,
      uploads_count: 5,
      downloads_count: 12,
      is_verified_edu: true,
      is_locked: false
    },
    {
      id: 'usr-ext-1',
      username: 'hoangnam.research@gmail.com',
      password: '123',
      email: 'hoangnam.research@gmail.com',
      full_name: 'Đặng Hoàng Nam',
      student_or_staff_id: '',
      department: 'Viện Lúa Đồng bằng sông Cửu Long (CLRRI) — Nghiên cứu viên',
      workplace: 'Viện Lúa Đồng bằng sông Cửu Long (CLRRI) — Nghiên cứu viên',
      role: 'external',
      member_group: 'external_member',
      member_group_label: 'Thành viên Ngoài CTU (Xác nhận 2 bước)',
      is_ctu_domain: false,
      requires_admin_approval: true,
      email_verified: true,
      admin_approved: false,
      account_status: 'pending_admin_approval',
      verification_code: '682419',
      contribution_points: 0,
      uploads_count: 0,
      downloads_count: 0,
      is_verified_edu: false,
      is_locked: false
    },
    {
      id: 'usr-admin-1',
      username: 'admin',
      password: '123Ctu?!',
      email: 'admin@ctu.edu.vn',
      full_name: 'Quản trị viên Cao nhất (Super Admin)',
      student_or_staff_id: 'ADMIN-ROOT',
      department: 'Ban Quản trị Hệ thống — Đại học Cần Thơ',
      role: 'admin',
      member_group: 'ctu_staff',
      member_group_label: 'Quản trị Tối cao (@ctu.edu.vn)',
      is_ctu_domain: true,
      email_verified: true,
      admin_approved: true,
      account_status: 'active',
      is_super_admin: true,
      contribution_points: 9999,
      uploads_count: 8,
      downloads_count: 15,
      is_verified_edu: true,
      is_locked: false
    }
  ],
  email_outbox: [
    {
      id: 'mail-init-1',
      timestamp: '2026-11-06T08:15:00Z',
      to_email: 'hoangnam.research@gmail.com',
      to_name: 'Đặng Hoàng Nam (Viện Nghiên cứu Đối tác)',
      subject: '[CTU Research Data Hub] Hoàn tất Bước 1/2 (Xác thực Email) — Đang chờ Ban Quản trị Xác nhận',
      member_group_label: 'Thành viên Ngoài CTU (Xác nhận 2 bước)',
      otp_code: '682419',
      email_type: 'step2_pending_admin',
      status_label: 'Đã xác thực Email (Bước 1/2) • Chờ Admin duyệt (Bước 2/2)',
      body_summary: 'Hệ thống tự động xác nhận bạn đã hoàn tất Bước 1 (Xác thực chính chủ địa chỉ email hoangnam.research@gmail.com). Vì email không thuộc tên miền ctu.edu.vn, hồ sơ của bạn đã được chuyển đến Ban Quản trị Hệ thống (Bước 2/2) để phê duyệt thành viên chính thức.'
    },
    {
      id: 'mail-init-2',
      timestamp: '2026-11-05T10:00:00Z',
      to_email: 'khoab2110942@student.ctu.edu.vn',
      to_name: 'Nguyễn Minh Khoa',
      subject: '[CTU Research Data Hub] Xác thực Email Thành công — Kích hoạt Tài khoản Sinh viên (@student.ctu.edu.vn)',
      member_group_label: 'Sinh viên (@student.ctu.edu.vn)',
      otp_code: '519204',
      email_type: 'activated',
      status_label: 'Đã kích hoạt chính thức (+50 Credits)',
      body_summary: 'Chúc mừng Nguyễn Minh Khoa! Địa chỉ email @student.ctu.edu.vn của bạn đã được xác thực tự động. Tài khoản nhóm Sinh viên ĐH Cần Thơ đã trở thành thành viên chính thức và được cộng +50 Credits khởi đầu.'
    }
  ],
  site_visits: 1280,
  settings: {
    signup_bonus: 50,
    upload_reward: 30,
    download_cost: 5,
    author_royalty: 2,
    require_review: false,
    restrict_ctu_email: false,
    max_direct_upload_mb: 50
  },
  audit_logs: [
    {
      id: 'log-1',
      timestamp: '2026-11-06T08:00:00Z',
      actor: 'admin — Quản trị viên Cao nhất (Super Admin)',
      action: 'Khởi tạo Tài khoản Quản trị Tối cao (Root Admin)',
      detail: 'Xác lập tài khoản [admin] là Quản trị viên Cao nhất của Hệ thống Cổng Dữ liệu Khoa học ĐH Cần Thơ (Bảo vệ tuyệt đối).',
      type: 'system'
    },
    {
      id: 'log-2',
      timestamp: '2026-11-05T14:20:00Z',
      actor: 'TS. Trần Văn Hải (Giảng viên)',
      action: 'Phê duyệt Bộ dữ liệu',
      detail: 'Đã duyệt bộ dữ liệu RiceLeaf-CTU-4K (4.800 ảnh bệnh lá lúa) của SV Nguyễn Minh Khoa (+30 Credits).',
      type: 'review'
    },
    {
      id: 'log-3',
      timestamp: '2026-11-04T09:15:00Z',
      actor: 'Lê Thảo Ngọc (B2204115)',
      action: 'Đóng góp Dữ liệu mới',
      detail: 'Tải lên bộ dữ liệu Khảo sát Năng suất Lúa & Độ phì nhiêu Đất ĐBSCL (650 mẫu CSV).',
      type: 'upload'
    }
  ],
  datasets: [
    {
      id: 'ds-tabular-001',
      title: 'Khảo sát Năng suất Lúa, Độ phì nhiêu Đất và Chi phí Nông hộ ĐBSCL (2024-2026)',
      slug: 'mekong-rice-yield-soil-survey-2026',
      summary: 'Bộ dữ liệu khảo sát 650 nông hộ trồng lúa 3 vụ tại Cần Thơ, An Giang, Đồng Tháp và Sóc Trăng kèm các chỉ số hóa lý đất (N, P, K, pH, EC).',
      description: 'Dữ liệu được thu thập thông qua phỏng vấn trực tiếp nông hộ kết hợp lấy mẫu đất tầng mặt (0-20cm) tại 4 tỉnh trọng điểm vùng Đồng bằng sông Cửu Long. Bộ dữ liệu phục vụ các nghiên cứu về kinh tế nông nghiệp, tối ưu hóa lượng phân bón và mô hình dự báo năng suất cây trồng.',
      data_type: 'tabular',
      category_name: 'Nông nghiệp & Sinh học',
      department: 'Trường Nông nghiệp',
      authors: ['Lê Thảo Ngọc', 'PGS.TS. Phạm Hoàng Việt'],
      owner_id: 'usr-student-2',
      owner_email: 'ngocb2204115@student.ctu.edu.vn',
      collection_year: 2026,
      geographic_coverage: 'Cần Thơ, An Giang, Đồng Tháp, Sóc Trăng',
      license: 'CC-BY-4.0',
      doi: '10.5281/ctudata.2026.001',
      status: 'published',
      storage_provider: 'cloudflare_r2',
      external_storage_url: '',
      total_size_bytes: 2845120,
      view_count: 342,
      download_count: 89,
      citation_count: 14,
      credit_cost: 5,
      credit_reward: 30,
      tags: ['Năng suất lúa', 'Thổ nhưỡng', 'Kinh tế nông hộ', 'ĐBSCL', 'CSV'],
      file_name: 'mekong_rice_yield_soil_2026.csv',
      file_extension: 'csv',
      created_at: '2026-10-18T08:30:00Z',
      metadata_schema: {
        row_count: 650,
        column_count: 8,
        columns: [
          { name: 'household_id', type: 'String', missing: '0%', stats: '650 giá trị duy nhất', desc: 'Mã định danh nông hộ khảo sát' },
          { name: 'province', type: 'Categorical', missing: '0%', stats: '4 tỉnh (CT, AG, ĐT, ST)', desc: 'Tỉnh/Thành phố thu mẫu' },
          { name: 'rice_variety', type: 'Categorical', missing: '0%', stats: 'ST25 (38%), OM18 (42%), Đài Thơm 8 (20%)', desc: 'Giống lúa canh tác' },
          { name: 'soil_ph', type: 'Float', missing: '0.3%', stats: 'Mean: 5.62 | Min: 4.1 | Max: 6.9', desc: 'Độ pH đất tầng mặt (0-20cm)' },
          { name: 'soil_salinity_ec', type: 'Float', missing: '0.5%', stats: 'Mean: 1.45 dS/m | Max: 4.8 dS/m', desc: 'Độ dẫn điện / độ mặn đất (dS/m)' },
          { name: 'nitrogen_kg_ha', type: 'Float', missing: '0%', stats: 'Mean: 98.4 kg/ha', desc: 'Lượng phân đạm nguyên chất sử dụng (kg N/ha)' },
          { name: 'yield_ton_ha', type: 'Float', missing: '0%', stats: 'Mean: 6.84 tấn/ha | SD: 0.72', desc: 'Năng suất lúa tươi thu hoạch (tấn/ha)' },
          { name: 'net_profit_m_vnd', type: 'Float', missing: '1.1%', stats: 'Mean: 28.5 triệu VNĐ/ha', desc: 'Lợi nhuận ròng trên mỗi hecta (Triệu VNĐ)' }
        ]
      },
      preview_data: {
        headers: ['household_id', 'province', 'rice_variety', 'soil_ph', 'soil_salinity_ec', 'nitrogen_kg_ha', 'yield_ton_ha', 'net_profit_m_vnd'],
        rows: [
          ['HH_CT_001', 'Cần Thơ', 'OM18', 5.85, 0.92, 95.0, 7.15, 31.2],
          ['HH_CT_002', 'Cần Thơ', 'Đài Thơm 8', 5.70, 1.05, 102.5, 6.90, 29.4],
          ['HH_AG_014', 'An Giang', 'OM18', 6.10, 0.75, 90.0, 7.42, 33.8],
          ['HH_ST_089', 'Sóc Trăng', 'ST25', 5.12, 2.85, 88.0, 6.10, 36.5],
          ['HH_ST_092', 'Sóc Trăng', 'ST25', 4.95, 3.40, 92.0, 5.65, 32.1],
          ['HH_DT_045', 'Đồng Tháp', 'Đài Thơm 8', 5.60, 0.88, 105.0, 7.05, 28.9],
          ['HH_CT_019', 'Cần Thơ', 'OM18', 5.92, 0.95, 94.0, 7.20, 31.8]
        ]
      }
    },
    {
      id: 'ds-gis-002',
      title: 'Dữ liệu Cảm biến IoT & GIS Quan trắc Xâm nhập Mặn, pH, DO Sông Hậu (15 phút/lần)',
      slug: 'hau-river-iot-salinity-gis-2026',
      summary: 'Chuỗi thời gian 180.000 bản ghi từ 12 trạm IoT dọc sông Hậu (Cần Thơ - Hậu Giang - Sóc Trăng - Trà Vinh) kèm tọa độ không gian GeoJSON.',
      description: 'Hệ thống trạm quan trắc IoT sử dụng vi điều khiển ESP32 kết hợp cảm biến công nghiệp RS485 đo liên tục mỗi 15 phút các chỉ số: Độ mặn (Salinity ‰), Độ pH, Oxy hòa tan (DO mg/L), Nhiệt độ nước (°C) và Mực nước triều (cm). Đi kèm file biên giới trạm định dạng chuẩn GeoJSON (EPSG:4326).',
      data_type: 'gis_iot',
      category_name: 'Không gian Địa lý & IoT',
      department: 'Khoa Môi trường và Tài nguyên Thiên nhiên',
      authors: ['Nguyễn Minh Khoa', 'TS. Trần Văn Hải'],
      owner_id: 'usr-student-1',
      owner_email: 'khoab2110942@student.ctu.edu.vn',
      collection_year: 2026,
      geographic_coverage: 'Lưu vực Sông Hậu (Vĩ độ 9.55°N - 10.08°N, Kinh độ 105.72°E - 106.25°E)',
      license: 'CC-BY-4.0',
      doi: '10.5281/ctudata.2026.002',
      status: 'published',
      storage_provider: 'cloudflare_r2',
      external_storage_url: '',
      total_size_bytes: 18450000,
      view_count: 518,
      download_count: 142,
      citation_count: 23,
      credit_cost: 5,
      credit_reward: 30,
      tags: ['IoT', 'GIS', 'GeoJSON', 'Xâm nhập mặn', 'Time-Series', 'Sông Hậu'],
      file_name: 'hau_river_iot_stations_2026.geojson',
      file_extension: 'geojson',
      created_at: '2026-10-22T10:15:00Z',
      metadata_schema: {
        crs: 'EPSG:4326 (WGS 84)',
        station_count: 12,
        sampling_interval: '15 phút',
        time_range: '01/01/2026 - 30/06/2026',
        sensors: ['Salinity (‰)', 'Water pH', 'Dissolved Oxygen (mg/L)', 'Temperature (°C)', 'Tide Level (m)']
      },
      preview_data: {
        stations: [
          { id: 'ST_01', name: 'Trạm Bến Ninh Kiều (Cần Thơ)', lat: 10.0332, lng: 105.7881, salinity_ppt: 0.4, ph: 7.1, do_mgl: 6.4, status: 'Bình thường' },
          { id: 'ST_02', name: 'Trạm Cái Côn (Hậu Giang)', lat: 9.8945, lng: 105.8912, salinity_ppt: 1.8, ph: 7.0, do_mgl: 5.9, status: 'Cảnh báo nhẹ' },
          { id: 'ST_03', name: 'Trạm Đại Ngãi (Sóc Trăng)', lat: 9.7310, lng: 106.0685, salinity_ppt: 6.5, ph: 7.4, do_mgl: 5.5, status: 'Xâm nhập mặn' },
          { id: 'ST_04', name: 'Trạm Trần Đề (Cửa biển Sóc Trăng)', lat: 9.4982, lng: 106.1950, salinity_ppt: 14.2, ph: 7.8, do_mgl: 5.2, status: 'Độ mặn cao' },
          { id: 'ST_05', name: 'Trạm Cầu Quan (Trà Vinh)', lat: 9.6512, lng: 106.1240, salinity_ppt: 8.9, ph: 7.5, do_mgl: 5.6, status: 'Xâm nhập mặn' }
        ],
        timeseries_sample: [
          { time: '00:00', st01: 0.3, st03: 4.8, st04: 11.2 },
          { time: '04:00', st01: 0.4, st03: 6.2, st04: 13.8 },
          { time: '08:00', st01: 0.5, st03: 7.1, st04: 15.1 },
          { time: '12:00', st01: 0.4, st03: 5.4, st04: 12.6 },
          { time: '16:00', st01: 0.3, st03: 4.2, st04: 10.4 },
          { time: '20:00', st01: 0.4, st03: 5.9, st04: 13.5 }
        ]
      }
    },
    {
      id: 'ds-ai-003',
      title: 'RiceLeaf-CTU-4K: Tập dữ liệu 4.800 Ảnh Bệnh Lá Lúa đã gán nhãn Bounding Box & Class',
      slug: 'riceleaf-ctu-4k-disease-dataset',
      summary: '4.800 ảnh độ phân giải cao chụp thực địa tại ruộng lúa ĐBSCL, gán nhãn chuẩn YOLO & COCO cho 4 lớp bệnh phổ biến phục vụ huấn luyện Computer Vision.',
      description: 'Bộ dữ liệu được nhóm sinh viên ngành Khoa học Máy tính và Bảo vệ Thực vật phối hợp thu thập dưới nhiều điều kiện ánh sáng thực tế (nắng gắt, râm mát, sau mưa). Gói ảnh gốc (616 MB) được lưu trữ kết hợp trên Google Drive Trường (@student.ctu.edu.vn) & Zenodo, trong khi cấu trúc nhãn và mẫu thống kê được hiển thị trực tiếp trên cổng dữ liệu.',
      data_type: 'multimedia',
      category_name: 'Công nghệ Thông tin & AI',
      department: 'Trường Công nghệ Thông tin và Truyền thông',
      authors: ['Nguyễn Minh Khoa', 'Trần Quốc Bảo', 'TS. Trần Văn Hải'],
      owner_id: 'usr-student-1',
      owner_email: 'khoab2110942@student.ctu.edu.vn',
      collection_year: 2026,
      geographic_coverage: 'Cần Thơ, Hậu Giang, Vĩnh Long',
      license: 'CC-BY-NC-4.0',
      doi: '10.5281/ctudata.2026.003',
      status: 'published',
      storage_provider: 'google_drive',
      external_storage_url: 'https://drive.google.com/drive/folders/ctu-riceleaf-4k-yolo-dataset-demo',
      total_size_bytes: 645922816,
      view_count: 890,
      download_count: 274,
      citation_count: 31,
      credit_cost: 5,
      credit_reward: 30,
      tags: ['Computer Vision', 'YOLOv8', 'Deep Learning', 'Bệnh lá lúa', 'Image Dataset'],
      file_name: 'RiceLeaf_CTU_4K_YOLO.zip',
      file_extension: 'zip',
      created_at: '2026-10-25T14:20:00Z',
      metadata_schema: {
        total_images: 4800,
        resolution: '1024x1024 px (RGB)',
        annotation_format: 'YOLOv8 TXT + COCO JSON',
        train_val_test_split: '70% Train (3,360) / 15% Val (720) / 15% Test (720)',
        classes: [
          { id: 0, name: 'Healthy (Lá khỏe)', count: 1250, color: '#10b981', sample_desc: 'Lá xanh đồng nhất, không có vết đốm hoại tử' },
          { id: 1, name: 'Leaf Blast (Bệnh đạo ôn)', count: 1320, color: '#f59e0b', sample_desc: 'Vết bệnh hình thoi (mắt én), tâm xám trắng, viền nâu đậm' },
          { id: 2, name: 'Bacterial Blight (Cháy bìa lá)', count: 1180, color: '#ef4444', sample_desc: 'Vết cháy dọc hai bên mép lá lan dần vào gân chính' },
          { id: 3, name: 'Brown Spot (Bệnh đốm nâu)', count: 1050, color: '#8b5cf6', sample_desc: 'Đốm tròn hoặc bầu dục màu nâu sẫm rải rác khắp phiến lá' }
        ]
      },
      preview_data: {
        folder_structure: [
          'RiceLeaf_CTU_4K_YOLO/',
          '├── data.yaml',
          '├── README.md',
          '├── train/ (3,360 images + labels)',
          '├── valid/ (720 images + labels)',
          '└── test/  (720 images + labels)'
        ]
      }
    },
    {
      id: 'ds-code-004',
      title: 'Jupyter Notebook & Bộ dữ liệu Chuẩn hóa: Dự báo Xâm nhập Mặn bằng Bi-LSTM & XGBoost',
      slug: 'salinity-forecast-bilstm-notebook-2026',
      summary: 'Mã nguồn đầy đủ (.ipynb) tiền xử lý dữ liệu chuỗi thời gian, huấn luyện mô hình Bi-LSTM dự báo độ mặn trước 72 giờ và bộ trọng số đã huấn luyện.',
      description: 'Tài liệu học thuật đi kèm mã nguồn thực thi (Reproducible Research) giúp sinh viên dễ dàng tái lập kết quả nghiên cứu. Notebook bao gồm từ bước xử lý giá trị khuyết (Interpolation), tạo đặc trưng độ trễ (Lag features), huấn luyện mô hình học sâu và đánh giá bằng chỉ số RMSE, MAE, R2.',
      data_type: 'academic_code',
      category_name: 'Công nghệ Thông tin & AI',
      department: 'Trường Công nghệ Thông tin và Truyền thông',
      authors: ['TS. Trần Văn Hải', 'Nguyễn Minh Khoa'],
      owner_id: 'usr-lecturer-1',
      owner_email: 'tvhai@ctu.edu.vn',
      collection_year: 2026,
      geographic_coverage: 'Đồng bằng sông Cửu Long',
      license: 'MIT',
      doi: '10.5281/ctudata.2026.004',
      status: 'published',
      storage_provider: 'supabase_storage',
      external_storage_url: '',
      total_size_bytes: 5420000,
      view_count: 412,
      download_count: 165,
      citation_count: 19,
      credit_cost: 5,
      credit_reward: 30,
      tags: ['Jupyter Notebook', 'Python', 'Bi-LSTM', 'XGBoost', 'Reproducible Research'],
      file_name: 'Mekong_Salinity_Forecast_BiLSTM.ipynb',
      file_extension: 'ipynb',
      created_at: '2026-10-28T09:00:00Z',
      metadata_schema: {
        language: 'Python 3.11',
        environment: 'PyTorch 2.4, Scikit-learn 1.5, Pandas 2.2',
        metrics: 'RMSE = 0.42 ‰ | MAE = 0.29 ‰ | R² = 0.946'
      },
      preview_data: {
        notebook_cells: [
          {
            type: 'markdown',
            content: '### 1. Đọc & Tiền xử lý Chuỗi thời gian Độ mặn Sông Hậu\nKiểm tra dữ liệu khuyết và tạo cửa sổ trượt (Sliding Window = 24 giờ) để dự báo độ mặn cho 12 giờ tiếp theo.'
          },
          {
            type: 'code',
            code: `import pandas as pd\nimport numpy as np\nfrom sklearn.metrics import mean_squared_error, r2_score\n\ndf = pd.read_csv('hau_river_iot_clean.csv', parse_dates=['timestamp'])\ndf['salinity_lag_24h'] = df.groupby('station_id')['salinity_ppt'].shift(96)\nprint(f"Tổng số mẫu huấn luyện: {len(df):,} dòng | Số trạm: {df['station_id'].nunique()}")\ndf.head(3)`,
            output: `Tổng số mẫu huấn luyện: 179,840 dòng | Số trạm: 12\n   station_id            timestamp  salinity_ppt  ph  do_mgl  salinity_lag_24h\n0       ST_03  2026-03-15 08:00:00          6.52 7.4    5.51              6.18\n1       ST_03  2026-03-15 08:15:00          6.68 7.4    5.49              6.24`
          },
          {
            type: 'code',
            code: `# Đánh giá mô hình Bi-LSTM trên tập kiểm thử (Test Set - Mùa khô 2026)\ny_pred = model.predict(X_test)\nrmse = np.sqrt(mean_squared_error(y_test, y_pred))\nr2 = r2_score(y_test, y_pred)\nprint(f"Test RMSE: {rmse:.3f} ‰ | R² Score: {r2:.4f}")`,
            output: `Test RMSE: 0.418 ‰ | R² Score: 0.9462`
          }
        ]
      }
    },
    {
      id: 'ds-pending-005',
      title: 'Khảo sát Hành vi Sử dụng Công cụ AI Tạo sinh trong Học tập của 1.200 Sinh viên Đại học',
      slug: 'student-generative-ai-adoption-survey-2026',
      summary: 'Dữ liệu khảo sát bảng hỏi Likert 5 mức độ về tần suất, mục đích và đạo đức học thuật khi sử dụng LLM của sinh viên các khối ngành.',
      description: 'Bộ dữ liệu thu thập từ tháng 9/2026 đến tháng 10/2026 trên 1.200 sinh viên thuộc 6 trường/khoa. Đã ẩn danh toàn bộ thông tin cá nhân, phù hợp cho phân tích nhân tố khám phá (EFA), hồi quy PLS-SEM và thống kê xã hội học.',
      data_type: 'tabular',
      category_name: 'Kinh tế & Xã hội',
      department: 'Khoa Khoa học Xã hội và Nhân văn',
      authors: ['Nguyễn Minh Khoa'],
      owner_id: 'usr-student-1',
      owner_email: 'khoab2110942@student.ctu.edu.vn',
      collection_year: 2026,
      geographic_coverage: 'Cần Thơ',
      license: 'CC-BY-4.0',
      doi: '10.5281/ctudata.2026.005',
      status: 'pending_review',
      storage_provider: 'cloudflare_r2',
      external_storage_url: '',
      total_size_bytes: 1540000,
      view_count: 18,
      download_count: 0,
      citation_count: 0,
      credit_cost: 5,
      credit_reward: 30,
      tags: ['Khảo sát sinh viên', 'Generative AI', 'PLS-SEM', 'SPSS', 'CSV'],
      file_name: 'student_genai_survey_1200.csv',
      file_extension: 'csv',
      created_at: '2026-11-03T16:40:00Z',
      metadata_schema: {
        row_count: 1200,
        column_count: 6,
        columns: [
          { name: 'resp_id', type: 'String', missing: '0%', stats: '1200 mẫu', desc: 'Mã phiếu khảo sát ẩn danh' },
          { name: 'year_of_study', type: 'Integer', missing: '0%', stats: 'Năm 1 - Năm 4', desc: 'Năm học của sinh viên' },
          { name: 'daily_ai_hours', type: 'Float', missing: '0%', stats: 'Mean: 2.15 giờ/ngày', desc: 'Số giờ sử dụng AI trung bình mỗi ngày' },
          { name: 'perceived_usefulness', type: 'Integer (1-5)', missing: '0%', stats: 'Mean: 4.32 / 5', desc: 'Mức độ hữu ích cảm nhận (Thang Likert 1-5)' },
          { name: 'academic_integrity_awareness', type: 'Integer (1-5)', missing: '0%', stats: 'Mean: 4.18 / 5', desc: 'Nhận thức về liêm chính học thuật và trích dẫn' },
          { name: 'gpa_change', type: 'Float', missing: '2.1%', stats: 'Mean: +0.24', desc: 'Mức thay đổi điểm trung bình học kỳ (GPA hệ 4)' }
        ]
      },
      preview_data: {
        headers: ['resp_id', 'year_of_study', 'daily_ai_hours', 'perceived_usefulness', 'academic_integrity_awareness', 'gpa_change'],
        rows: [
          ['SV_0001', 3, 2.5, 5, 4, 0.32],
          ['SV_0002', 2, 1.5, 4, 5, 0.18],
          ['SV_0003', 4, 3.2, 5, 5, 0.41],
          ['SV_0004', 1, 1.0, 4, 3, 0.10],
          ['SV_0005', 3, 2.0, 4, 4, 0.25]
        ]
      }
    }
  ]
};

function detectStorageProvider(externalUrl, defaultProvider = 'cloudflare_r2') {
  if (!externalUrl) return defaultProvider;
  const u = externalUrl.toLowerCase();
  if (u.includes('drive.google.com') || u.includes('docs.google.com')) return 'google_drive';
  if (u.includes('zenodo.org')) return 'zenodo';
  if (u.includes('1drv.ms') || u.includes('sharepoint.com') || u.includes('onedrive.live.com')) return 'onedrive';
  if (u.includes('huggingface.co') || u.includes('kaggle.com')) return 'huggingface_kaggle';
  return 'external_cloud';
}

function normalizeCtuUnitName(name) {
  if (!name) return 'Trường Công nghệ Thông tin và Truyền thông';
  if (name === 'Trường CNTT & Truyền thông') return 'Trường Công nghệ Thông tin và Truyền thông';
  if (name === 'Trường Thủy sản & Khoa Môi trường') return 'Khoa Môi trường và Tài nguyên Thiên nhiên';
  if (name === 'Khoa Khoa học Xã hội & Nhân văn') return 'Khoa Khoa học Xã hội và Nhân văn';
  return name;
}

function classifyCtuEmail(emailRaw) {
  const email = (emailRaw || '').trim().toLowerCase();
  const domain = email.includes('@') ? email.split('@')[1] : '';

  if (domain === 'ctu.edu.vn') {
    return {
      member_group: 'ctu_staff',
      member_group_label: 'Cán bộ, Giảng viên (@ctu.edu.vn)',
      default_role: 'lecturer',
      is_ctu_domain: true,
      requires_admin_approval: false
    };
  }
  if (domain === 'student.ctu.edu.vn') {
    return {
      member_group: 'ctu_student',
      member_group_label: 'Sinh viên (@student.ctu.edu.vn)',
      default_role: 'student',
      is_ctu_domain: true,
      requires_admin_approval: false
    };
  }
  if (domain === 'gstudent.ctu.edu.vn') {
    return {
      member_group: 'ctu_graduate',
      member_group_label: 'Học viên Sau đại học (@gstudent.ctu.edu.vn)',
      default_role: 'graduate',
      is_ctu_domain: true,
      requires_admin_approval: false
    };
  }
  if (domain === 'dttx.ctu.edu.vn') {
    return {
      member_group: 'ctu_distance',
      member_group_label: 'SV Đào tạo Từ xa (@dttx.ctu.edu.vn)',
      default_role: 'distance_student',
      is_ctu_domain: true,
      requires_admin_approval: false
    };
  }
  return {
    member_group: 'external_member',
    member_group_label: 'Thành viên Ngoài CTU (Xác nhận 2 bước)',
    default_role: 'external',
    is_ctu_domain: false,
    requires_admin_approval: true
  };
}

function sendAutoResponderEmail(db, mailPayload) {
  if (!db.email_outbox) db.email_outbox = [];
  const mailRecord = {
    id: 'mail-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    from: 'Auto-Responder <noreply@ctu-data-hub.edu.vn>',
    ...mailPayload
  };
  db.email_outbox.unshift(mailRecord);
  if (db.email_outbox.length > 60) {
    db.email_outbox = db.email_outbox.slice(0, 60);
  }
  return mailRecord;
}

function addAuditLog(db, actor, action, detail, type = 'system') {
  if (!db.audit_logs) db.audit_logs = [];
  db.audit_logs.unshift({
    id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 100),
    timestamp: new Date().toISOString(),
    actor,
    action,
    detail,
    type
  });
  if (db.audit_logs.length > 50) {
    db.audit_logs = db.audit_logs.slice(0, 50);
  }
}

function normalizeParsedDb(parsed) {
  const rootTemplate = initialDb.users.find(u => u.id === 'usr-admin-1');
  parsed.users = (parsed.users || []).map(u => {
    if (u.id === 'usr-admin-1' || u.username === 'admin') {
      return {
        ...u,
        ...rootTemplate,
        contribution_points: Math.max(9999, u.contribution_points || 9999),
        is_locked: false,
        is_super_admin: true,
        email_verified: true,
        admin_approved: true,
        account_status: 'active',
        role: 'admin'
      };
    }
    const emailClass = classifyCtuEmail(u.email);
    return {
      is_locked: false,
      is_super_admin: false,
      username: u.username || u.student_or_staff_id || (u.email ? u.email.split('@')[0] : 'user'),
      password: u.password || '123',
      member_group: u.member_group || emailClass.member_group,
      member_group_label: u.member_group_label || emailClass.member_group_label,
      is_ctu_domain: typeof u.is_ctu_domain === 'boolean' ? u.is_ctu_domain : emailClass.is_ctu_domain,
      email_verified: typeof u.email_verified === 'boolean' ? u.email_verified : true,
      admin_approved: typeof u.admin_approved === 'boolean' ? u.admin_approved : true,
      account_status: u.account_status || 'active',
      ...u,
      department: normalizeCtuUnitName(u.department)
    };
  });
  if (!parsed.users.some(u => u.id === 'usr-admin-1' || u.username === 'admin')) {
    parsed.users.push({ ...rootTemplate });
  }
  parsed.datasets = (parsed.datasets || []).map(ds => ({
    storage_provider: ds.id === 'ds-ai-003' ? 'google_drive' : 'cloudflare_r2',
    external_storage_url: ds.id === 'ds-ai-003' ? 'https://drive.google.com/drive/folders/ctu-riceleaf-4k-yolo-dataset-demo' : '',
    ...ds,
    department: normalizeCtuUnitName(ds.department)
  }));
  parsed.settings = { ...initialDb.settings, ...(parsed.settings || {}) };
  parsed.audit_logs = parsed.audit_logs?.length ? parsed.audit_logs : [...initialDb.audit_logs];
  parsed.email_outbox = parsed.email_outbox?.length ? parsed.email_outbox : [...initialDb.email_outbox];
  return parsed;
}

function loadDb() {
  if (fs.existsSync(TMP_DB_FILE)) {
    try {
      return normalizeParsedDb(JSON.parse(fs.readFileSync(TMP_DB_FILE, 'utf8')));
    } catch {
      // ignore
    }
  }
  if (fs.existsSync(DB_FILE)) {
    try {
      return normalizeParsedDb(JSON.parse(fs.readFileSync(DB_FILE, 'utf8')));
    } catch {
      return JSON.parse(JSON.stringify(initialDb));
    }
  }
  const fresh = JSON.parse(JSON.stringify(initialDb));
  saveDb(fresh);
  return fresh;
}

function saveDb(db) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch {
    try {
      fs.writeFileSync(TMP_DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    } catch {
      // ignore
    }
  }
}

function generateDownloadContent(ds) {
  if (ds.data_type === 'tabular' && ds.preview_data?.headers) {
    const headers = ds.preview_data.headers.join(',');
    const rows = (ds.preview_data.rows || []).map(r => r.join(',')).join('\n');
    return `${headers}\n${rows}\n`;
  }
  if (ds.data_type === 'gis_iot') {
    const geojson = {
      type: 'FeatureCollection',
      metadata: { title: ds.title, doi: ds.doi, license: ds.license },
      features: (ds.preview_data?.stations || []).map(st => ({
        type: 'Feature',
        properties: { id: st.id, name: st.name, salinity_ppt: st.salinity_ppt, ph: st.ph, do_mgl: st.do_mgl, status: st.status },
        geometry: { type: 'Point', coordinates: [st.lng, st.lat] }
      }))
    };
    return JSON.stringify(geojson, null, 2);
  }
  if (ds.data_type === 'academic_code') {
    const ipynb = {
      nbformat: 4,
      nbformat_minor: 5,
      metadata: { title: ds.title, doi: ds.doi },
      cells: (ds.preview_data?.notebook_cells || []).map(c => ({
        cell_type: c.type === 'markdown' ? 'markdown' : 'code',
        metadata: {},
        source: [c.content || c.code || '']
      }))
    };
    return JSON.stringify(ipynb, null, 2);
  }
  return JSON.stringify({
    dataset: ds.title,
    doi: ds.doi,
    authors: ds.authors,
    license: ds.license,
    external_storage_url: ds.external_storage_url || null,
    metadata_schema: ds.metadata_schema,
    preview_data: ds.preview_data
  }, null, 2);
}

export function requestHandler(req, res) {
  const host = req.headers.host || 'localhost:3000';
  const url = new URL(req.url, `http://${host}`);

  // API: Lấy toàn bộ dữ liệu khởi tạo & ghi nhận thêm số lượt truy cập
  if (url.pathname === '/api/state' && req.method === 'GET') {
    const db = loadDb();
    db.site_visits = (Number(db.site_visits) || 1280) + 1;
    saveDb(db);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(db));
    return;
  }

  // API: Đăng nhập xác thực Tài khoản Thành viên & Quản trị viên
  if (url.pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const payload = JSON.parse(body || '{}');
      const usernameInput = (payload.username || '').trim().toLowerCase();
      const passwordInput = payload.password || '';
      const db = loadDb();

      const matched = db.users.find(u => {
        const uname = (u.username || '').toLowerCase();
        const sid = (u.student_or_staff_id || '').toLowerCase();
        const mail = (u.email || '').toLowerCase();
        const mailPrefix = mail.split('@')[0];
        const isIdentifierMatch =
          uname === usernameInput ||
          sid === usernameInput ||
          mail === usernameInput ||
          (mailPrefix && mailPrefix === usernameInput);

        if (!isIdentifierMatch) return false;
        const isRoot = u.is_super_admin || u.username === 'admin' || u.id === 'usr-admin-1';
        if (isRoot) {
          return passwordInput === '123Ctu?!' || u.password === passwordInput;
        }
        return (u.password || '123') === passwordInput;
      });

      if (!matched) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Sai tên đăng nhập (Mã SV/CB/Email) hoặc mật khẩu!' }));
        return;
      }

      if (matched.is_locked) {
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Tài khoản này đang bị tạm khóa bởi Quản trị viên hệ thống!' }));
        return;
      }

      // Kiểm tra trạng thái xác thực Email (Bước 1)
      if (matched.email_verified === false || matched.account_status === 'pending_email_verification') {
        const latestMail = (db.email_outbox || []).find(m => m.to_email?.toLowerCase() === matched.email.toLowerCase());
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          ok: false,
          code: 'PENDING_EMAIL_VERIFICATION',
          user: matched,
          auto_email: latestMail || null,
          error: `Tài khoản [${matched.email}] chưa xác thực địa chỉ Email! Vui lòng nhập mã OTP trong thư trả lời tự động.`
        }));
        return;
      }

      // Kiểm tra trạng thái xác nhận của Ban Quản trị (Bước 2 đối với Email ngoài ctu.edu.vn)
      if (matched.admin_approved === false || matched.account_status === 'pending_admin_approval') {
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          ok: false,
          code: 'PENDING_ADMIN_APPROVAL',
          error: `Tài khoản ngoài hệ thống ĐH Cần Thơ (${matched.email}) đã hoàn thành Bước 1 (Xác thực Email), hiện đang chờ Bước 2: Ban Quản trị Hệ thống xác nhận để trở thành thành viên chính thức!`
        }));
        return;
      }

      if (matched.account_status === 'rejected') {
        res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          ok: false,
          error: 'Yêu cầu đăng ký tài khoản này đã bị Ban Quản trị từ chối!'
        }));
        return;
      }

      const isRoot = matched.is_super_admin || matched.username === 'admin' || matched.id === 'usr-admin-1';
      addAuditLog(
        db,
        `${matched.full_name} (${matched.username || matched.student_or_staff_id})`,
        isRoot ? 'Đăng nhập Quản trị Tối cao' : 'Đăng nhập Hệ thống',
        isRoot
          ? 'Xác thực thành công tài khoản Quản trị viên Cao nhất (Super Admin).'
          : `Đăng nhập thành công nhóm [${matched.member_group_label || matched.role}] — Đơn vị: ${matched.department}`,
        isRoot ? 'admin' : 'user'
      );
      saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, user: matched, db }));
    });
    return;
  }

  // API: Đăng ký tài khoản mới + Tự động phân nhóm Email CTU & Gửi Email trả lời tự động (OTP)
  if (url.pathname === '/api/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const payload = JSON.parse(body || '{}');
      const db = loadDb();
      const email = (payload.email || '').trim().toLowerCase();

      // Phân loại tự động theo đuôi Email (@ctu.edu.vn, @student.ctu.edu.vn, @gstudent.ctu.edu.vn, @dttx.ctu.edu.vn hoặc Ngoài CTU)
      const emailClass = classifyCtuEmail(email);

      let staffOrStudentId = '';
      let username = '';
      let departmentOrWorkplace = '';

      if (emailClass.is_ctu_domain) {
        staffOrStudentId = (payload.student_or_staff_id || '').trim();
        if (!staffOrStudentId) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'Thành viên thuộc hệ thống ĐH Cần Thơ (ctu.edu.vn) bắt buộc phải nhập Mã số SV / CB / HV!' }));
          return;
        }
        username = (payload.username || staffOrStudentId).trim();
        departmentOrWorkplace = (payload.department || 'Trường Công nghệ Thông tin và Truyền thông').trim();
      } else {
        // Thành viên KHÔNG thuộc nhóm CTU: Không có Mã số SV/CB/HV, bắt buộc nhập thông tin đơn vị đang Công tác/làm việc
        staffOrStudentId = '';
        username = email;
        departmentOrWorkplace = (payload.workplace || payload.department || '').trim();
        if (!departmentOrWorkplace) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'Thành viên ngoài hệ thống CTU bắt buộc phải nhập thông tin Đơn vị đang Công tác / Làm việc!' }));
          return;
        }
      }

      if (username.toLowerCase() === 'admin' || email === 'admin@ctu.edu.vn') {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Tên đăng nhập [admin] thuộc quyền Quản trị cao nhất, không thể đăng ký mới!' }));
        return;
      }

      let existing = db.users.find(u =>
        u.email.toLowerCase() === email ||
        (staffOrStudentId && u.student_or_staff_id && u.student_or_staff_id.toLowerCase() === staffOrStudentId.toLowerCase()) ||
        (u.username && u.username.toLowerCase() === username.toLowerCase())
      );

      if (existing) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Email hoặc Mã số SV/CB này đã được đăng ký! Vui lòng chuyển sang Đăng nhập.' }));
        return;
      }

      const otpCode = String(Math.floor(100000 + Math.random() * 900000));

      const newUser = {
        id: 'usr-' + Date.now(),
        username,
        password: payload.password || '123',
        email,
        full_name: payload.full_name || 'Thành viên Nghiên cứu',
        student_or_staff_id: staffOrStudentId,
        department: departmentOrWorkplace,
        workplace: emailClass.is_ctu_domain ? '' : departmentOrWorkplace,
        role: emailClass.default_role,
        member_group: emailClass.member_group,
        member_group_label: emailClass.member_group_label,
        is_ctu_domain: emailClass.is_ctu_domain,
        requires_admin_approval: !emailClass.is_ctu_domain,
        email_verified: false,
        admin_approved: emailClass.is_ctu_domain ? true : false,
        account_status: 'pending_email_verification',
        verification_code: otpCode,
        is_super_admin: false,
        contribution_points: 0,
        uploads_count: 0,
        downloads_count: 0,
        is_verified_edu: emailClass.is_ctu_domain,
        is_locked: false,
        created_at: new Date().toISOString()
      };

      db.users.push(newUser);

      // Tạo thư trả lời tự động (Auto-Responder Email)
      const autoMail = sendAutoResponderEmail(db, {
        to_email: newUser.email,
        to_name: newUser.full_name,
        subject: emailClass.is_ctu_domain
          ? `[CTU Research Data Hub] Xác thực Email Thành viên ĐH Cần Thơ (${emailClass.member_group_label}) — Mã OTP: ${otpCode}`
          : `[CTU Research Data Hub] [Bước 1/2] Xác thực Email Đăng ký Thành viên Ngoài CTU — Mã OTP: ${otpCode}`,
        member_group_label: emailClass.member_group_label,
        otp_code: otpCode,
        email_type: emailClass.is_ctu_domain ? 'verify_ctu_1step' : 'verify_external_step1',
        status_label: emailClass.is_ctu_domain
          ? 'Chờ xác thực Email CTU (1 bước duy nhất)'
          : 'Chờ Bước 1/2: Xác thực Email người dùng',
        body_summary: emailClass.is_ctu_domain
          ? `Xin chào ${newUser.full_name} (${newUser.student_or_staff_id}), Hệ thống Cổng Dữ liệu Khoa học ĐH Cần Thơ ghi nhận địa chỉ email ${newUser.email} thuộc nhóm [${emailClass.member_group_label}]. Vui lòng nhập mã xác thực OTP [${otpCode}] để kích hoạt tài khoản thành viên chính thức ngay lập tức (+50 Credits).`
          : `Xin chào ${newUser.full_name} (Đơn vị công tác: ${departmentOrWorkplace}), Địa chỉ email ${newUser.email} không thuộc hệ thống tên miền ctu.edu.vn nên cần qua 02 bước xác nhận: (1) Nhập mã OTP [${otpCode}] để xác thực đúng email của bạn; (2) Sau khi xác thực email, Ban Quản trị Hệ thống sẽ xét duyệt để kích hoạt thành viên chính thức.`
      });

      addAuditLog(
        db,
        `${newUser.full_name} (${newUser.email})`,
        'Đăng ký & Gửi Email Tự động (OTP)',
        `Nhóm: ${emailClass.member_group_label} — Đã gửi thư trả lời tự động kèm mã OTP xác thực (${emailClass.is_ctu_domain ? 'Quy trình 1 bước CTU' : 'Quy trình 2 bước Ngoài CTU'}).`,
        'user'
      );
      saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        ok: true,
        requires_verification: true,
        user: newUser,
        auto_email: autoMail,
        db
      }));
    });
    return;
  }

  // API: Xác thực Email bằng Mã OTP từ Hệ thống Trả lời Tự động
  if (url.pathname === '/api/verify-email' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { user_id, email, otp_code } = JSON.parse(body || '{}');
      const db = loadDb();
      const user = db.users.find(u =>
        (user_id && u.id === user_id) ||
        (email && u.email.toLowerCase() === String(email).trim().toLowerCase())
      );

      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Không tìm thấy tài khoản cần xác thực!' }));
        return;
      }

      if (String(otp_code || '').trim() !== String(user.verification_code || '').trim()) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Mã xác thực OTP không chính xác! Vui lòng kiểm tra lại thư trả lời tự động.' }));
        return;
      }

      user.email_verified = true;
      user.email_verified_at = new Date().toISOString();
      const bonus = Number(db.settings?.signup_bonus ?? 50);

      // TRƯỜNG HỢP 1: Email thuộc 4 nhóm của ctu.edu.vn -> Trở thành thành viên chính thức ngay!
      if (user.is_ctu_domain) {
        user.admin_approved = true;
        user.account_status = 'active';
        if ((user.contribution_points || 0) === 0) {
          user.contribution_points = bonus;
        }

        const welcomeMail = sendAutoResponderEmail(db, {
          to_email: user.email,
          to_name: user.full_name,
          subject: `[CTU Research Data Hub] Xác thực Thành công — Chào mừng Thành viên Chính thức (${user.member_group_label})`,
          member_group_label: user.member_group_label,
          otp_code: user.verification_code,
          email_type: 'activated',
          status_label: `Đã kích hoạt chính thức (+${bonus} Credits)`,
          body_summary: `Chúc mừng ${user.full_name}! Bạn đã hoàn tất xác thực email thuộc hệ thống ĐH Cần Thơ (${user.email}). Tài khoản của bạn thuộc nhóm [${user.member_group_label}] đã được kích hoạt chính thức và nhận +${bonus} Credits khởi đầu.`
        });

        addAuditLog(
          db,
          `${user.full_name} (${user.email})`,
          'Xác thực Email CTU Thành công',
          `Tài khoản nhóm [${user.member_group_label}] đã xác thực OTP và trở thành Thành viên Chính thức (+${bonus} Credits).`,
          'user'
        );
        saveDb(db);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          ok: true,
          status: 'active',
          user,
          auto_email: welcomeMail,
          db
        }));
        return;
      }

      // TRƯỜNG HỢP 2: Email KHÔNG thuộc ctu.edu.vn -> Hoàn tất Bước 1, chuyển sang Bước 2 chờ Ban Quản trị xác nhận
      user.admin_approved = false;
      user.account_status = 'pending_admin_approval';

      const step2Mail = sendAutoResponderEmail(db, {
        to_email: user.email,
        to_name: user.full_name,
        subject: `[CTU Research Data Hub] Đã xác thực Email (Bước 1/2) — Đang chờ Ban Quản trị Xác nhận (Bước 2/2)`,
        member_group_label: user.member_group_label,
        otp_code: user.verification_code,
        email_type: 'step2_pending_admin',
        status_label: 'Hoàn tất Bước 1/2 (Email) • Chờ Bước 2/2 (Admin duyệt)',
        body_summary: `Xin chào ${user.full_name}, Hệ thống xác nhận bạn đã hoàn thành Bước 1: Xác thực chính chủ email (${user.email}). Do email của bạn không thuộc hệ thống ctu.edu.vn, tài khoản hiện đã được chuyển sang Bước 2: Chờ Ban Quản trị Hệ thống xác nhận để kích hoạt chính thức.`
      });

      addAuditLog(
        db,
        `${user.full_name} (${user.email})`,
        'Hoàn tất Bước 1/2 (Xác thực Email Ngoài CTU)',
        `Đã xác thực đúng email ${user.email}. Đang chờ Bước 2/2: Ban Quản trị xác nhận thành viên chính thức.`,
        'user'
      );
      saveDb(db);

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        ok: true,
        status: 'pending_admin_approval',
        user,
        auto_email: step2Mail,
        db
      }));
    });
    return;
  }

  // API: Gửi lại Email trả lời tự động kèm Mã OTP mới
  if (url.pathname === '/api/resend-verification' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { user_id, email } = JSON.parse(body || '{}');
      const db = loadDb();
      const user = db.users.find(u =>
        (user_id && u.id === user_id) ||
        (email && u.email.toLowerCase() === String(email).trim().toLowerCase())
      );
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Không tìm thấy tài khoản!' }));
        return;
      }
      const newOtp = String(Math.floor(100000 + Math.random() * 900000));
      user.verification_code = newOtp;
      const resentMail = sendAutoResponderEmail(db, {
        to_email: user.email,
        to_name: user.full_name,
        subject: `[CTU Research Data Hub] Gửi lại Mã OTP Xác thực Email — Mã mới: ${newOtp}`,
        member_group_label: user.member_group_label,
        otp_code: newOtp,
        email_type: user.is_ctu_domain ? 'verify_ctu_1step' : 'verify_external_step1',
        status_label: 'Đã gửi lại mã OTP mới',
        body_summary: `Hệ thống trả lời tự động gửi lại mã xác thực OTP mới [${newOtp}] cho tài khoản ${user.email} (${user.member_group_label}).`
      });
      saveDb(db);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, user, auto_email: resentMail, db }));
    });
    return;
  }

  // API: Tải lên Bộ dữ liệu khoa học mới (Hỗ trợ Hybrid Storage: Upload File + Link Google Drive/Zenodo)
  if (url.pathname === '/api/datasets' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const payload = JSON.parse(body || '{}');
      const db = loadDb();
      const user = db.users.find(u => u.id === payload.user_id) || db.users[0];

      const slug = (payload.title || 'dataset')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);

      const externalUrl = (payload.external_storage_url || '').trim();
      const storageProvider = detectStorageProvider(externalUrl, payload.storage_provider || 'cloudflare_r2');
      const forceReview = db.settings?.require_review === true;
      const autoPublish = (!forceReview && payload.auto_publish === true) || user.role !== 'student';
      const reward = Number(db.settings?.upload_reward ?? 30);
      const cost = Number(db.settings?.download_cost ?? 5);

      const newDataset = {
        id: 'ds-' + Date.now(),
        title: payload.title,
        slug,
        summary: payload.summary,
        description: payload.description || payload.summary,
        data_type: payload.data_type || 'tabular',
        category_name: payload.category_name || payload.department || user.department,
        department: payload.department || user.department,
        authors: payload.authors?.length ? payload.authors : [user.full_name],
        owner_id: user.id,
        owner_email: user.email,
        collection_year: Number(payload.collection_year) || 2026,
        geographic_coverage: payload.geographic_coverage || 'Cần Thơ, ĐBSCL',
        license: payload.license || 'CC-BY-4.0',
        doi: `10.5281/ctudata.2026.${String(db.datasets.length + 1).padStart(3, '0')}`,
        status: autoPublish ? 'published' : 'pending_review',
        storage_provider: storageProvider,
        external_storage_url: externalUrl,
        total_size_bytes: Number(payload.total_size_bytes) || 1048576,
        view_count: 1,
        download_count: 0,
        citation_count: 0,
        credit_cost: cost,
        credit_reward: reward,
        tags: payload.tags || ['Nghiên cứu sinh viên', 'CTU Data'],
        file_name: payload.file_name || 'dataset_upload.csv',
        file_extension: payload.file_extension || 'csv',
        created_at: new Date().toISOString(),
        metadata_schema: payload.metadata_schema || { row_count: 100, column_count: 5, columns: [] },
        preview_data: payload.preview_data || { headers: [], rows: [] }
      };

      db.datasets.unshift(newDataset);

      if (autoPublish) {
        user.contribution_points += reward;
        user.uploads_count += 1;
      }

      addAuditLog(
        db,
        `${user.full_name} (${user.student_or_staff_id})`,
        autoPublish ? 'Công bố Bộ dữ liệu mới' : 'Gửi Bộ dữ liệu chờ duyệt',
        `${newDataset.title} (${newDataset.department})`,
        'upload'
      );

      saveDb(db);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ dataset: newDataset, user, db }));
    });
    return;
  }

  // API: Giảng viên / Admin duyệt hoặc từ chối bộ dữ liệu
  if (url.pathname === '/api/datasets/review' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { dataset_id, action, reviewer_name } = JSON.parse(body || '{}');
      const db = loadDb();
      const ds = db.datasets.find(d => d.id === dataset_id);
      if (ds) {
        const wasPublished = ds.status === 'published';
        ds.status = action === 'approve' ? 'published' : 'rejected';
        if (action === 'approve' && !wasPublished) {
          const owner = db.users.find(u => u.id === ds.owner_id);
          if (owner) {
            owner.contribution_points += (ds.credit_reward || Number(db.settings?.upload_reward ?? 30));
            owner.uploads_count += 1;
          }
        }
        addAuditLog(
          db,
          reviewer_name || 'Giảng viên / Admin',
          action === 'approve' ? 'Phê duyệt Bộ dữ liệu' : 'Từ chối Bộ dữ liệu',
          `${ds.title} (DOI: ${ds.doi})`,
          'review'
        );
        saveDb(db);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ db }));
    });
    return;
  }

  // API: Sinh viên tải dữ liệu (Trừ điểm người tải, cộng điểm cho tác giả & trả về file)
  if (url.pathname === '/api/datasets/download' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { dataset_id, user_id, purpose } = JSON.parse(body || '{}');
      const db = loadDb();
      const ds = db.datasets.find(d => d.id === dataset_id);
      const user = db.users.find(u => u.id === user_id);

      if (!ds) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Không tìm thấy bộ dữ liệu' }));
        return;
      }

      const cost = Number(ds.credit_cost ?? db.settings?.download_cost ?? 5);
      const royalty = Number(db.settings?.author_royalty ?? 2);

      if (user && user.id !== ds.owner_id) {
        user.contribution_points = Math.max(0, user.contribution_points - cost);
        user.downloads_count += 1;
        const owner = db.users.find(u => u.id === ds.owner_id);
        if (owner) {
          owner.contribution_points += royalty;
        }
      }
      ds.download_count += 1;
      addAuditLog(
        db,
        user ? `${user.full_name} (${user.student_or_staff_id})` : 'Khách',
        'Tải xuống Dữ liệu',
        `Tải "${ds.file_name}" phục vụ: ${purpose || 'Nghiên cứu'}`,
        'download'
      );
      saveDb(db);

      const fileContent = generateDownloadContent(ds);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        file_name: ds.file_name,
        file_content: fileContent,
        external_storage_url: ds.external_storage_url || '',
        storage_provider: ds.storage_provider || 'cloudflare_r2',
        db
      }));
    });
    return;
  }

  // ==========================================================================
  // ADMIN API 1: Quản lý Người dùng (Phân quyền, Cộng/Trừ Credits, Khóa, Xóa)
  // ==========================================================================
  if (url.pathname === '/api/admin/user' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { target_user_id, action, role, delta_points, department } = JSON.parse(body || '{}');
      const db = loadDb();
      const target = db.users.find(u => u.id === target_user_id);

      if (target) {
        const isRootAdmin = target.is_super_admin === true || target.username === 'admin' || target.id === 'usr-admin-1';
        if (isRootAdmin && (action === 'delete' || action === 'toggle_lock' || (action === 'role' && role !== 'admin'))) {
          res.writeHead(403, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            ok: false,
            error: 'Tài khoản Quản trị Cao nhất (admin) được bảo vệ tuyệt đối — không thể xóa, khóa hoặc hạ quyền!',
            db
          }));
          return;
        }

        if (action === 'approve_member') {
          const bonus = Number(db.settings?.signup_bonus ?? 50);
          target.email_verified = true;
          target.admin_approved = true;
          target.account_status = 'active';
          if ((target.contribution_points || 0) === 0) {
            target.contribution_points = bonus;
          }
          sendAutoResponderEmail(db, {
            to_email: target.email,
            to_name: target.full_name,
            subject: `[CTU Research Data Hub] Ban Quản trị đã xác nhận (Bước 2/2) — Kích hoạt Thành viên Chính thức!`,
            member_group_label: target.member_group_label || 'Thành viên Ngoài CTU',
            otp_code: target.verification_code || 'APPROVED',
            email_type: 'admin_approved_step2',
            status_label: `Hoàn tất 2 bước • Đã kích hoạt (+${bonus} Credits)`,
            body_summary: `Chúc mừng ${target.full_name}! Ban Quản trị Hệ thống Cổng Dữ liệu Khoa học ĐH Cần Thơ đã xác nhận hồ sơ của bạn (Bước 2/2). Tài khoản ${target.email} đã trở thành Thành viên Chính thức và được tặng +${bonus} Credits khởi đầu.`
          });
          addAuditLog(db, 'admin (Super Admin)', 'Phê duyệt Thành viên Ngoài CTU (Bước 2/2)', `Đã xác nhận tài khoản ${target.full_name} (${target.email}) trở thành thành viên chính thức (+${bonus} Credits).`, 'admin');
        } else if (action === 'reject_member') {
          target.admin_approved = false;
          target.account_status = 'rejected';
          sendAutoResponderEmail(db, {
            to_email: target.email,
            to_name: target.full_name,
            subject: `[CTU Research Data Hub] Thông báo kết quả xét duyệt đăng ký thành viên`,
            member_group_label: target.member_group_label || 'Thành viên Ngoài CTU',
            otp_code: '-',
            email_type: 'admin_rejected',
            status_label: 'Từ chối phê duyệt (Bước 2/2)',
            body_summary: `Xin chào ${target.full_name}, Rất tiếc yêu cầu đăng ký tài khoản ngoài hệ thống ctu.edu.vn (${target.email}) chưa được Ban Quản trị phê duyệt.`
          });
          addAuditLog(db, 'admin (Super Admin)', 'Từ chối Hồ sơ Thành viên Ngoài CTU', `Đã từ chối tài khoản ${target.full_name} (${target.email}).`, 'admin');
        } else if (action === 'delete') {
          db.users = db.users.filter(u => u.id !== target_user_id);
          addAuditLog(db, 'admin (Super Admin)', 'Xóa Tài khoản', `Đã xóa tài khoản ${target.full_name} (${target.email})`, 'admin');
        } else if (action === 'role' && role) {
          const oldRole = target.role;
          target.role = role;
          addAuditLog(db, 'admin (Super Admin)', 'Phân quyền Tài khoản', `Đổi vai trò của ${target.full_name} từ [${oldRole}] sang [${role}]`, 'admin');
        } else if (action === 'points' && typeof delta_points === 'number') {
          target.contribution_points = Math.max(0, target.contribution_points + delta_points);
          addAuditLog(db, 'admin (Super Admin)', 'Điều chỉnh Điểm Credits', `${delta_points >= 0 ? '+' : ''}${delta_points} Credits cho ${target.full_name} (Số dư mới: ${target.contribution_points} Cr)`, 'admin');
        } else if (action === 'toggle_lock') {
          target.is_locked = !target.is_locked;
          addAuditLog(db, 'admin (Super Admin)', target.is_locked ? 'Khóa Tài khoản' : 'Mở khóa Tài khoản', `Tài khoản ${target.full_name} (${target.student_or_staff_id})`, 'admin');
        } else if (action === 'department' && department) {
          target.department = department;
          addAuditLog(db, 'admin (Super Admin)', 'Cập nhật Đơn vị', `Chuyển ${target.full_name} sang ${department}`, 'admin');
        }
        saveDb(db);
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, db }));
    });
    return;
  }

  // ==========================================================================
  // ADMIN API 2: Quản lý Kho Dữ liệu (Đổi trạng thái, Đổi phí tải, Xóa Dataset)
  // ==========================================================================
  if (url.pathname === '/api/admin/dataset' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { dataset_id, action, status, credit_cost } = JSON.parse(body || '{}');
      const db = loadDb();
      const ds = db.datasets.find(d => d.id === dataset_id);

      if (ds) {
        if (action === 'delete') {
          db.datasets = db.datasets.filter(d => d.id !== dataset_id);
          addAuditLog(db, 'Quản trị viên (Admin)', 'Xóa Bộ dữ liệu', `Đã xóa vĩnh viễn "${ds.title}" (${ds.doi})`, 'admin');
        } else if (action === 'status' && status) {
          const wasPublished = ds.status === 'published';
          ds.status = status;
          if (status === 'published' && !wasPublished) {
            const owner = db.users.find(u => u.id === ds.owner_id);
            if (owner) {
              owner.contribution_points += (ds.credit_reward || 30);
              owner.uploads_count += 1;
            }
          }
          addAuditLog(db, 'Quản trị viên (Admin)', 'Cập nhật Trạng thái Dataset', `Chuyển "${ds.title}" sang trạng thái [${status}]`, 'admin');
        } else if (action === 'cost' && typeof credit_cost === 'number') {
          ds.credit_cost = Math.max(0, credit_cost);
          addAuditLog(db, 'Quản trị viên (Admin)', 'Cập nhật Phí tải Dataset', `Đặt phí tải "${ds.title}" = ${ds.credit_cost} Credits`, 'admin');
        }
        saveDb(db);
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ db }));
    });
    return;
  }

  // ==========================================================================
  // ADMIN API 3: Lưu Cấu hình Hệ thống & Chính sách Điểm
  // ==========================================================================
  if (url.pathname === '/api/admin/settings' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const payload = JSON.parse(body || '{}');
      const db = loadDb();
      db.settings = {
        ...db.settings,
        signup_bonus: Number(payload.signup_bonus ?? 50),
        upload_reward: Number(payload.upload_reward ?? 30),
        download_cost: Number(payload.download_cost ?? 5),
        author_royalty: Number(payload.author_royalty ?? 2),
        require_review: Boolean(payload.require_review),
        restrict_ctu_email: Boolean(payload.restrict_ctu_email)
      };
      addAuditLog(
        db,
        'Quản trị viên (Admin)',
        'Cập nhật Cấu hình Hệ thống',
        `Thưởng đăng ký: +${db.settings.signup_bonus} Cr | Đóng góp: +${db.settings.upload_reward} Cr | Phí tải: -${db.settings.download_cost} Cr | Duyệt bắt buộc: ${db.settings.require_review ? 'Bật' : 'Tắt'}`,
        'system'
      );
      saveDb(db);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ db }));
    });
    return;
  }

  // ==========================================================================
  // ADMIN API 4: Khôi phục Dữ liệu Gốc (Reset Demo State)
  // ==========================================================================
  if (url.pathname === '/api/admin/reset' && req.method === 'POST') {
    const fresh = JSON.parse(JSON.stringify(initialDb));
    addAuditLog(fresh, 'Quản trị viên (Admin)', 'Khôi phục Dữ liệu Gốc', 'Đã đặt lại toàn bộ CSDL về trạng thái mẫu chuẩn ban đầu.', 'system');
    saveDb(fresh);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ db: fresh }));
    return;
  }

  // Phục vụ giao diện Web App từ public/index.html
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(indexPath, 'utf8'));
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
}

// Chỉ mở cổng lắng nghe khi chạy trực tiếp (node server.mjs)
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    console.log(`✅ CTU Research Data Hub đang chạy tại: http://localhost:${PORT}`);
  });
}

export default requestHandler;
