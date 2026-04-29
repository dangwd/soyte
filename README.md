<div align="center">

# 🏥 Cổng Thông Tin & Quản Trị - Sở Y Tế Hà Nội

**Giải pháp quản lý y tế hiện đại, trực quan và hiệu quả**  
**Tác giả: An Tú**

</div>

---

## 🌟 Giới thiệu

Dự án **Sở Y tế Hà Nội - Cổng thông tin** là hệ thống quản trị y tế toàn diện, hỗ trợ quản lý cơ sở y tế, tin tức, người dùng, khảo sát và báo cáo. Ứng dụng cung cấp giao diện hiện đại, tối ưu trải nghiệm người dùng với khả năng xử lý dữ liệu mạnh mẽ.

## ✨ Tính năng nổi bật

### � Quản trị hệ thống
- **Dashboard thống kê**: Biểu đồ trực quan về dữ liệu hệ thống
- **Quản lý người dùng**: Phân quyền, quản lý tài khoản và nhóm quyền
- **Quản lý phản hồi**: Theo dõi và xử lý ý kiến đóng góp
- **Quản lý khảo sát**: Tạo và phân tích khảo sát chất lượng

### 🏥 Quản lý y tế
- **Cơ sở y tế**: Quản lý bệnh viện, trạm y tế, chi cục
- **Cơ sở xã hội**: Quản lý cơ sở dưỡng lão, trung tâm chăm sóc
- **Lịch công tác**: Quản lý lịch làm việc cán bộ y tế
- **Tư vấn sức khỏe**: Hệ thống hỏi đáp y tế

### 📋 Báo cáo & Xuất file
- **Báo cáo KSHL**: Kiểm soát hoạt động lâm sàng
- **Báo cáo DCBC**: Điều chuyển bệnh chuyên khoa
- **Báo cáo TCT01**: Thống kê công tác 01
- **Xuất file**: Hỗ trợ PDF, Word với định dạng chuẩn

### 📝 Quản lý nội dung
- **Tin tức**: Hệ thống CMS với phân loại chuyên mục
- **Biểu mẫu**: Quản lý và tạo biểu mẫu động
- **Mẫu QR**: Tạo mã QR cho khảo sát

### 🔐 Xác thực & Bảo mật
- Đăng nhập, đăng ký tài khoản
- Quên mật khẩu, đổi mật khẩu
- Phân quyền chi tiết theo chức năng

## 🛠️ Công nghệ

| Danh mục | Công nghệ |
|----------|-----------|
| **Frontend** | React 18, TypeScript 5.8 |
| **Build Tool** | Vite 6.4 |
| **UI Library** | PrimeReact 10.9 |
| **Icons** | Lucide React |
| **Bản đồ** | Leaflet, React Leaflet |
| **Biểu đồ** | Chart.js, Recharts |
| **Xuất file** | jsPDF, docx |
| **State** | React Context API |
| **Ngày tháng** | date-fns |

## � Cấu trúc thư mục

```
soyte/
├── components/          # Component dùng chung
│   ├── feedbacks/       # Components phản hồi
│   ├── formDetail/      # Components chi tiết biểu mẫu
│   ├── report/          # Components báo cáo
│   ├── templates/       # Components mẫu biểu
│   └── prime/           # Components PrimeReact tùy chỉnh
├── pages/               # Các trang ứng dụng
│   └── report/          # Trang báo cáo
├── services/            # API services
├── hooks/               # Custom React hooks
├── utils/               # Tiện ích xử lý dữ liệu
├── types/               # TypeScript interfaces
├── styles/              # CSS toàn cục
├── assets/              # Hình ảnh, font
└── public/              # Tài nguyên tĩnh
```

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js 18+
- npm hoặc pnpm

### Cài đặt

```bash
# Clone dự án
git clone [url]
cd soyte

# Cài dependencies
npm install
# hoặc
pnpm install

# Chạy dev server
npm run dev
```

Ứng dụng chạy tại: `http://localhost:5173`

### Build

```bash
# Build dev
npm run build:dev

# Build production
npm run build:golive
```

## 📚 Tài liệu

- [Cấu trúc file chi tiết](./PROJECT_STRUCTURE.md)

---

<div align="center">
  <p>Được phát triển với ❤️ cho nền y tế Thủ đô</p>
</div>
