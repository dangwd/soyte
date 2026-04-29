# 📁 Cấu trúc File - Dự án Sở Y Tế Hà Nội

Tài liệu này mô tả chi tiết cấu trúc file và chức năng của từng module trong dự án.

## 🗂️ Tổng quan thư mục

```
d:\FOXAI\soyte/
├── .env                    # Biến môi trường production
├── .env.dev                # Biến môi trường development
├── .gitignore              # Cấu hình git ignore
├── package.json            # Dependencies và scripts
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite build config
├── index.html              # Entry HTML
├── metadata.json           # Metadata dự án
│
├── App.tsx                 # Root component & routing
├── AuthContext.tsx         # Context xác thực người dùng
├── api.ts                  # Cấu hình API client
├── index.tsx               # Entry point React
├── types.ts                # Global types
├── constants.tsx           # Hằng số, dữ liệu mẫu
├── adminMenu.ts            # Cấu hình menu admin
│
├── assets/                 # Tài nguyên tĩnh (ảnh, font)
├── components/             # React components dùng chung
├── hooks/                  # Custom React hooks
├── pages/                  # Các trang ứng dụng
├── services/               # API services
├── styles/                 # CSS toàn cục
├── types/                  # TypeScript type definitions
├── utils/                  # Hàm tiện ích
└── public/                 # Public assets
```

---

## 📄 File gốc (Root)

| File | Mô tả |
|------|-------|
| `App.tsx` | Component gốc, định nghĩa routes, layout chính |
| `AuthContext.tsx` | Context provider quản lý trạng thái đăng nhập, token |
| `api.ts` | Cấu hình Axios/fetch, interceptors, base URL |
| `index.tsx` | Entry point, mount React vào DOM |
| `types.ts` | Định nghĩa type dùng toàn ứng dụng |
| `constants.tsx` | Dữ liệu tĩnh, danh sách tỉnh thành, cấu hình |
| `adminMenu.ts` | Cấu trúc menu sidebar cho admin |

---

## 🧩 Components (`/components/`)

### Components chính

| Component | Mô tả |
|-----------|-------|
| `AdminLayout.tsx` | Layout trang quản trị với sidebar, header |
| `AdminRoute.tsx` | Route guard kiểm tra quyền admin |
| `Layout.tsx` | Layout cơ bản cho trang public |
| `Header.tsx` | Header điều hướng chính |
| `Footer.tsx` | Footer trang web |
| `Sidebar.tsx` | *Nếu có* - Sidebar điều hướng |

### Components Form

| Component | Mô tả |
|-----------|-------|
| `FacilityForm.tsx` | Form quản lý cơ sở y tế |
| `PostForm.tsx` | Form tạo/sửa tin tức |
| `ScheduleForm.tsx` | Form lịch công tác |
| `UserModal.tsx` | Modal quản lý người dùng |
| `UserInfoModal.tsx` | Modal thông tin người dùng |

### Components Chart

| Component | Mô tả |
|-----------|-------|
| `Chart.tsx` | Component biểu đồ tổng quát |
| `StatsChart.tsx` | Biểu đồ thống kê |
| `SummaryCards.tsx` | Cards tổng kết số liệu |
| `SatisfactionRadarChart.tsx` | Biểu đồ radar mức độ hài lòng |
| `SectionStackedChart.tsx` | Biểu đồ stacked theo khu vực |
| `CombinedProgressQualityChart.tsx` | Biểu đồ tiến độ & chất lượng |

### Components Phản hồi (`/components/feedbacks/`)

| Component | Mô tả |
|-----------|-------|
| `FeedbackDataTable.tsx` | Bảng danh sách phản hồi |
| `FeedbackDetailsDialog.tsx` | Dialog chi tiết phản hồi |
| `FeedbackStatsSection.tsx` | Thống kê phản hồi |

### Components Chi tiết biểu mẫu (`/components/formDetail/`)

