import React, { useState, useEffect, useMemo, useRef } from "react";
import AdminLayout from "../components/AdminLayout";
import { useSchedules } from "../services/useSchedules";
import { WorkSchedule } from "../types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  CalendarDays,
  Loader2,
  CheckCircle,
  Clock,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import ScheduleForm from "../components/ScheduleForm";
import { Dropdown, Button, Toast, InputText } from "@/components/prime";
import { users } from "../constants";
import { confirmDialog } from "primereact/confirmdialog";

const userMap = users.reduce(
  (acc, user) => {
    acc[user.id] = user.full_name;
    return acc;
  },
  {} as Record<number, string>,
);

const AdminWorkSchedule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "completed" | "cancelled"
  >("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<
    WorkSchedule | undefined
  >(undefined);
  const toast = useRef<Toast>(null);
  const {
    schedules,
    loading,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useSchedules();
  useEffect(() => {
    fetchSchedules({
      status: filterStatus === "all" ? undefined : filterStatus,
      searchTerm: searchTerm,
    });
  }, [fetchSchedules, filterStatus, searchTerm]);

  const handleOpenForm = (schedule?: WorkSchedule) => {
    setEditingSchedule(schedule);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSchedule(undefined);
  };

  const handleSaveSchedule = async (
    scheduleData: Omit<
      WorkSchedule,
      "id" | "status" | "createdAt" | "updatedAt"
    >,
  ) => {
    try {
      if (editingSchedule?.id) {
        await updateSchedule(editingSchedule.id, scheduleData);
        toast.current?.show({
          severity: "success",
          summary: "Thành công",
          detail: "Cập nhật lịch trình thành công!",
          life: 3000,
        });
      } else {
        await createSchedule(scheduleData);
        toast.current?.show({
          severity: "success",
          summary: "Thành công",
          detail: "Tạo lịch trình mới thành công!",
          life: 3000,
        });
      }
      handleCloseForm();
      fetchSchedules({
        status: filterStatus === "all" ? undefined : filterStatus,
        searchTerm: searchTerm,
      });
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: `Lỗi: ${err.message || "Không thể lưu lịch trình."}`,
        life: 3000,
      });
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa lịch trình này?",
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Xóa",
      rejectLabel: "Hủy",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-text",
      accept: async () => {
        try {
          await deleteSchedule(id);
          toast.current?.show({
            severity: "success",
            summary: "Thành công",
            detail: "Xóa lịch trình thành công!",
            life: 3000,
          });
          fetchSchedules({
            status: filterStatus === "all" ? undefined : filterStatus,
            searchTerm: searchTerm,
          });
        } catch (err: any) {
          toast.current?.show({
            severity: "error",
            summary: "Lỗi",
            detail: `Lỗi: ${err.message || "Không thể xóa lịch trình."}`,
            life: 3000,
          });
        }
      },
    });
  };
  const statusOptions = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "Đang chờ", value: "pending" },
    { label: "Hoàn thành", value: "completed" },
    { label: "Hủy bỏ", value: "cancelled" },
  ];

  const stats = useMemo(
    () => ({
      total: schedules?.length || 0,
      pending:
        (schedules.length > 0 &&
          schedules.filter((s) => s.status === "pending").length) ||
        0,
      completed:
        (schedules.length > 0 &&
          schedules.filter((s) => s.status === "completed").length) ||
        0,
    }),
    [schedules],
  );

  return (
    <AdminLayout title="Quản lý Lịch công tác">
      <Toast ref={toast} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          icon={CalendarDays}
          title="Tổng số lịch trình"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={Clock}
          title="Đang chờ"
          value={stats.pending}
          color="amber"
        />
        <StatCard
          icon={CheckCircle}
          title="Đã hoàn thành"
          value={stats.completed}
          color="green"
        />
        <div className="flex flex-col justify-center">
          <Button
            onClick={() => handleOpenForm()}
            className="w-full !bg-secondary-600 hover:!bg-secondary-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-secondary-100 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
          >
            <Plus size={24} /> THÊM LỊCH TRÌNH
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-wrap gap-4">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề, địa điểm..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 font-medium text-sm"
            />
          </div>
          <Dropdown
            value={filterStatus}
            options={statusOptions}
            onChange={(e) => setFilterStatus(e.value)}
            placeholder="Tất cả trạng thái"
            className="w-full md:w-auto"
            panelClassName="text-sm"
            showClear={false}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 h-[3rem] text-left text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="p-2 ">Lịch trình</th>
                <th className="p-2">Thời gian & Địa điểm</th>
                <th className="p-2">Cán bộ</th>
                <th className="p-2 text-center">Mức độ</th>
                <th className="p-2 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <Loader2
                      size={40}
                      className="animate-spin text-primary-600 mx-auto mb-4"
                    />
                    <p className="text-gray-400 font-bold uppercase text-[10px]">
                      Đang tải dữ liệu lịch trình...
                    </p>
                  </td>
                </tr>
              ) : (
                schedules.length > 0 &&
                schedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 max-w-xs">
                      <p className="font-bold text-gray-800 text-sm truncate">
                        {schedule.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {schedule.content}
                      </p>
                    </td>
                    <td className="p-2 text-sm text-gray-700">
                      <div className="font-medium">
                        {format(
                          new Date(schedule.start_time),
                          "HH:mm, dd/MM/yyyy",
                          { locale: vi },
                        )}{" "}
                        -{" "}
                        {format(
                          new Date(schedule.end_time),
                          "HH:mm, dd/MM/yyyy",
                          { locale: vi },
                        )}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={12} /> {schedule.location}
                      </div>
                    </td>
                    <td className="p-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <UserIcon size={14} className="text-gray-400" />
                        {userMap[schedule.presider_id]}
                      </div>
                    </td>

                    <td className="p-2 text-center">
                      <span
                        className={`py-1 px-3 rounded-full text-xs font-bold ${
                          schedule.priority === "NORMAL"
                            ? "bg-green-200 text-green-700"
                            : schedule.priority === "IMPORTANT"
                              ? "bg-yellow-200 text-yellow-700"
                              : "bg-red-200 text-red-700"
                        }`}
                      >
                        {schedule.priority === "NORMAL"
                          ? "Bình thường"
                          : schedule.priority === "IMPORTANT"
                            ? "Quan trọng"
                            : "Khẩn cấp"}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      {/* <div className="flex items-center justify-center"> */}
                      <Button
                        icon={<Edit3 size={18} />}
                        text
                        rounded
                        onClick={() => handleOpenForm(schedule)}
                      />
                      <Button
                        icon={<Trash2 size={18} />}
                        text
                        rounded
                        severity="danger"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      />
                      {/* </div> */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!loading && schedules.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <CalendarDays size={32} />
              </div>
              <p className="text-gray-400 font-bold">
                {searchTerm || filterStatus !== "all"
                  ? "Không tìm thấy lịch trình nào phù hợp."
                  : "Chưa có lịch trình nào được tạo."}
              </p>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <ScheduleForm
          initialData={editingSchedule}
          onClose={handleCloseForm}
          onSave={handleSaveSchedule}
        />
      )}
    </AdminLayout>
  );
};
interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  color: "blue" | "green" | "amber";
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  color,
}) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all transform hover:-translate-y-1">
      <div
        className={`w-12 h-12 ${colors[color]} rounded-xl flex items-center justify-center`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase">
          {title}
        </p>
        <h3 className="text-2xl font-black text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

export default AdminWorkSchedule;
