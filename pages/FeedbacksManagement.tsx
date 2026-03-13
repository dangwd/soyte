import AdminLayout from "../components/AdminLayout";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { feedBacksSevice } from "../services/feedBacksSevice";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toast } from "@/components/prime";
import { formService } from "../services/formService";
import { Chart } from "primereact/chart";

// ── helpers ───────────────────────────────────────────────────────────────────

/** Resolve info value: handles string, ISO date, {key,value} objects */
const resolveInfoValue = (value: any): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object" && "value" in value) return String(value.value);
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
    try { return new Date(str).toLocaleDateString("vi-VN"); } catch { /* fall through */ }
  }
  return str;
};

/** Extract info entries from numeric keys of the info object */
const parseInfoEntries = (info: Record<string, any>, labels?: Record<string, string>): { label: string; value: string }[] => {
  if (!info || typeof info !== "object") return [];
  return Object.keys(info)
    .filter(k => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b))
    .map(k => {
      const label = labels && labels[k] ? labels[k] : `Thông tin ${k}`;
      return { label, value: resolveInfoValue(info[k]?.value) };
    });
};

/** Color map for ratingVote */
const RATING_CFG: Record<number, { label: string; bg: string; text: string; dot: string }> = {
  0: { label: "Không dùng", bg: "bg-slate-100", text: "text-slate-400", dot: "bg-slate-300" },
  1: { label: "Rất kém", bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
  2: { label: "Kém", bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
  3: { label: "Trung bình", bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  4: { label: "Tốt", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  5: { label: "Rất tốt", bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
};

const RatingBadge: React.FC<{ value: number }> = ({ value }) => {
  const cfg = RATING_CFG[value] ?? RATING_CFG[0];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {value > 0 ? `${value}/5 — ` : ""}{cfg.label}
    </span>
  );
};

// ── main component ─────────────────────────────────────────────────────────────

const FeedbacksManagement: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({ first: 0, rows: 10, page: 1 });
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [infoLabels, setInfoLabels] = useState<Record<string, string>>({});

  const stats = useMemo(() => {
    let statusCount = 0;

    let totalRatingSum = 0;
    let totalRatingCount = 0;

    // Biến đếm cho biểu đồ
    let tiendoDaLam = 0;
    let tiendoDangLam = 0;
    let tiendoChuaLam = 0;
    let danhgiaDat = 0;
    let danhgiaKhongDat = 0;

    feedbacks.forEach(fb => {
      // 1. Tính toán trạng thái
      statusCount++;

      // 2. Tính toán điểm đánh giá trung bình (chỉ tính các phiếu biểu mẫu có ratingVote)
      if (fb.type === 'bieumau' && Array.isArray(fb.sections)) {
        fb.sections.forEach((section: any) => {
          if (Array.isArray(section.option)) {
            section.option.forEach((opt: any) => {
              const rate = opt.ratingVote?.value;
              // Chỉ cộng điểm nếu rate hợp lệ (từ 1 đến 5 sao)
              if (rate !== undefined && rate !== null && rate > 0 && rate <= 5) {
                totalRatingSum += Number(rate);
                totalRatingCount++;
              }
            });
          }
        });
      }

      // 3. Đếm tiến độ và đánh giá (Phiếu phụ lục)
      if (fb.type === 'phuluc' && Array.isArray(fb.sections)) {
        fb.sections.forEach((section: any) => {
          if (Array.isArray(section.option)) {
            section.option.forEach((opt: any) => {
              // Tiến độ: 1-Đã làm, 2-Đang làm, 3-Chưa làm
              if (Number(opt.tiendo) === 1) tiendoDaLam++;
              else if (Number(opt.tiendo) === 2) tiendoDangLam++;
              else if (Number(opt.tiendo) === 3) tiendoChuaLam++;

              // Đánh giá: 1-Đạt, 0 hoặc 2 - Không đạt
              if (Number(opt.danhgia) === 1) danhgiaDat++;
              else if (Number(opt.danhgia) === 0 || Number(opt.danhgia) === 2) danhgiaKhongDat++;
            });
          }
        });
      }
    });

    // Xử lý chia trung bình và làm tròn 1 chữ số thập phân
    const avgRating = totalRatingCount > 0
      ? (totalRatingSum / totalRatingCount).toFixed(1)
      : "0.0";
    const hasChartData = (tiendoDaLam + tiendoDangLam + tiendoChuaLam + danhgiaDat + danhgiaKhongDat) > 0;

    return {
      total: totalRecords, // Lấy từ biến tổng số API trả về
      statusCount: statusCount,
      avgRating,
      hasChartData,
      tiendo: { daLam: tiendoDaLam, dangLam: tiendoDangLam, chuaLam: tiendoChuaLam },
      danhgia: { dat: danhgiaDat, khongDat: danhgiaKhongDat }
    };
  }, [feedbacks, totalRecords]);

  // Cấu hình dữ liệu cho Biểu đồ Tiến độ
  const tiendoChartData = {
    labels: ['Đã làm', 'Đang làm', 'Chưa làm'],
    datasets: [
      {
        data: [stats.tiendo.daLam, stats.tiendo.dangLam, stats.tiendo.chuaLam],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'], // Xanh lá, Vàng, Đỏ
        hoverBackgroundColor: ['#059669', '#d97706', '#dc2626']
      }
    ]
  };

  // Cấu hình dữ liệu cho Biểu đồ Đánh giá
  const danhgiaChartData = {
    labels: ['Đạt', 'Không đạt'],
    datasets: [
      {
        data: [stats.danhgia.dat, stats.danhgia.khongDat],
        backgroundColor: ['#10b981', '#ef4444'], // Xanh lá, Đỏ
        hoverBackgroundColor: ['#059669', '#dc2626']
      }
    ]
  };

  // Tùy chọn chung cho biểu đồ
  const chartOptions = {
    plugins: {
      legend: {
        position: 'right', // Chuyển chú thích sang bên phải (bạn có thể đổi thành 'left' nếu muốn)
        labels: {
          usePointStyle: true, // Đổi hình hộp chữ nhật thành hình tròn cho hiện đại
          padding: 20 // Tăng khoảng cách để chữ dễ nhìn hơn
        }
      }
    },
    cutout: '60%', // Giữ nguyên độ rỗng ở giữa
    maintainAspectRatio: false // Thêm thuộc tính này để biểu đồ không bị thu nhỏ quá mức
  };


  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedBacksSevice.fetchFeedBacks(lazyParams.page, lazyParams.rows);
      const data = response.data || response;
      let list: any[] = [];
      let total = 0;
      if (data?.items && Array.isArray(data.items)) { list = data.items; total = data.total || list.length; }
      else if (data?.data?.items && Array.isArray(data.data.items)) { list = data.data.items; total = data.data.total || list.length; }
      else if (Array.isArray(data)) { list = data; total = data.length; }
      setFeedbacks(list);
      setTotalRecords(total);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách phản hồi' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeedbacks(); }, [lazyParams.page, lazyParams.rows]);

  const onPage = (event: any) => setLazyParams({ first: event.first, rows: event.rows, page: event.page + 1 });

  const viewDetails = async (rowData: any) => {
    try {
      const id = rowData.id || rowData._id;
      const response = await feedBacksSevice.fetchFeedBackById(id);
      const data = response.data || response;
      const fbData = data.data || data;
      setSelectedFeedback(fbData);
      setDialogVisible(true);

      // Fetch dynamic labels from the form template
      const formId = fbData.form_id;
      if (formId) {
        try {
          const formRes = await formService.fetchFormById(formId);
          const formData = formRes.data || formRes;
          if (formData?.info && Array.isArray(formData.info)) {
            const labelMap: Record<string, string> = {};
            formData.info.forEach((item: any) => {
              if (item.key !== undefined) {
                labelMap[String(item.key)] = item.title;
              }
            });
            setInfoLabels(labelMap);
          } else {
            setInfoLabels({});
          }
        } catch (err) {
          console.error("Lỗi khi tải thông tin biểu mẫu:", err);
          setInfoLabels({});
        }
      } else {
        setInfoLabels({});
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải chi tiết phản hồi' });
      setSelectedFeedback(rowData);
      setDialogVisible(true);
    }
  };

  const actionBodyTemplate = (rowData: any) => (
    <div className="flex gap-2">
      <Button icon="pi pi-eye" rounded outlined className="w-8 h-8 p-0 text-primary-600 border-primary-600 hover:bg-primary-50" onClick={() => viewDetails(rowData)} title="Xem chi tiết" />
    </div>
  );

  const dateBodyTemplate = (rowData: any) => {
    const d = rowData.createdAt || rowData.created_at || rowData.date;
    if (!d) return "";
    const date = new Date(d);
    return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}`;
  };

  const nameBodyTemplate = (rowData: any) =>
    rowData.name || rowData.fullName || rowData.creator_name || "Không có tên";

  const sttBodyTemplate = (_: any, options: { rowIndex: number }) =>
    options.rowIndex + lazyParams.first + 1;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Quản lý góp ý - phản hồi">
      <Toast ref={toast} />
      {/* ── THỐNG KÊ TỔNG QUAN ──────────────────────────────────────── */}
      {/* ── BIỂU ĐỒ THỐNG KÊ (Chỉ hiện khi có dữ liệu phụ lục) ── */}
      {stats.hasChartData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Biểu đồ Tiến độ */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-base font-bold text-primary-900 mb-4">Tỉ lệ Tiến độ thực hiện</h3>

            {/* Đã thêm max-w-[350px] và mx-auto để kéo biểu đồ và chú thích lại gần nhau */}
            <div className="w-full max-w-[350px] mx-auto h-[200px] relative">
              <Chart type="doughnut" data={tiendoChartData} options={chartOptions} className="w-full h-full" />
            </div>
          </div>

          {/* Biểu đồ Đánh giá */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-base font-bold text-primary-900 mb-4">Tỉ lệ Đánh giá chất lượng</h3>

            {/* Đã thêm max-w-[350px] và mx-auto để kéo biểu đồ và chú thích lại gần nhau */}
            <div className="w-full max-w-[350px] mx-auto h-[200px] relative">
              <Chart type="doughnut" data={danhgiaChartData} options={chartOptions} className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Thẻ 1: Tổng số góp ý */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
            <i className="pi pi-comments text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">Tổng số ý kiến</p>
            <h3 className="text-2xl font-bold text-primary-900">{stats.total}</h3>
          </div>
        </div>

        {/* Thẻ 2: Đã tiếp nhận */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
            <i className="pi pi-check-circle text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">Đã tiếp nhận</p>
            <h3 className="text-2xl font-bold text-slate-800">{stats.statusCount}</h3>
          </div>
        </div>

        {/* Thẻ 3: Đánh giá trung bình */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 flex-shrink-0">
            <i className="pi pi-star-fill text-xl"></i>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-0.5">Đánh giá trung bình</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {stats.avgRating} <span className="text-sm font-normal text-slate-500">/ 5</span>
            </h3>
          </div>
        </div>
      </div>
      {/* ── LIST TABLE ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary-900">Danh sách ý kiến</h2>
        </div>
        <div className="overflow-x-auto">
          <DataTable
            value={feedbacks}
            loading={loading}
            lazy
            paginator
            first={lazyParams.first}
            rows={lazyParams.rows}
            totalRecords={totalRecords}
            onPage={onPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: '50rem' }}
            emptyMessage="Không có dữ liệu phản hồi"
          >
            <Column header="STT" body={sttBodyTemplate} style={{ width: '5rem' }} />
            <Column header="Người gửi" sortable style={{ width: '15rem' }} body={nameBodyTemplate} />
            <Column header="Ngày gửi" body={dateBodyTemplate} style={{ width: '10rem' }} />
            <Column body={actionBodyTemplate} exportable={false} style={{ width: '5rem' }} header="Thao tác" />
          </DataTable>
        </div>
      </div>

      {/* ── DETAIL DIALOG ──────────────────────────────────────────── */}
      <Dialog
        header="Chi tiết phiếu đã điền"
        visible={dialogVisible}
        style={{ width: '90vw' }}
        maximizable
        onHide={() => setDialogVisible(false)}
        breakpoints={{ '960px': '95vw', '641px': '100vw' }}
        contentClassName="p-0 bg-slate-50"
        headerClassName="bg-white border-b border-slate-200 text-primary-900 font-bold text-xl"
      >
        {selectedFeedback && (
          <div className="flex flex-col h-full text-sm">

            {/* ── TITLE + META STRIP ───────────────────────────────── */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex-shrink-0">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <h3 className="font-bold text-primary-900 text-base leading-snug">
                  {selectedFeedback.info?.title || "Chi tiết phản hồi"}
                </h3>
                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="font-medium">Ngày gửi:</span>{" "}
                    {selectedFeedback.created_at
                      ? `${new Date(selectedFeedback.created_at).toLocaleDateString("vi-VN")} ${new Date(selectedFeedback.created_at).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}`
                      : "—"}
                  </span>
                  {selectedFeedback.creator_name && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <span className="font-medium">Người gửi:</span> {selectedFeedback.creator_name}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                    Đã tiếp nhận
                  </span>
                </div>
              </div>

              {selectedFeedback.info?.description && (
                <div className="pt-3 border-t border-slate-50">
                  <p className="text-slate-500 text-xs leading-relaxed italic">
                    {selectedFeedback.info.description}
                  </p>
                </div>
              )}
            </div>

            {/* ── INFO CARDS (dynamic numeric keys) ────────────────── */}
            {selectedFeedback.info && parseInfoEntries(selectedFeedback.info, infoLabels).length > 0 && (
              <div className="px-6 pt-4 pb-3 flex-shrink-0 bg-slate-50 border-b border-slate-100">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {parseInfoEntries(selectedFeedback.info, infoLabels).map((entry, idx) => (
                    <div key={idx} className="bg-white rounded-lg border border-slate-200 px-3 py-2.5 shadow-sm">
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{entry.label}</span>
                      <span className="block text-slate-800 font-semibold text-sm break-words">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── PHỤ LỤC TABLE ────────────────────────────────────── */}
            {selectedFeedback.type === 'phuluc' &&
              selectedFeedback.sections?.length > 0 && (
                <div className="flex-grow px-6 py-5 flex flex-col">
                  <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full border-collapse text-slate-700 table-fixed">
                      <thead className="bg-primary-800 text-white">
                        <tr>
                          <th rowSpan={2} className="border border-white/30 p-2 w-[4%] text-center align-middle font-bold text-[11px]">STT</th>
                          <th rowSpan={2} className="border border-white/30 p-2 w-[28%] text-center align-middle font-bold text-[11px]">Nội dung thực hiện</th>
                          <th rowSpan={2} className="border border-white/30 p-2 w-[16%] text-center align-middle font-bold text-[11px]">Phương thức thực hiện</th>
                          <th rowSpan={2} className="border border-white/30 p-2 w-[14%] text-center align-middle font-bold text-[11px]">Sản phẩm đầu ra</th>
                          <th colSpan={3} className="border border-white/30 p-1.5 w-[18%] text-center align-middle font-bold text-[11px]">Tiến độ</th>
                          <th colSpan={2} className="border border-white/30 p-1.5 w-[10%] text-center align-middle font-bold text-[11px]">Đánh giá</th>
                          <th rowSpan={2} className="border border-white/30 p-2 w-[10%] text-center align-middle font-bold text-[11px]">Ghi chú</th>
                        </tr>
                        <tr>
                          {/* Các cột con không cần đặt width nữa, trình duyệt sẽ tự động chia đều từ thẻ cha */}
                          <th className="border border-white/30 p-1.5 text-center text-[10px] font-bold leading-tight">Đã làm</th>
                          <th className="border border-white/30 p-1.5 text-center text-[10px] font-bold leading-tight">Đang làm</th>
                          <th className="border border-white/30 p-1.5 text-center text-[10px] font-bold leading-tight">Chưa làm</th>
                          <th className="border border-white/30 p-1.5 text-center text-[10px] font-bold leading-tight">Đạt</th>
                          <th className="border border-white/30 p-1.5 text-center text-[10px] font-bold leading-tight">K.Đạt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          let globalIdx = 0;
                          const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
                          return selectedFeedback.sections.map((group: any, gi: number) => (
                            <React.Fragment key={gi}>
                              <tr className="bg-primary-800">
                                <td className="p-2.5 text-center">
                                  <span className="inline-flex w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold items-center justify-center">
                                    {roman[gi] || gi + 1}
                                  </span>
                                </td>
                                <td colSpan={9} className="p-2.5 font-bold text-white text-sm">
                                  {group.name || `Nhóm nội dung ${gi + 1}`}
                                </td>
                              </tr>
                              {group.option && Array.isArray(group.option) && group.option.map((opt: any, oi: number) => {
                                globalIdx++;
                                return (
                                  <tr key={oi} className="hover:bg-slate-50 transition-colors bg-white">
                                    <td className="border border-slate-300 p-2 text-center text-slate-600 font-medium">{globalIdx}</td>
                                    <td className="border border-slate-300 p-3 text-sm leading-relaxed"><div className="whitespace-pre-wrap">{opt.content}</div></td>
                                    <td className="border border-slate-300 p-3 text-sm leading-relaxed"><div className="whitespace-pre-wrap">{opt.method}</div></td>
                                    <td className="border border-slate-300 p-3 text-sm leading-relaxed"><div className="whitespace-pre-wrap">{opt.productOut}</div></td>

                                    <td className="border border-slate-300 p-2 text-center bg-slate-50/30">
                                      <div className="flex justify-center">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${Number(opt.tiendo) === 1 ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'}`}>
                                          {Number(opt.tiendo) === 1 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="border border-slate-300 p-2 text-center bg-slate-50/30">
                                      <div className="flex justify-center">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${Number(opt.tiendo) === 2 ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'}`}>
                                          {Number(opt.tiendo) === 2 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="border border-slate-300 p-2 text-center bg-slate-50/30">
                                      <div className="flex justify-center">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${Number(opt.tiendo) === 3 ? 'bg-primary-600 border-primary-600' : 'bg-white border-slate-300'}`}>
                                          {Number(opt.tiendo) === 3 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                      </div>
                                    </td>

                                    <td className="border border-slate-300 p-2 text-center bg-green-50/30">
                                      <div className="flex justify-center">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${Number(opt.danhgia) === 1 ? 'bg-green-600 border-green-600' : 'bg-white border-slate-300'}`}>
                                          {Number(opt.danhgia) === 1 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="border border-slate-300 p-2 text-center bg-red-50/30">
                                      <div className="flex justify-center">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${Number(opt.danhgia) === 0 || Number(opt.danhgia) === 2 ? 'bg-red-600 border-red-600' : 'bg-white border-slate-300'}`}>
                                          {(Number(opt.danhgia) === 0 || Number(opt.danhgia) === 2) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                      </div>
                                    </td>

                                    <td className="border border-slate-200 p-3 text-sm leading-relaxed"><div className="whitespace-pre-wrap">{opt.ghichu}</div></td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* ── BIỂU MẪU SECTIONS ────────────────────────────────── */}
            {selectedFeedback.type === 'bieumau' &&
              selectedFeedback.sections?.length > 0 && (
                <div className="flex-grow px-6 py-5 flex flex-col gap-4">
                  {(() => {
                    let globalIdx = 0;
                    const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];
                    return selectedFeedback.sections.map((section: any, sIdx: number) => (
                      <div key={sIdx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

                        {/* Section header - Styled like Phụ lục group */}
                        <div className="bg-primary-800 px-4 py-2.5 flex items-center gap-2">
                          <span className="inline-flex w-6 h-6 rounded-full bg-white/20 text-white text-xs font-bold items-center justify-center flex-shrink-0">
                            {roman[sIdx] || sIdx + 1}
                          </span>
                          <span className="text-white font-semibold text-sm uppercase tracking-wide">
                            {section.name}
                          </span>
                        </div>

                        {/* Questions - Styled numbers like Phụ lục STT */}
                        <div className="divide-y divide-slate-100">
                          {section.option && Array.isArray(section.option) && section.option.map((opt: any, oIdx: number) => {
                            globalIdx++;
                            const rv = opt.ratingVote?.value;
                            const hasRV = rv !== undefined && rv !== null;
                            const aType: string = opt.answerType || "score1_5";
                            const av = opt.answerValue;
                            const hasAv = av !== null && av !== undefined && av !== "" && av !== -1;

                            return (
                              <div key={oIdx} className="px-4 py-3 flex flex-col sm:flex-row sm:items-start gap-4">
                                {/* Number - Continuous numbering like Phụ lục STT */}
                                <span className="flex-shrink-0 w-6 text-center text-slate-500 text-sm font-medium mt-0.5">
                                  {globalIdx}
                                </span>

                                <div className="flex-grow min-w-0">
                                  <p className="text-slate-700 text-sm leading-relaxed">{opt.content}</p>
                                  {opt.note && <p className="text-slate-400 text-xs mt-0.5 italic">Ghi chú: {opt.note}</p>}
                                </div>

                                <div className="flex-shrink-0 flex items-center justify-end min-w-[130px]">
                                  {aType === "score1_5" && hasRV && <RatingBadge value={Number(rv)} />}

                                  {aType === "single_choice" && hasAv && (
                                    <span className="text-xs bg-primary-50 text-primary-800 border border-primary-200 px-2.5 py-1.5 rounded-full font-medium max-w-[220px] text-right break-words">
                                      {String(av)}
                                    </span>
                                  )}

                                  {aType === "percentage" && hasAv && (
                                    <span className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 bg-primary-50 border border-primary-200 px-3 py-1.5 rounded-full">
                                      <i className="pi pi-chart-bar text-xs" />{av}%
                                    </span>
                                  )}

                                  {aType === "text" && hasAv && (
                                    <span className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg max-w-[220px] text-right break-words">
                                      {String(av)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}

            {/* ── FOOTER ───────────────────────────────────────────── */}
            {/* <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0 flex justify-end">
              <Button label="Đóng" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-outlined border-slate-300 text-slate-700 hover:bg-slate-100 font-bold px-6 py-2" />
            </div> */}

          </div>
        )}
      </Dialog>
    </AdminLayout>
  );
};

export default FeedbacksManagement;
