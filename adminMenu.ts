import {
  LayoutDashboard,
  User,
  CalendarDays,
  NotebookText,
  MessageSquare,
  Building2,
} from "lucide-react";

export type MenuChild = {
  key: string;
  label: string;
  to: string;
};

export type MenuItem = {
  key: string;
  label: string;
  icon: any;
  to?: string;
  children?: MenuChild[];
};

export const adminMenu: MenuItem[] = [
  {
    key: "posts",
    label: "Quản lý bài viết",
    icon: LayoutDashboard,
    to: "/admin/dashboard",
  },
  {
    key: "users",
    label: "Quản lý người dùng",
    icon: User,
    to: "/admin/users",
  },
  {
    key: "schedules",
    label: "Quản lý lịch công tác",
    icon: CalendarDays,
    to: "/admin/schedules",
  },
  {
    key: "templates",
    label: "Quản lý biểu mẫu",
    icon: NotebookText,
    to: "/admin/templates",
  },
  {
    key: "feedbacks",
    label: "Quản lý phản hồi",
    icon: MessageSquare,
    children: [
      {
        key: "feedback-list",
        label: "Danh sách phản hồi",
        to: "/admin/feedbacks/form",
      },
      {
        key: "feedback-statistics",
        label: "Thống kê phản hồi",
        to: "/admin/feedbacks/feedback",
      },
    ],
  },
  {
    key: "facilities",
    label: "Quản lý CSYT",
    icon: Building2,
    to: "/admin/social-facilities",
  },
];
