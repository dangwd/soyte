import React from 'react';
import { Dialog } from 'primereact/dialog';
import { FeedbackItem } from '../../types/feedbacks';
import { formatDisplayDateTime } from '../../utils/dateUtils';

interface FeedbackDetailsDialogProps {
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
  selectedFeedback: FeedbackItem | null;
  infoLabels: Record<string, string>;
  type?: string;
}

const resolveInfoValue = (value: any): string => {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object" && "value" in value) return String(value.value);
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(str)) {
    try { return new Date(str).toLocaleDateString("vi-VN"); } catch { /* fall through */ }
  }
  return str;
};

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

const RATING_CFG: Record<number, { label: string; bg: string; text: string; dot: string }> = {
  0: { label: "Không dùng", bg: "bg-slate-100", text: "text-slate-400", dot: "bg-slate-300" },
  1: { label: "Rất kém", bg: "bg-red-100", text: "text-red-600", dot: "bg-red-500" },
  2: { label: "Kém", bg: "bg-orange-100", text: "text-orange-600", dot: "bg-orange-500" },
  3: { label: "Trung bình", bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  4: { label: "Tốt", bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
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

export const FeedbackDetailsDialog: React.FC<FeedbackDetailsDialogProps> = ({
  dialogVisible,
  setDialogVisible,
  selectedFeedback,
  infoLabels,
  type
}) => {
  return (
    <Dialog
      header="Chi tiết phiếu đã điền"
      visible={dialogVisible}
      style={{ width: "90vw" }}
      maximizable
      onHide={() => setDialogVisible(false)}
      breakpoints={{ "960px": "95vw", "641px": "100vw" }}
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
                  {formatDisplayDateTime(selectedFeedback.created_at || selectedFeedback.createdAt || selectedFeedback.date)}
                </span>
                {selectedFeedback.creator_name && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="font-medium">Người gửi:</span>{" "}
                    {selectedFeedback.creator_name}
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
          {selectedFeedback.info &&
            parseInfoEntries(selectedFeedback.info, infoLabels).length > 0 && (
              <div className="px-6 pt-4 pb-3 flex-shrink-0 bg-slate-50 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Thông tin chung
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {parseInfoEntries(selectedFeedback.info, infoLabels).map((entry, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col gap-1"
                    >
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                        {entry.label}
                      </span>
                      <span className="text-sm font-medium text-slate-800 break-words">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* ── DATA SECTION ─────────────────────────────────────── */}
          <div className="flex-grow overflow-auto p-6 bg-slate-50">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Nội dung biểu mẫu
            </h4>

            {type === 'evaluate' ? (
              <div className="space-y-6">
                {selectedFeedback.data?.map((group: any, groupIdx: number) => (
                  <div key={groupIdx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-primary-50 px-5 py-3 border-b border-primary-100 flex items-center justify-between">
                      <h5 className="font-bold text-primary-900 text-sm">
                        {groupIdx + 1}. {group.name}
                      </h5>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {group.option?.map((opt: any, optIdx: number) => (
                        <div key={optIdx} className="p-5 hover:bg-slate-50/50 transition-colors">
                          <p className="font-medium text-slate-800 mb-3 text-sm leading-relaxed">
                            {optIdx + 1}. {opt.content}
                          </p>
                          <div className="pl-4 border-l-[3px] border-primary-200 py-1">
                            <span className="text-xs font-semibold text-slate-500 block mb-1.5 uppercase tracking-wide">Câu trả lời:</span>
                            {/* Render answer based on type */}
                            {opt.answerType === 'score1_5' ? (
                              <div className="mt-1">
                                <RatingBadge value={Number(opt.answerValue) || 0} />
                              </div>
                            ) : (
                              <p className="text-sm text-primary-900 font-medium break-words">
                                {opt.answerValue ? String(opt.answerValue) : "Chưa có câu trả lời"}
                              </p>
                            )}
                          </div>
                          {opt.note && (
                            <div className="mt-3 text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 text-slate-600">
                              <span className="font-medium italic">Ghi chú:</span> {opt.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {selectedFeedback.data?.map((group: any, groupIdx: number) => (
                  <div key={groupIdx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-primary-50 px-5 py-3 border-b border-primary-100">
                      <h5 className="font-bold text-primary-900 text-sm">
                        {groupIdx + 1}. {group.name}
                      </h5>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="px-5 py-3 w-10 text-center">STT</th>
                            <th className="px-5 py-3">Nội dung</th>
                            <th className="px-5 py-3 w-32 border-l border-slate-200">Tiến độ</th>
                            <th className="px-5 py-3 w-32 border-l border-slate-200">Đánh giá</th>
                            <th className="px-5 py-3 w-48 border-l border-slate-200">Ghi chú</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {group.option?.map((opt: any, optIdx: number) => {
                            const tiendoLabel = ["Chưa thực hiện", "Đang thực hiện", "Đã thực hiện"][opt.progress?.value] || "Chưa xác định";
                            const danhgiaLabel = opt.rating?.value === 1 ? "Đạt" : (opt.rating?.value === 0 ? "Không đạt" : "Chưa đánh giá");

                            return (
                              <tr key={optIdx} className="hover:bg-slate-50/50">
                                <td className="px-5 py-4 text-center font-medium text-slate-400">
                                  {optIdx + 1}
                                </td>
                                <td className="px-5 py-4">
                                  <p className="font-medium text-slate-800 break-words">{opt.content}</p>
                                </td>
                                <td className="px-5 py-4 border-l border-slate-100">
                                  <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                                    opt.progress?.value === 2 ? 'bg-emerald-100 text-emerald-700' :
                                    opt.progress?.value === 1 ? 'bg-amber-100 text-amber-700' :
                                    opt.progress?.value === 0 ? 'bg-red-100 text-red-700' :
                                    'bg-slate-100 text-slate-600'
                                  }`}>
                                    {tiendoLabel}
                                  </span>
                                </td>
                                <td className="px-5 py-4 border-l border-slate-100">
                                  <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                                    opt.rating?.value === 1 ? 'bg-green-100 text-green-700' :
                                    opt.rating?.value === 0 ? 'bg-red-100 text-red-700' :
                                    'bg-slate-100 text-slate-600'
                                  }`}>
                                    {danhgiaLabel}
                                  </span>
                                </td>
                                <td className="px-5 py-4 border-l border-slate-100 text-slate-600 text-xs italic break-words">
                                  {opt.note || <span className="text-slate-300">Không có</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(!selectedFeedback.data || selectedFeedback.data.length === 0) && (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                <i className="pi pi-inbox text-4xl text-slate-300 mb-3 block"></i>
                <p className="text-slate-500 font-medium">Không có dữ liệu chi tiết</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
};