| Component | Mô tả |
|-----------|-------|
| `Form1.tsx` | Biểu mẫu khảo sát loại 1 |
| `Form2.tsx` | Biểu mẫu khảo sát loại 2 |
| `SurveyInfo.tsx` | Thông tin chung khảo sát |

### Components Báo cáo (`/components/report/`)

| Component | Mô tả |
|-----------|-------|
| `ReportFilters.tsx` | Bộ lọc báo cáo |
| `ReportHeader.tsx` | Header báo cáo |
| `ReportTabContent.tsx` | Nội dung tab báo cáo |
| `TCT01TabContent.tsx` | Nội dung tab TCT01 |
| `ReportAppendix.tsx` | Phụ lục báo cáo |
| `ReportStates.tsx` | Trạng thái báo cáo |
| `TablePreview.tsx` | Xem trước bảng dữ liệu |

### Components Mẫu (`/components/templates/`)

| Component | Mô tả |
|-----------|-------|
| `InfoBuilder.tsx` | Builder thông tin cơ bản |
| `EvaluateBuilder.tsx` | Builder đánh giá |
| `ReflectBuilder.tsx` | Builder phản ánh |

### Components khác

| Component | Mô tả |
|-----------|-------|
| `HospitalSlider.tsx` | Slider hiển thị bệnh viện |

---

## 📄 Pages (`/pages/`)

### Trang chính

| Page | Mô tả | Đường dẫn |
|------|-------|-----------|
| `Home.tsx` | Trang chủ | `/` |
| `Login.tsx` | Đăng nhập | `/login` |
| `Register.tsx` | Đăng ký | `/register` |
| `ForgotPassword.tsx` | Quên mật khẩu | `/forgot-password` |
| `ConfirmPassword.tsx` | Xác nhận mật khẩu | `/confirm-password` |
| `ChangePassword.tsx` | Đổi mật khẩu | `/change-password` |

### Trang quản trị

| Page | Mô tả | Đường dẫn |
|------|-------|-----------|
| `AdminDashboard.tsx` | Dashboard quản trị | `/admin` |
| `UserManagement.tsx` | Quản lý người dùng | `/admin/users` |
| `PermissionsManagement.tsx` | Quản lý phân quyền | `/admin/permissions` |
| `AdminWorkSchedule.tsx` | Lịch công tác admin | `/admin/schedule` |
| `SmtpSettings.tsx` | Cấu hình SMTP | `/admin/smtp` |

### Trang dữ liệu

| Page | Mô tả | Đường dẫn |
|------|-------|-----------|
| `HanoiSystem.tsx` | Hệ thống cơ sở y tế | `/hanoi-system` |
| `SocialFacilitiesManagement.tsx` | Cơ sở xã hội | `/social-facilities` |
| `HealthRecords.tsx` | Hồ sơ sức khỏe | `/health-records` |
| `HealthRecordsDetail.tsx` | Chi tiết hồ sơ | `/health-records/:id` |
| `DataLookup.tsx` | Tra cứu dữ liệu | `/data-lookup` |

### Trang tin tức & nội dung

| Page | Mô tả | Đường dẫn |
|------|-------|-----------|
| `NewsCategory.tsx` | Danh mục tin tức | `/news` |
| `NewsDetail.tsx` | Chi tiết tin tức | `/news/:id` |
| `DigitalTransformation.tsx` | Chuyển đổi số | `/digital-transformation` |
| `PolicyHealthInsurance.tsx` | Chính sách BHYT | `/policy-insurance` |

### Trang chức năng

| Page | Mô tả | Đường dẫn |
|------|-------|-----------|
| `HealthConsultation.tsx` | Tư vấn sức khỏe | `/health-consultation` |
| `EmergencyCenter.tsx` | Trung tâm cấp cứu | `/emergency` |
| `WorkSchedule.tsx` | Lịch công tác | `/work-schedule` |
| `FeedbacksManagement.tsx` | Quản lý phản hồi | `/feedbacks` |

### Trang khảo sát & biểu mẫu

