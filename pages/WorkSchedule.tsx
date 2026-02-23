import { useState, useEffect } from "react";
import {
  Printer,
  ChevronRight,
  CalendarDays,
  Home,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/prime";
import { WorkSchedule as WorkScheduleType } from "@/types";
import { format, parseISO, isSameDay, startOfDay, isBefore } from "date-fns";
import { vi } from "date-fns/locale";
interface GroupedSchedule {
  dateKey: string;
  formattedDate: string;
  isToday: boolean;
  items: WorkScheduleType[];
}
const mockScheduleData: WorkScheduleType[] = [
  {
    id: 1,
    title: "Hội nghị ký kết hỗ trợ, hợp tác chuyên môn",
    leader: "GĐ Nguyễn Trọng Diện",
    content:
      "Dự Hội nghị ký kết hỗ trợ, hợp tác chuyên môn giữa các bệnh viện Thành phố với Trạm Y tế phường Việt Hưng",
    start_time: "2026-02-24T02:30:00.000Z",
    end_time: "2026-02-24T04:00:00.000Z",
    location: "UBND phường Việt Hưng",
    presider_id: 1,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "IMPORTANT",
    attendee_ids: [1],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Báo cáo phát triển khoa học, công nghệ và chuyển đổi số",
    leader: "GĐ Nguyễn Trọng Diện",
    content:
      "Báo cáo một số nội dung phát triển khoa học, công nghệ, đổi mới sáng tạo, chuyển đổi số gắn với phát triển nguồn nhân lực chất lượng cao trên địa bàn Thành phố năm 2026",
    start_time: "2026-02-24T09:00:00.000Z",
    end_time: "2026-02-24T10:30:00.000Z",
    location: "Điểm cầu SYT",
    presider_id: 1,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "IMPORTANT",
    attendee_ids: [1],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 3,
    title: "Tổng kết công tác Hội điều dưỡng năm 2025",
    leader: "GĐ Nguyễn Trọng Diện",
    content: "Tổng kết công tác Hội điều dưỡng năm 2025",
    start_time: "2026-02-25T01:00:00.000Z",
    end_time: "2026-02-25T02:30:00.000Z",
    location: "Hội trường BV Hữu nghị",
    presider_id: 1,
    coordinating_unit: "Hội Điều dưỡng",
    priority: "NORMAL",
    attendee_ids: [1],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 4,
    title: "Hội nghị triển khai công tác Dân số và phát triển năm 2026",
    leader: "GĐ Nguyễn Trọng Diện",
    content:
      "Hội nghị trực tuyến triển khai công tác Dân số và phát triển năm 2026",
    start_time: "2026-02-25T01:30:00.000Z",
    end_time: "2026-02-25T03:00:00.000Z",
    location: "Phòng họp SYT",
    presider_id: 1,
    coordinating_unit: "Chi cục Dân số",
    priority: "NORMAL",
    attendee_ids: [1],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 5,
    title: "Tập huấn công tác phòng chống tham nhũng",
    leader: "GĐ Nguyễn Trọng Diện",
    content:
      "Tham dự tập huấn công tác phòng chống tham nhũng, tiêu cực năm 2026",
    start_time: "2026-02-25T01:30:00.000Z",
    end_time: "2026-02-25T03:00:00.000Z",
    location: "Hội trường SYT",
    presider_id: 1,
    coordinating_unit: "Thanh tra Sở",
    priority: "NORMAL",
    attendee_ids: [1],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 6,
    title: "Hội nghị giao ban với cơ sở tháng 01/2026",
    leader: "GĐ Nguyễn Trọng Diện",
    content: "Hội nghị giao ban với cơ sở tháng 01 năm 2026",
    start_time: "2026-02-25T06:30:00.000Z",
    end_time: "2026-02-25T08:00:00.000Z",
    location: "Hội trường Bộ TLTĐ",
    presider_id: 1,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "IMPORTANT",
    attendee_ids: [1],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 7,
    title: "Gặp mặt nhân dịp Tết Nguyên đán Bính Ngọ 2026",
    leader: "GĐ Nguyễn Trọng Diện",
    content: "Dự buổi gặp mặt thân mật nhân dịp Tết Nguyên đán Bính Ngọ 2026",
    start_time: "2026-02-26T02:00:00.000Z",
    end_time: "2026-02-26T03:30:00.000Z",
    location: "Hội trường SYT",
    presider_id: 1,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "LOW",
    attendee_ids: [1],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 8,
    title: "Họp triển khai Quyết định 118/QĐ-TTg",
    leader: "PGĐ Nguyễn Đình Hưng",
    content:
      "Họp triển khai thực hiện Quyết định số 118/QĐ-TTg ngày 16/01/2026 của Thủ tướng Chính phủ phê duyệt Đề án tăng cường năng lực hệ thống giám định pháp y, pháp y tâm thần và bắt buộc chữa bệnh tâm thần giai đoạn 2026-2030",
    start_time: "2026-02-24T02:00:00.000Z",
    end_time: "2026-02-24T03:30:00.000Z",
    location: "Phòng họp số 3, tầng 3, nhà A Bộ Y tế",
    presider_id: 2,
    coordinating_unit: "Bộ Y tế",
    priority: "IMPORTANT",
    attendee_ids: [2],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 9,
    title: "Thăm và tặng quà các cơ sở bảo trợ",
    leader: "PGĐ Nguyễn Đình Hưng",
    content:
      "Thăm, tặng quà Bệnh viện 09, TTCSPHCN NTT1, TTBXH 1, TTCSPHCNNTT 2",
    start_time: "2026-02-24T01:00:00.000Z",
    end_time: "2026-02-24T02:30:00.000Z",
    location: "Các cơ sở bảo trợ xã hội",
    presider_id: 2,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "NORMAL",
    attendee_ids: [2],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 10,
    title: "Hội nghị viên chức, người lao động năm 2026",
    leader: "PGĐ Nguyễn Đình Hưng",
    content: "Hội nghị viên chức, người lao động năm 2026 của TTKNTMPTP",
    start_time: "2026-02-25T01:00:00.000Z",
    end_time: "2026-02-25T02:30:00.000Z",
    location: "TTKNTMPTP",
    presider_id: 2,
    coordinating_unit: "TTKNTMPTP",
    priority: "NORMAL",
    attendee_ids: [2],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 11,
    title: "Hội nghị khoa học Bệnh viện Da liễu Hà Nội 2026",
    leader: "PGĐ Nguyễn Đình Hưng",
    content: "Dự hội nghị khoa học Bệnh viện Da liễu Hà Nội năm 2026",
    start_time: "2026-02-26T00:00:00.000Z",
    end_time: "2026-02-26T01:30:00.000Z",
    location: "Khách sạn Daewoo",
    presider_id: 2,
    coordinating_unit: "Bệnh viện Da liễu Hà Nội",
    priority: "IMPORTANT",
    attendee_ids: [2],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 12,
    title: "Gặp mặt nhân dịp Tết Nguyên đán Bính Ngọ 2026",
    leader: "PGĐ Nguyễn Đình Hưng",
    content: "Dự buổi gặp mặt thân mật nhân dịp Tết Nguyên đán Bính Ngọ 2026",
    start_time: "2026-02-26T02:00:00.000Z",
    end_time: "2026-02-26T03:30:00.000Z",
    location: "Hội trường Sở Y tế",
    presider_id: 2,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "LOW",
    attendee_ids: [2],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 13,
    title: "Hội nghị tổng kết công tác năm 2025",
    leader: "PGĐ Nguyễn Đình Hưng",
    content:
      "Hội nghị tổng kết công tác năm 2025, triển khai kế hoạch năm 2026",
    start_time: "2026-02-24T06:30:00.000Z",
    end_time: "2026-02-24T08:00:00.000Z",
    location: "Bệnh viện Đa khoa Hòe Nhai",
    presider_id: 2,
    coordinating_unit: "BVĐK Hòe Nhai",
    priority: "IMPORTANT",
    attendee_ids: [2],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 20,
    title: "Thăm, tặng quà các cơ sở bảo trợ",
    leader: "PGĐ: Trần Văn Chung",
    content: "Thăm, tặng quà các cơ sở bảo trợ xã hội trên địa bàn",
    start_time: "2026-02-24T01:00:00.000Z",
    end_time: "2026-02-24T02:30:00.000Z",
    location: "Các cơ sở bảo trợ xã hội",
    presider_id: 4,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "NORMAL",
    attendee_ids: [4],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 21,
    title: "Chỉ đạo, giám sát Tổng điều tra kinh tế năm 2026",
    leader: "PGĐ: Trần Văn Chung",
    content:
      "Chỉ đạo và giám sát công tác triển khai Tổng điều tra kinh tế năm 2026 tại phường, xã",
    start_time: "2026-02-24T07:00:00.000Z",
    end_time: "2026-02-24T08:30:00.000Z",
    location: "UBND phường Sơn Tây",
    presider_id: 4,
    coordinating_unit: "UBND phường Sơn Tây",
    priority: "IMPORTANT",
    attendee_ids: [4],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 22,
    title: "Gặp mặt nhân dịp Tết Nguyên đán Bính Ngọ 2026",
    leader: "PGĐ: Trần Văn Chung",
    content: "Dự buổi gặp mặt thân mật nhân dịp Tết Nguyên đán Bính Ngọ 2026",
    start_time: "2026-02-26T02:00:00.000Z",
    end_time: "2026-02-26T03:30:00.000Z",
    location: "Hội trường Sở Y tế",
    presider_id: 4,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "LOW",
    attendee_ids: [4],
    status: "pending",
    createdAt: "2026-02-26T00:00:00.000Z",
    updatedAt: "2026-02-24T00:00:00.000Z",
  },
  {
    id: 30,
    title: "Hội nghị ký kết hỗ trợ, hợp tác chuyên môn",
    leader: "GĐ Nguyễn Trọng Diện",
    content:
      "Dự Hội nghị ký kết hỗ trợ, hợp tác chuyên môn giữa các bệnh viện Thành phố với Trạm Y tế phường Việt Hưng",
    start_time: "2026-02-24T02:30:00.000Z",
    end_time: "2026-02-24T04:00:00.000Z",
    location: "UBND phường Việt Hưng",
    presider_id: 1,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "IMPORTANT",
    attendee_ids: [1],
    status: "pending",
  },
  {
    id: 31,
    title: "Báo cáo phát triển khoa học, công nghệ và chuyển đổi số",
    leader: "GĐ Nguyễn Trọng Diện",
    content:
      "Báo cáo về phát triển khoa học, công nghệ, đổi mới sáng tạo, chuyển đổi số gắn với phát triển nguồn nhân lực chất lượng cao trên địa bàn Thành phố năm 2026 theo Kế hoạch 20-KH/BCĐ57",
    start_time: "2026-02-24T09:00:00.000Z",
    end_time: "2026-02-24T10:30:00.000Z",
    location: "Điểm cầu Sở Y tế",
    presider_id: 1,
    coordinating_unit: "Ban Chỉ đạo 57 Thành ủy",
    priority: "IMPORTANT",
    attendee_ids: [1],
    status: "pending",
  },

  {
    id: 32,
    title: "Tổng kết công tác Hội điều dưỡng năm 2025",
    leader: "GĐ Nguyễn Trọng Diện",
    content: "Dự tổng kết công tác Hội điều dưỡng năm 2025",
    start_time: "2026-02-25T01:00:00.000Z",
    end_time: "2026-02-25T02:30:00.000Z",
    location: "Hội trường Bệnh viện Hữu nghị",
    presider_id: 1,
    coordinating_unit: "Hội Điều dưỡng",
    priority: "NORMAL",
    attendee_ids: [1],
    status: "pending",
  },
  {
    id: 33,
    title: "Hội nghị trực tuyến công tác Dân số và Phát triển 2026",
    leader: "GĐ Nguyễn Trọng Diện",
    content:
      "Hội nghị trực tuyến triển khai công tác Dân số và Phát triển năm 2026",
    start_time: "2026-02-25T01:30:00.000Z",
    end_time: "2026-02-25T03:00:00.000Z",
    location: "Phòng họp Sở Y tế",
    presider_id: 1,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "IMPORTANT",
    attendee_ids: [1],
    status: "pending",
  },
  {
    id: 34,
    title: "Tập huấn phòng chống tham nhũng, tiêu cực 2026",
    leader: "GĐ Nguyễn Trọng Diện",
    content:
      "Tham dự tập huấn công tác phòng chống tham nhũng, tiêu cực năm 2026",
    start_time: "2026-02-25T01:30:00.000Z",
    end_time: "2026-02-25T03:00:00.000Z",
    location: "Hội trường Sở Y tế",
    presider_id: 1,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "IMPORTANT",
    attendee_ids: [1],
    status: "pending",
  },
  {
    id: 35,
    title: "Hội nghị giao ban cơ sở tháng 01/2026",
    leader: "GĐ Nguyễn Trọng Diện",
    content: "Hội nghị giao ban với cơ sở tháng 01 năm 2026",
    start_time: "2026-02-25T06:30:00.000Z",
    end_time: "2026-02-25T08:00:00.000Z",
    location: "Hội trường Bộ Tư lệnh Thủ đô",
    presider_id: 1,
    coordinating_unit: "Bộ Tư lệnh Thủ đô",
    priority: "IMPORTANT",
    attendee_ids: [1],
    status: "pending",
  },
  {
    id: 36,
    title: "Gặp mặt Tết Nguyên đán Bính Ngọ 2026",
    leader: "GĐ Nguyễn Trọng Diện",
    content: "Dự buổi gặp mặt thân mật nhân dịp Tết Nguyên đán Bính Ngọ 2026",
    start_time: "2026-02-26T02:00:00.000Z",
    end_time: "2026-02-26T03:30:00.000Z",
    location: "Hội trường Sở Y tế",
    presider_id: 1,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "LOW",
    attendee_ids: [1],
    status: "pending",
  },
  {
    id: 37,
    title: "Gặp mặt Tết Nguyên đán Bính Ngọ 2026",
    leader: "GĐ Nguyễn Trọng Diện",
    content: "Dự buổi gặp mặt thân mật nhân dịp Tết Nguyên đán Bính Ngọ 2026",
    start_time: "2026-02-27T02:00:00.000Z",
    end_time: "2026-02-27T03:30:00.000Z",
    location: "Hội trường Sở Y tế",
    presider_id: 1,
    coordinating_unit: "Sở Y tế Hà Nội",
    priority: "LOW",
    attendee_ids: [1],
    status: "pending",
  },
];
const handlePrint = () => {
  const printContent = document.getElementById("print-area").innerHTML;
  const originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
  window.location.reload();
};
const formatTimeVN = (isoString) => {
  const date = parseISO(isoString);
  const hour = format(date, "H");
  const minute = format(date, "mm");
  return `${hour} giờ ${minute}`;
};

const WorkSchedule = () => {
  const [groupedSchedules, setGroupedSchedules] = useState<GroupedSchedule[]>(
    [],
  );
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  useEffect(() => {
    if (mockScheduleData.length > 0) {
      const today = new Date();
      const normalizedToday = startOfDay(today);
      const grouped = mockScheduleData.reduce(
        (acc: { [key: string]: GroupedSchedule }, current) => {
          const itemDate = parseISO(current.start_time);
          const normalizedItemDate = startOfDay(itemDate);
          const dateKey = format(itemDate, "yyyy-MM-dd");
          if (isBefore(normalizedItemDate, normalizedToday)) return acc;
          const formattedDate = format(itemDate, "EEEE, 'ngày' dd/MM/yyyy", {
            locale: vi,
          });
          const isCurrentDay = isSameDay(normalizedItemDate, normalizedToday);
          if (!acc[dateKey]) {
            acc[dateKey] = {
              dateKey: dateKey,
              formattedDate: formattedDate,
              isToday: isCurrentDay,
              items: [],
            };
          }
          acc[dateKey].items.push(current);
          return acc;
        },
        {},
      );
      const sortedGroupedSchedules = Object.values(grouped).sort(
        (a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime(),
      );
      setGroupedSchedules(sortedGroupedSchedules);
      if (sortedGroupedSchedules.length > 0) {
        const todaySchedule = sortedGroupedSchedules.find((day) => day.isToday);
        if (todaySchedule) setSelectedDateKey(todaySchedule.dateKey);
        else setSelectedDateKey(sortedGroupedSchedules[0].dateKey);
      }
    }
  }, []);

  const selectedDay = groupedSchedules.find(
    (day) => day.dateKey === selectedDateKey,
  );

  return (
    <div className="bg-gray-50 font-sans ">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center text-xs font-bold text-gray-500 uppercase">
          <Link to="/" className="hover:text-red-600 flex items-center gap-1">
            <Home size={14} /> TRANG CHỦ
          </Link>
          <ChevronRight size={14} className="mx-2 text-gray-300" />
          <span className="text-red-600">Lịch công tác lãnh đạo</span>
        </div>
      </div>
      <div className="container mx-auto px-4 py-4" id="print-area">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-700 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <CalendarDays size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
                Lịch công tác Lãnh đạo Sở
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Ban Giám đốc Sở Y tế Thành phố Hà Nội
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              label="In lịch tuần"
              icon={<Printer size={18} />}
              onClick={() => handlePrint()}
              outlined
              className="!border-gray-200 hover:!border-red-600 !text-gray-700 font-bold gap-2"
            />
            <div className="bg-red-70 border border-red-100 px-4 py-2.5 rounded-xl text-red-700 text-xs font-black flex items-center gap-2">
              <AlertCircle size={16} /> HOTLINE TRỰC BAN: 024.3998.5765
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 bg-white p-4 rounded-3xl shadow-lg border border-gray-100 sticky top-4">
            {groupedSchedules.find((day) => day.isToday) &&
              selectedDateKey !==
                groupedSchedules.find((day) => day.isToday)?.dateKey && (
                <Button
                  onClick={() =>
                    setSelectedDateKey(
                      groupedSchedules.find((day) => day.isToday)?.dateKey ||
                        null,
                    )
                  }
                  label="Xem lịch hôm nay"
                  icon="pi pi-calendar"
                  iconPos="left"
                  className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100"
                  text
                />
              )}
            <ul>
              {groupedSchedules
                .filter((day) => !day.isToday)
                .map((day) => {
                  const sortedItems = [...day.items].sort(
                    (a, b) =>
                      new Date(a.start_time).getTime() -
                      new Date(b.start_time).getTime(),
                  );
                  return (
                    <li
                      key={day.dateKey}
                      className="my-2 bg-gray-100 rounded-2xl"
                    >
                      <Button
                        onClick={() => setSelectedDateKey(day.dateKey)}
                        text
                        className={`w-full grid text-left px-4 py-2 rounded-lg transition-colors duration-200 text-red-700 hover:bg-gray-100`}
                      >
                        <span className="flex font-bold items-center text-blue-500">
                          {day.formattedDate}
                        </span>
                        <ul className=" mt-1 space-y-1 text-[#006633] text-sm">
                          {sortedItems.map((item) => (
                            <li key={item.id} className="gap-1 py-1">
                              <span className="text-red-700 font-bold">
                                {formatTimeVN(item.start_time)} :
                              </span>
                              <span className="flex-1 pl-1">{item.title}</span>
                            </li>
                          ))}
                        </ul>
                      </Button>
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="flex-[3]">
            {selectedDay ? (
              <div
                className={`relative bg-white rounded-3xl shadow-lg border border-gray-100 p-4
                  ${selectedDay.isToday ? "ring-2 ring-red-200" : ""}`}
              >
                <h3
                  className={`text-xl font-black uppercase mb-3 pb-2 border-b border-gray-100  text-center text-[#0033FF]`}
                >
                  {selectedDay.formattedDate}
                </h3>

                <div className="divide-y divide-gray-100">
                  {[...selectedDay.items]
                    .sort(
                      (a, b) =>
                        new Date(a.start_time).getTime() -
                        new Date(b.start_time).getTime(),
                    )
                    .map((item) => (
                      <div key={item.id}>
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="flex items-center gap-2 font-black text-red-700">
                              {format(parseISO(item.start_time), "HH:mm")}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-[#006633]">
                              {item.title}
                            </p>
                            <p className="text-sm text-[#006633] leading-relaxed mb-2 text-justify">
                              {item.leader} : {item.content} tại {item.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100 text-center text-[#006633]">
                Không có lịch công tác cho ngày được chọn.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSchedule;
