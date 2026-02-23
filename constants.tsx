import { MenuItem, NewsItem, User } from "./types";

import {
  Newspaper,
  AlertTriangle,
  FileText,
  ShieldPlus,
  Stethoscope,
  MessageCircleHeart,
  FileHeart,
  Building2,
  Ambulance,
  Laptop2,
  HeartHandshake,
  Award,
  Home,
  Info,
  Users,
  Utensils,
  Syringe,
  CalendarDays,
  Search,
} from "lucide-react";

export const users: Omit<User, "role">[] = [
  { full_name: "TS.BS Nguyễn Trọng Diện – Giám đốc", id: 1 },
  { full_name: "TS. Nguyễn Đình Hưng – Phó Giám đốc", id: 2 },
  { full_name: "TS. Trần Văn Chung – Phó Giám đốc", id: 3 },
  { full_name: "TS. Ông Vũ Cao Cương – Phó Giám đốc", id: 4 },
  { full_name: "Đ/c Đinh Hồng Phong  – Phó Giám đốc", id: 5 },
];

export const SERVICE_CATEGORIES = [
  {
    id: 1,
    title: "Tin tức – Sự kiện y tế",
    path: "/news/events",
    icon: Newspaper,
    containerClass:
      "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-blue-200 hover:shadow-blue-300",
    iconBoxClass: "bg-blue-600 text-white shadow-blue-400/50",
    titleClass: "text-blue-900",
  },
  {
    id: 2,
    title: "Lịch công tác",
    // path: "http://lichcongtac.qnict.vn/sythanoi/",
    path: "/schedule",
    icon: CalendarDays,
    containerClass:
      "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 border-orange-200 hover:shadow-orange-300",
    iconBoxClass: "bg-orange-500 text-white shadow-orange-400/50",
    titleClass: "text-orange-900",
  },
  {
    id: 3,
    title: "Chính sách y tế – Bảo hiểm y tế",
    path: "/policy",
    icon: FileText,
    containerClass:
      "bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50 border-indigo-200 hover:shadow-indigo-300",
    iconBoxClass: "bg-indigo-600 text-white shadow-indigo-400/50",
    titleClass: "text-indigo-900",
  },
  {
    id: 4,
    title: "Phòng bệnh – Nâng cao sức khỏe",
    path: "/news/prevention",
    icon: ShieldPlus,
    containerClass:
      "bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 border-emerald-200 hover:shadow-emerald-300",
    iconBoxClass: "bg-emerald-600 text-white shadow-emerald-400/50",
    titleClass: "text-emerald-900",
  },
  {
    id: 5,
    title: "Khám bệnh - chữa bệnh",
    path: "/news/examination",
    icon: Stethoscope,
    containerClass:
      "bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-50 border-cyan-200 hover:shadow-cyan-300",
    iconBoxClass: "bg-cyan-600 text-white shadow-cyan-400/50",
    titleClass: "text-cyan-900",
  },
  {
    id: 6,
    title: "Tư vấn sức khỏe",
    path: "/consulting",
    icon: MessageCircleHeart,
    containerClass:
      "bg-gradient-to-br from-pink-50 via-pink-100 to-pink-50 border-pink-200 hover:shadow-pink-300",
    iconBoxClass: "bg-pink-500 text-white shadow-pink-400/50",
    titleClass: "text-pink-900",
  },
  {
    id: 7,
    title: "Hồ sơ sức khỏe toàn dân",
    path: "/health-records",
    icon: FileHeart,
    containerClass:
      "bg-gradient-to-br from-sky-50 via-sky-100 to-sky-50 border-sky-200 hover:shadow-sky-300",
    iconBoxClass: "bg-sky-600 text-white shadow-sky-400/50",
    titleClass: "text-sky-900",
  },
  {
    id: 8,
    title: "Hệ thống y tế Thủ đô",
    path: "/hanoi-system",
    icon: Building2,
    containerClass:
      "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 border-slate-200 hover:shadow-slate-300",
    iconBoxClass: "bg-slate-600 text-white shadow-slate-400/50",
    titleClass: "text-slate-900",
  },
  {
    id: 9,
    title: "Trung tâm điều hành cấp cứu thông minh",
    path: "/emergency",
    icon: Ambulance,
    containerClass:
      "bg-gradient-to-br from-red-50 via-red-100 to-red-50 border-red-200 hover:shadow-red-300",
    iconBoxClass: "bg-red-600 text-white shadow-red-400/50",
    titleClass: "text-red-900",
  },
  {
    id: 10,
    title: "Chuyển đổi số",
    path: "/data-lookup",
    icon: Search,
    containerClass:
      "bg-gradient-to-br from-violet-50 via-violet-100 to-violet-50 border-violet-200 hover:shadow-violet-300",
    iconBoxClass: "bg-violet-600 text-white shadow-violet-400/50",
    titleClass: "text-violet-900",
  },
  {
    id: 11,
    title: "Bảo trợ xã hội",
    path: "/news/social",
    icon: HeartHandshake,
    containerClass:
      "bg-gradient-to-br from-teal-50 via-teal-100 to-teal-50 border-teal-200 hover:shadow-teal-300",
    iconBoxClass: "bg-teal-600 text-white shadow-teal-400/50",
    titleClass: "text-teal-900",
  },
  {
    id: 12,
    title: "Gương người tốt – việc tốt ngành Y",
    path: "/news/good-deeds",
    icon: Award,
    containerClass:
      "bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 border-yellow-200 hover:shadow-yellow-300",
    iconBoxClass: "bg-yellow-500 text-white shadow-yellow-400/50",
    titleClass: "text-yellow-900",
  },
];
export const SERVICE_CATEGORIES_FILTER = [
  {
    id: 1,
    title: "Tin tức – Sự kiện y tế",
    path: "/news/events",
  },
  {
    id: 2,
    title: "Cảnh báo y tế – Truyền thông nguy cơ",
    path: "/news/alerts",
  },
  {
    id: 3,
    title: "Khám bệnh - chữa bệnh",
    path: "/examination",
  },
  {
    id: 4,
    title: "Phòng bệnh – Nâng cao sức khỏe",
    path: "/news/prevention",
  },
  {
    id: 5,
    title: "Bảo trợ xã hội",
    path: "/news/examination",
  },
  {
    id: 6,
    title: "Chuyển đổi số",
    path: "/consulting",
  },
  {
    id: 7,
    title: "Chính sách y tế - bảo hiểm y tế",
    path: "/health-records",
  },
  {
    id: 8,
    title: "Gương người tốt – việc tốt ngành Y",
    path: "/good-deeds",
  },
];
export const MOCK_VIDEOS = [
  {
    id: "v1",
    title:
      "Bản tin Y tế Hà Nội: Toàn cảnh công tác phòng chống dịch tuần 1 tháng 1/2026",
    duration: "05:30",
    thumbnail: "https://picsum.photos/seed/video1/800/450",
    date: "07/01/2026",
  },
  {
    id: "v2",
    title:
      "Phóng sự: Những chiến sĩ áo trắng thầm lặng đêm Giao thừa Tết Bính Ngọ",
    duration: "08:45",
    thumbnail: "https://picsum.photos/seed/video2/800/450",
    date: "10/01/2026",
  },
  {
    id: "v3",
    title: "Hướng dẫn người dân sử dụng ứng dụng Hồ sơ sức khỏe điện tử",
    duration: "03:15",
    thumbnail: "https://picsum.photos/seed/video3/800/450",
    date: "02/01/2026",
  },
  {
    id: "v4",
    title: "Tọa đàm: Nâng cao chất lượng khám chữa bệnh tại y tế cơ sở",
    duration: "15:20",
    thumbnail: "https://picsum.photos/seed/video4/800/450",
    date: "28/12/2025",
  },
  {
    id: "v5",
    title: "Chuyên mục Sức khỏe: Phòng chống bệnh tiểu đường",
    duration: "10:00",
    thumbnail: "https://picsum.photos/seed/video5/800/450",
    date: "25/12/2025",
  },
];