| Page | Mô tả | Đường dẫn |
|------|-------|-----------|
| `SurveysManagement.tsx` | Quản lý khảo sát | `/surveys` |
| `FormList.tsx` | Danh sách biểu mẫu | `/forms` |
| `FormDetail.tsx` | Chi tiết biểu mẫu | `/forms/:id` |
| `TemplatesManagement.tsx` | Quản lý mẫu | `/templates` |
| `TemplateCreate.tsx` | Tạo mẫu mới | `/templates/create` |
| `TemplateQrView.tsx` | Xem mã QR mẫu | `/templates/qr/:id` |

### Trang báo cáo (`/pages/report/`)

| Page | Mô tả | Đường dẫn |
|------|-------|-----------|
| `Report_KSHL.tsx` | Báo cáo KSHL | `/report/kshl` |
| `Report_DCBC.tsx` | Báo cáo DCBC | `/report/dcbc` |
| `Report_TCT01.tsx` | Báo cáo TCT01 | `/report/tct01` |

---

## 🔧 Hooks (`/hooks/`)

| Hook | Mô tả |
|------|-------|
| `useFacilities.ts` | Quản lý dữ liệu cơ sở y tế |
| `useFeedbacks.ts` | Quản lý phản hồi |
| `useFeedbackStats.ts` | Thống kê phản hồi |
| `useKSHLData.ts` | Dữ liệu báo cáo KSHL |
| `useReportFilter.ts` | Bộ lọc báo cáo |
| `useTemplateForm.ts` | Quản lý form mẫu |

---

## 🔌 Services (`/services/`)

| Service | Mô tả |
|---------|-------|
| `feedBacksSevice.ts` | API phản hồi |
| `formService.ts` | API biểu mẫu |
| `socialFacilitiesService.ts` | API cơ sở xã hội |
| `surveyService.ts` | API khảo sát |
| `useSchedules.tsx` | Hook/API lịch công tác |

---

## 🛠️ Utils (`/utils/`)

| File | Mô tả |
|------|-------|
| `dateUtils.ts` | Xử lý ngày tháng |
| `permissionUtils.ts` | Kiểm tra quyền người dùng |
| `templateUtils.ts` | Xử lý mẫu biểu |
| `reportDataUtils.ts` | Xử lý dữ liệu báo cáo |
| `pdfFonts.ts` | Font chữ cho PDF |
| `pdfExport.ts` | Xuất file PDF |
| `pdfExportKSHL.ts` | Xuất PDF báo cáo KSHL |
| `pdfExportTCT01.ts` | Xuất PDF báo cáo TCT01 |
| `wordExport.ts` | Xuất file Word |
| `wordExportKSHL.ts` | Xuất Word báo cáo KSHL |
| `wordExportTCT01.ts` | Xuất Word báo cáo TCT01 |

---

## 📐 Types (`/types/`)

| File | Mô tả |
|------|-------|
| `DashboardStats.ts` | Types thống kê dashboard |
| `feedbacks.ts` | Types phản hồi |
| `templates.ts` | Types mẫu biểu |

---

## 🎨 Styles (`/styles/`)

| File | Mô tả |
|------|-------|
| `index.css` | CSS toàn cục, custom properties |

---

## 📦 Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
|------|---------|-------|
| Components | PascalCase | `UserManagement.tsx` |
| Hooks | camelCase + use | `useFeedbackStats.ts` |
| Utils | camelCase | `dateUtils.ts` |
| Types | PascalCase | `DashboardStats.ts` |
| Pages | PascalCase | `AdminDashboard.tsx` |
| Services | camelCase | `surveyService.ts` |

---

## 🔄 Luồng dữ liệu

```
Pages → Hooks → Services → API
  ↓
Components ← Utils
  ↓
Context (AuthContext)
```

1. **Pages**: Chứa logic trang, sử dụng hooks
2. **Hooks**: Quản lý state, gọi services
3. **Services**: Gọi API, xử lý request/response
4. **Components**: Hiển thị UI, nhận props
5. **Utils**: Xử lý dữ liệu thuần túy
6. **Context**: Quản lý state toàn cục (auth)