export const MAIN_MENU: MenuItem[] = [
  { id: "home", title: "Trang chủ", path: "/", icon: Home },
  {
    id: "news",
    title: "Tin tức",
    path: "/news/events",
    icon: Newspaper,
    children: [
      {
        id: "news-events",
        title: "Tin tức – Sự kiện y tế",
        path: "/news/events",

        icon: Newspaper,
      },
      {
        id: "alerts",
        title: "Cảnh báo y tế - Truyền thông nguy cơ",
        path: "/news/alerts",
        icon: AlertTriangle,
      },
      {
        id: "good-deeds",
        title: "Gương người tốt – việc tốt",
        path: "/news/good-deeds",
        icon: Award,
      },
    ],
  },
  {
    id: "medical-pro",
    title: "Khám chữa bệnh",
    path: "/news/examination",
    icon: Stethoscope,
    children: [
      {
        id: "exam-general",
        title: "Thông tin khám chữa bệnh",
        path: "/news/examination",
        icon: Stethoscope,
      },
      {
        id: "food-safety",
        title: "Tư vấn sức khỏe",
        path: "/consulting",
        icon: Utensils,
      },
      {
        id: "population",
        title: "Hồ sơ sức khỏe toàn dân",
        path: "/health-records",
        icon: Users,
      },
    ],
  },
  { id: "policy", title: "Chính sách - BHYT", path: "/policy", icon: Info },
  {
    id: "system",
    title: "Hệ thống y tế",
    path: "/hanoi-system",
    icon: Building2,
    children: [
      {
        id: "system-network",
        title: "Mạng lưới cơ sở y tế",
        path: "/hanoi-system",
        icon: Building2,
      },
      {
        id: "emergency",
        title: "Trung tâm cấp cứu thông minh",
        path: "/emergency",
        icon: Ambulance,
      },
    ],
  },
  {
    id: "digital",
    title: "Chuyển đổi số",
    path: "/data-lookup",
    icon: Laptop2,
  },
  {
    id: "social-security",
    title: "An sinh xã hội",
    path: "/social-security",
    icon: Info,
  },
  {
    id: "guide",
    title: "Giới thiệu/Liên hệ",
    path: "#",
    icon: HeartHandshake,
    children: [
      {
        id: "work-schedule",
        // linkUrl :"http://lichcongtac.qnict.vn/sythanoi/",
        title: "Lịch công tác",
        path: "/schedule",
        icon: CalendarDays,
      },
      {
        id: "guide-exam",
        title: "Quy trình khám bệnh",
        path: "/guide/exam",
        icon: FileText,
      },
      {
        id: "guide-insurance",
        title: "Bảo hiểm y tế",
        path: "/policy",
        icon: ShieldPlus,
      },
      {
        id: "guide-vaccine",
        title: "Lịch tiêm chủng",
        path: "/guide/vaccine",
        icon: Syringe,
      },
    ],
  },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Hà Nội triển khai thí điểm hồ sơ sức khỏe điện tử toàn dân",
    excerpt:
      "Sở Y tế Hà Nội vừa ban hành kế hoạch triển khai thí điểm lập hồ sơ sức khỏe điện tử cho người dân trên địa bàn 30 quận, huyện, thị xã nhằm nâng cao chất lượng quản lý sức khỏe cộng đồng.",
    date: "12/05/2024",
    image: "https://chuyendoiso.quangngai.gov.vn/items/cms/4347.jpg",
    category: "news-events",
    isFeatured: true,
  },
  {
    id: 2,
    title:
      "Cảnh báo dịch sốt xuất huyết có xu hướng gia tăng tại một số quận huyện",
    excerpt:
      "Theo Trung tâm Kiểm soát bệnh tật (CDC) Hà Nội, số ca mắc sốt xuất huyết trên địa bàn thành phố đang có dấu hiệu tăng nhanh tại các khu vực dân cư đông đúc.",
    date: "11/05/2024",
    image:
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&auto=format&fit=crop",
    category: "alerts",
  },
  {
    id: 3,
    title: "Bác sĩ Bệnh viện Xanh Pôn cứu sống bệnh nhân bị vỡ tạng do tai nạn",
    excerpt:
      "Các bác sĩ Khoa Ngoại tiêu hóa, Bệnh viện Đa khoa Xanh Pôn vừa thực hiện thành công ca phẫu thuật cấp cứu cho một bệnh nhân bị chấn thương bụng kín nghiêm trọng.",
    date: "10/05/2024",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop",
    category: "good-deeds",
  },
  {
    id: 4,
    title:
      "Hà Nội tăng cường kiểm tra an toàn thực phẩm tại các bếp ăn trường học",
    excerpt:
      "Sở Y tế phối hợp với Sở Giáo dục và Đào tạo Hà Nội thành lập các đoàn kiểm tra liên ngành nhằm đảm bảo an toàn vệ sinh thực phẩm cho học sinh.",
    date: "09/05/2024",
    image:
      "https://images.unsplash.com/photo-1547573854-74d2a71d0826?q=80&w=800&auto=format&fit=crop",
    category: "news-events",
  },
  {
    id: 5,
    title:
      "Khám bệnh, phát thuốc miễn phí cho người cao tuổi tại huyện Sóc Sơn",
    excerpt:
      "Hơn 500 người cao tuổi tại xã Minh Phú, huyện Sóc Sơn đã được các y bác sĩ tình nguyện khám bệnh, tư vấn sức khỏe và cấp phát thuốc miễn phí.",
    date: "08/05/2024",
    image:
      "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=800&auto=format&fit=crop",
    category: "social",
  },
  {
    id: 6,
    title: "Thủ tục đăng ký bảo hiểm y tế hộ gia đình trực tuyến",
    excerpt:
      "Hướng dẫn chi tiết các bước đăng ký tham gia bảo hiểm y tế hộ gia đình qua cổng dịch vụ công quốc gia và ứng dụng VssID.",
    date: "07/05/2024",
    image:
      "https://images.unsplash.com/photo-1454165205744-3b78555e5572?q=80&w=800&auto=format&fit=crop",
    category: "policy",
  },
  {
    id: 7,
    title: "Lợi ích của việc tiêm chủng mở rộng đối với trẻ em",
    excerpt:
      "Tiêm chủng là biện pháp hiệu quả nhất để phòng ngừa các bệnh truyền nhiễm nguy hiểm ở trẻ nhỏ, giúp xây dựng hệ miễn dịch cộng đồng vững mạnh.",
    date: "06/05/2024",
    image:
      "https://images.unsplash.com/photo-1584362946444-1e7c4f9b7113?q=80&w=800&auto=format&fit=crop",
    category: "prevention",
  },
  {
    id: 8,
    title: "Chuyển đổi số ngành y tế: Bước tiến mới trong quản lý bệnh viện",
    excerpt:
      "Việc áp dụng bệnh án điện tử và hệ thống quản lý thông tin bệnh viện (HIS) giúp tối ưu hóa quy trình khám chữa bệnh và giảm thời gian chờ đợi của bệnh nhân.",
    date: "05/05/2024",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
    category: "digital",
  },
];

export const MOCK_INTERNATIONAL = [
  {
    id: "i1",
    title:
      "WHO cảnh báo biến chủng cúm mới: Việt Nam chủ động giám sát ngay từ cửa khẩu",
    date: "13/01/2026",
    image: "https://picsum.photos/seed/inter1/600/400",
  },
  {
    id: "i2",
    title:
      "Hợp tác y tế Việt - Nhật: Chuyển giao công nghệ phẫu thuật nội soi bằng Robot",
    date: "09/01/2026",
    image: "https://picsum.photos/seed/inter2/600/400",
  },
  {
    id: "i3",
    title:
      'Các nước ASEAN thống nhất cơ chế "Hộ chiếu vắc xin" điện tử phiên bản 2.0',
    date: "28/12/2025",
    image: "https://picsum.photos/seed/inter3/600/400",
  },
];
export const MOCK_CULTURE = [
  {
    id: "s1",
    title:
      "Giải bóng đá Cup Sức khỏe Thủ đô 2026: Bệnh viện Thanh Nhàn vô địch",
    date: "14/01/2026",
    image: "https://picsum.photos/seed/sport1/600/400",
  },
  {
    id: "s2",
    title: "Hội thao ngành Y tế: Hơn 2.000 vận động viên tham gia chạy việt dã",
    date: "08/01/2026",
    image: "https://picsum.photos/seed/sport2/600/400",
  },
  {
    id: "s3",
    title:
      'Phong trào rèn luyện sức khỏe "Mỗi người dân đi bộ 10.000 bước mỗi ngày"',
    date: "01/01/2026",
    image: "https://picsum.photos/seed/sport3/600/400",
  },
];
export const MOCK_SPORTS = [
  {
    id: "s1",
    title:
      "Giải bóng đá Cup Sức khỏe Thủ đô 2026: Bệnh viện Thanh Nhàn vô địch",
    date: "14/01/2026",
    image: "https://picsum.photos/seed/sport1/600/400",
  },
  {
    id: "s2",
    title: "Hội thao ngành Y tế: Hơn 2.000 vận động viên tham gia chạy việt dã",
    date: "08/01/2026",
    image: "https://picsum.photos/seed/sport2/600/400",
  },
  {
    id: "s3",
    title:
      'Phong trào rèn luyện sức khỏe "Mỗi người dân đi bộ 10.000 bước mỗi ngày"',
    date: "01/01/2026",
    image: "https://picsum.photos/seed/sport3/600/400",
  },
];

export const CATEGORIES = [
  {
    id: 3,
    title: "Khám bệnh - chữa bệnh",
    icon: Stethoscope,
    iconColor: "text-pink-600",
    hoverColor: "text-pink-600",
    image: "https://suckhoethudo.vn/assets/kham benh-__1wzyZ_.png",
    data: [],
  },
  {
    id: 4,
    title: "Phòng bệnh - Nâng cao sức khỏe",
    icon: ShieldPlus,
    iconColor: "text-orange-500",
    hoverColor: "text-orange-600",
    image: "https://suckhoethudo.vn/assets/phong benh-CTWuljBT.png",
    data: [],
    paddingClass: "md:pl-8",
  },
  {
    id: 5,
    title: "Bảo trợ xã hội",
    icon: HeartHandshake,
    iconColor: "text-blue-500",
    hoverColor: "text-blue-600",
    image: "https://suckhoethudo.vn/assets/bao tro XH-By5fco0o.png",
    data: [],
    paddingClass: "md:pl-8",
  },
  {
    id: 6,
    title: "Chuyển đổi số y tế",
    icon: Laptop2,
    iconColor: "text-pink-600",
    hoverColor: "text-pink-600",
    image: "https://suckhoethudo.vn/assets/chuyen doi so-DSivldkT.png",
    data: [],
  },
  {
    id: 7,
    title: "Chính sách y tế - Bảo hiểm y tế",
    icon: FileText,
    iconColor: "text-orange-500",
    hoverColor: "text-orange-600",
    image: "https://suckhoethudo.vn/assets/chinh sach y te-C_dDpJVZ.png",
    data: [],
    paddingClass: "md:pl-8",
  },
  {
    id: 8,
    title: "Gương người tốt - việc tốt",
    icon: Award,
    iconColor: "text-blue-500",
    hoverColor: "text-blue-600",
    image: "https://suckhoethudo.vn/assets/guong nguoi tot-C7NJJGDV.png",
    data: [],
    paddingClass: "md:pl-8",
  },
];
