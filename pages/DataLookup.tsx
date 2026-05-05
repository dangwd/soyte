import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  ChevronRight,
  Database,
  Download,
  FileDown,
  Files,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
} from "lucide-react";

const fileModules = import.meta.glob("../assets/fileDL/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const fileUrlMap = Object.entries(fileModules).reduce<Record<string, string>>(
  (acc, [modulePath, assetUrl]) => {
    const fileName = modulePath.split("/").pop();

    if (fileName) {
      acc[fileName] = assetUrl;
    }

    return acc;
  },
  {},
);

const LOOKUP_OPTIONS = [
  {
    value: "all",
    label: "Tất cả dữ liệu",
    description: "Tra cứu toàn bộ danh mục công khai",
    icon: Files,
  },
  {
    value: "practitioner",
    label: "Người hành nghề Y",
    description: "Tra cứu chứng chỉ, điều kiện và danh sách chuyên môn",
    icon: UserRound,
  },
  {
    value: "facility",
    label: "Cơ sở khám chữa bệnh",
    description: "Tra cứu danh sách bệnh viện, phòng khám và cơ sở khám chữa bệnh",
    icon: Stethoscope,
  },
  {
    value: "specialized",
    label: "Cơ sở thẩm mỹ",
    description: "Tra cứu thông tin công khai theo nhóm cơ sở thẩm mỹ",
    icon: Database,
  },
] as const;

type LookupType = (typeof LOOKUP_OPTIONS)[number]["value"];

type LookupRecord = {
  id: number;
  type: Exclude<LookupType, "all">;
  title: string;
  summary: string;
  source: string;
  updatedAt: string;
  downloads: number;
  licenseCode: string;
  organization: string;
  fileName: string;
};

const LOOKUP_RECORDS: LookupRecord[] = [
  {
    id: 1,
    type: "specialized",
    title:
      "Dữ liệu danh sách các cơ sở sản xuất kinh doanh thực phẩm thuộc thẩm quyền của UBND Thành phố",
    summary:
      "Danh sách công khai các cơ sở sản xuất, kinh doanh thực phẩm do UBND Thành phố quản lý trực tiếp.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "15/01/2026",
    downloads: 1250,
    licenseCode: "ATTP-UBND-01",
    organization: "Khối an toàn thực phẩm",
    fileName:
      "1. Dữ liệu danh sách các cơ sở sản xuất kinh doanh thực phẩm thuộc thẩm quyền của UBND Thành phố.xlsx",
  },
  {
    id: 2,
    type: "specialized",
    title: "Các doanh nghiệp tự công bố sản phẩm ATTP",
    summary:
      "Danh mục doanh nghiệp tự công bố sản phẩm an toàn thực phẩm theo quy định hiện hành.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "14/01/2026",
    downloads: 842,
    licenseCode: "ATTP-CB-02",
    organization: "Khối an toàn thực phẩm",
    fileName: "2. Các DN tự công bố sản phẩm ATTP.xlsx",
  },
  {
    id: 3,
    type: "specialized",
    title:
      "Dữ liệu các phòng kiểm nghiệm phục vụ quản lý nhà nước, các đơn vị kiểm tra nhà nước về thực phẩm nhập khẩu",
    summary:
      "Thông tin chi tiết về các đơn vị đủ điều kiện kiểm tra nhà nước đối với thực phẩm nhập khẩu.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "12/01/2026",
    downloads: 456,
    licenseCode: "KN-TPNK-03",
    organization: "Khối kiểm nghiệm thực phẩm",
    fileName:
      "3. Dữ liệu các phòng kiểm nghiệm phục vụ quản lý nhà nước, các đơn vị kiểm tra nhà nước về thực phẩm nhập khẩu.docx",
  },
  {
    id: 4,
    type: "facility",
    title: "Danh sách cơ sở đủ điều kiện khám sức khỏe",
    summary:
      "Danh sách các cơ sở y tế đủ điều kiện thực hiện khám sức khỏe trên địa bàn Thành phố.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "10/01/2026",
    downloads: 2105,
    licenseCode: "KSK-04",
    organization: "Khối khám chữa bệnh",
    fileName: "4. DS cs du dieu kien KSK.xlsx",
  },
  {
    id: 5,
    type: "specialized",
    title: "Danh sách an toàn sinh học",
    summary:
      "Danh mục các cơ sở đáp ứng tiêu chuẩn an toàn sinh học theo quy chuẩn chuyên ngành.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "08/01/2026",
    downloads: 128,
    licenseCode: "ATSH-05",
    organization: "Khối xét nghiệm và an toàn sinh học",
    fileName: "5. DS ATSH.xlsx",
  },
  {
    id: 6,
    type: "specialized",
    title: "Dữ liệu danh sách tiêm chủng",
    summary:
      "Dữ liệu tổng hợp tiêm chủng mở rộng và tiêm chủng dịch vụ trên địa bàn Thành phố.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "05/01/2026",
    downloads: 3420,
    licenseCode: "TC-06",
    organization: "Khối y tế dự phòng",
    fileName: "6. DL ds Tiêm chủng .xlsx",
  },
  {
    id: 7,
    type: "specialized",
    title: "Danh sách quan trắc môi trường lao động trên địa bàn Thành phố",
    summary:
      "Kết quả quan trắc định kỳ và danh sách các đơn vị thực hiện quan trắc môi trường lao động.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "04/01/2026",
    downloads: 672,
    licenseCode: "QTMT-07",
    organization: "Khối sức khỏe nghề nghiệp",
    fileName:
      "7. Danh sách quan trắc môi trường lao động trên địa bàn Thành phố.docx",
  },
  {
    id: 8,
    type: "facility",
    title: "Danh sách cơ sở xét nghiệm khẳng định HIV",
    summary:
      "Danh sách các cơ sở y tế đủ thẩm quyền thực hiện xét nghiệm khẳng định HIV.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "02/01/2026",
    downloads: 89,
    licenseCode: "HIV-08",
    organization: "Khối xét nghiệm và phòng chống HIV",
    fileName: "8. DS cs xet nghiem khang dinh hiv.xlsx",
  },
  {
    id: 9,
    type: "practitioner",
    title: "Dữ liệu về người đủ điều kiện hành nghề y quý IV/2025",
    summary:
      "Danh sách nhân sự y tế đủ điều kiện hành nghề được cập nhật trong quý IV năm 2025.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "28/12/2025",
    downloads: 1560,
    licenseCode: "HNY-2025-Q4",
    organization: "Khối quản lý hành nghề",
    fileName: "9. Dữ liệu về người đủ điều kiện hành nghề y_quý IV.2025.xlsx",
  },
  {
    id: 10,
    type: "practitioner",
    title: "Dữ liệu người được cấp chứng chỉ hành nghề y học cổ truyền quý IV/2025",
    summary:
      "Danh sách cá nhân được cấp chứng chỉ hành nghề trong lĩnh vực y học cổ truyền.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "25/12/2025",
    downloads: 432,
    licenseCode: "YHCT-CC-10",
    organization: "Khối y học cổ truyền",
    fileName:
      "10. Dữ liệu người được cấp chứng chỉ hành nghề y học cổ truyền_quý IV.2025.xlsx",
  },
  {
    id: 11,
    type: "facility",
    title: "Dữ liệu phòng khám y học cổ truyền trên địa bàn thành phố quý IV/2025",
    summary:
      "Danh sách các phòng khám y học cổ truyền đang hoạt động hợp pháp trên địa bàn Thành phố.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "20/12/2025",
    downloads: 780,
    licenseCode: "PKYHCT-11",
    organization: "Khối cơ sở khám chữa bệnh",
    fileName:
      "11. Dữ liệu phòng khám y học cổ truyền trên địa bàn thành phố_quý IV.2025.xlsx",
  },
  {
    id: 12,
    type: "practitioner",
    title: "Danh sách chứng chỉ hành nghề dược",
    summary:
      "Danh sách cập nhật các cá nhân có chứng chỉ hành nghề dược trên địa bàn Thành phố.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "15/12/2025",
    downloads: 1240,
    licenseCode: "CCHN-DUOC-12",
    organization: "Khối quản lý dược",
    fileName: "12. DS CCHN Duoc.xlsx",
  },
  {
    id: 13,
    type: "facility",
    title: "Danh sách cơ sở kinh doanh dược",
    summary:
      "Danh sách các nhà thuốc, quầy thuốc và cơ sở kinh doanh dược phẩm đủ điều kiện hoạt động.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "10/12/2025",
    downloads: 2890,
    licenseCode: "CSDKD-13",
    organization: "Khối quản lý dược",
    fileName: "13. DS cs kinh doanh duoc.xlsx",
  },
  {
    id: 14,
    type: "specialized",
    title: "Dữ liệu dân số",
    summary:
      "Dữ liệu tổng hợp về dân số, tỷ lệ sinh và các chỉ số sức khỏe sinh sản trên địa bàn Hà Nội.",
    source: "Sở Y tế Hà Nội",
    updatedAt: "01/12/2025",
    downloads: 5400,
    licenseCode: "DANSO-14",
    organization: "Khối dân số và kế hoạch hóa gia đình",
    fileName: "14. DL dan so.xlsx",
  },
];

const initialFilters = {
  type: "all" as LookupType,
  license: "",
  keyword: "",
};

const TYPE_STYLES: Record<Exclude<LookupType, "all">, string> = {
  practitioner: "bg-violet-50 text-violet-700 ring-violet-200",
  facility: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  specialized: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const TYPE_LABELS: Record<Exclude<LookupType, "all">, string> = {
  practitioner: "Người hành nghề Y",
  facility: "Cơ sở khám chữa bệnh",
  specialized: "Cơ sở thẩm mỹ",
};

const DataLookup = () => {
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const filteredRecords = LOOKUP_RECORDS.filter((item) => {
    const matchesType =
      appliedFilters.type === "all" || item.type === appliedFilters.type;
    const licenseQuery = appliedFilters.license.trim().toLowerCase();
    const keywordQuery = appliedFilters.keyword.trim().toLowerCase();
    const licenseHaystack = `${item.licenseCode} ${item.fileName}`.toLowerCase();
    const keywordHaystack =
      `${item.title} ${item.summary} ${item.organization} ${item.source}`.toLowerCase();

    return (
      matchesType &&
      (!licenseQuery || licenseHaystack.includes(licenseQuery)) &&
      (!keywordQuery || keywordHaystack.includes(keywordQuery))
    );
  });

  const totalDownloads = filteredRecords.reduce(
    (sum, item) => sum + item.downloads,
    0,
  );
  const activeOption = LOOKUP_OPTIONS.find(
    (option) => option.value === appliedFilters.type,
  );

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters(draftFilters);
  };

  const handleReset = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const handleDownload = (fileName: string) => {
    const fileUrl = fileUrlMap[fileName];

    if (!fileUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/image/anh2.jpg')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(6,78,120,0.88),rgba(14,116,144,0.72),rgba(56,189,248,0.42))]" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-blue-950/20 blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 pb-40 pt-10 text-white lg:pb-44 lg:pt-14 xl:pb-52">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/90">
                <Link to="/" className="transition hover:text-white">
                  Trang chủ
                </Link>
                <ChevronRight size={14} />
                <span className="text-white">Cổng tra cứu thông tin</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-50 backdrop-blur">
                <ShieldCheck size={14} />
                Hoạt động khám chữa bệnh và dữ liệu công khai
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                Cổng tra cứu thông tin
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-cyan-50/90 md:text-lg">
                Tra cứu nhanh dữ liệu công khai của ngành y tế theo nhóm hồ sơ,
                cơ sở và chứng chỉ hành nghề với giao diện tối giản, rõ trọng
                tâm và tối ưu cho thao tác thực tế.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[420px] lg:grid-cols-1 lg:self-end">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
                  Bộ dữ liệu
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  {LOOKUP_RECORDS.length}
                </p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
                  Nhóm tra cứu
                </p>
                <p className="mt-2 text-3xl font-black text-white">4</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
                  Cập nhật gần nhất
                </p>
                <p className="mt-2 text-2xl font-black text-white">15/01/2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -mt-12 pb-12 lg:-mt-20 xl:-mt-28">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_28px_80px_-28px_rgba(14,116,144,0.45)] ring-1 ring-sky-100">
            <div className="grid lg:grid-cols-[340px_minmax(0,1fr)]">
              <div className="bg-[linear-gradient(160deg,#0284c7,#0891b2,#1d4ed8)] p-8 text-white lg:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-50">
                  <Sparkles size={14} />
                  Tra cứu trực tuyến
                </div>
                <h2 className="mt-6 text-3xl font-black uppercase leading-tight">
                  Thao tác nhanh, lọc đúng nhu cầu
                </h2>
                <p className="mt-4 text-sm leading-7 text-cyan-50/90">
                  Chọn nhóm dữ liệu, nhập số giấy phép hoặc từ khóa về cơ sở,
                  sau đó tải trực tiếp bộ hồ sơ công khai tương ứng.
                </p>

                <div className="mt-8 space-y-4 rounded-[28px] bg-slate-950/20 p-5 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 text-cyan-100" size={18} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                        Phạm vi
                      </p>
                      <p className="mt-1 text-sm text-white">
                        Dữ liệu cơ sở y tế, hành nghề và chuyên ngành công khai.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarClock
                      className="mt-0.5 text-cyan-100"
                      size={18}
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                        Tần suất cập nhật
                      </p>
                      <p className="mt-1 text-sm text-white">
                        Theo đợt công bố dữ liệu định kỳ của Sở Y tế Hà Nội.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 text-cyan-100" size={18} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                        Hỗ trợ tra cứu
                      </p>
                      <p className="mt-1 text-lg font-black text-white">
                        02439985765
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form className="p-6 lg:p-10" onSubmit={handleSearch}>
                <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                  {LOOKUP_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isActive = draftFilters.type === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setDraftFilters((prev) => ({
                            ...prev,
                            type: option.value,
                          }))
                        }
                        className={`rounded-[24px] border px-4 py-4 text-left transition ${
                          isActive
                            ? "border-sky-500 bg-sky-50 shadow-[0_10px_30px_-18px_rgba(14,165,233,0.9)]"
                            : "border-slate-200 bg-white hover:border-sky-200 hover:bg-slate-50"
                        }`}
                      >
                        <div
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                            isActive
                              ? "bg-sky-600 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                        <p className="mt-4 text-sm font-black text-slate-900">
                          {option.label}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {option.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-4 2xl:grid-cols-[260px_minmax(0,1fr)_180px]">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Số giấy phép / mã hồ sơ
                    </span>
                    <input
                      type="text"
                      value={draftFilters.license}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          license: event.target.value,
                        }))
                      }
                      placeholder="Ví dụ: KSK-04, HNY-2025-Q4"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Tên cơ sở / từ khóa nội dung
                    </span>
                    <input
                      type="text"
                      value={draftFilters.keyword}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          keyword: event.target.value,
                        }))
                      }
                      placeholder="Nhập tên cơ sở, lĩnh vực hoặc nội dung dữ liệu"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </label>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#df4d43] px-5 text-sm font-black text-white transition hover:bg-[#c93c33]"
                    >
                      <Search size={18} />
                      Tra cứu
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                  <p>
                    Kết quả đang hiển thị theo nhóm{" "}
                    <span className="font-bold text-slate-800">
                      {activeOption?.label ?? "Tất cả dữ liệu"}
                    </span>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="font-bold text-sky-700 transition hover:text-sky-900"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto grid gap-6 px-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
                  Kết quả tra cứu
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {filteredRecords.length} bộ dữ liệu phù hợp
                </h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                Tổng lượt tải tham chiếu:{" "}
                <span className="font-black text-slate-900">
                  {totalDownloads.toLocaleString("vi-VN")}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRecords.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-sky-200 bg-white px-6 py-14 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                    <Search size={28} />
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-slate-900">
                    Không tìm thấy dữ liệu phù hợp
                  </h3>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                    Hãy thử đổi nhóm tra cứu, rút gọn từ khóa hoặc nhập mã hồ sơ
                    gần đúng hơn để hệ thống đối sánh lại kết quả.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-700"
                  >
                    Đặt lại bộ lọc
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                filteredRecords.map((item) => {
                  const hasFile = Boolean(fileUrlMap[item.fileName]);

                  return (
                    <article
                      key={item.id}
                      className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-4 flex flex-wrap items-center gap-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${
                                TYPE_STYLES[item.type]
                              }`}
                            >
                              {TYPE_LABELS[item.type]}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                              Mã: {item.licenseCode}
                            </span>
                          </div>

                          <h3 className="text-xl font-black leading-tight text-slate-950">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-slate-500">
                            {item.summary}
                          </p>

                          <div className="mt-5 grid gap-3 text-sm text-slate-500 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Đơn vị
                              </p>
                              <p className="mt-1 font-bold text-slate-700">
                                {item.organization}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Nguồn dữ liệu
                              </p>
                              <p className="mt-1 font-bold text-slate-700">
                                {item.source}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Cập nhật
                              </p>
                              <p className="mt-1 font-bold text-slate-700">
                                {item.updatedAt}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">
                              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Lượt tải
                              </p>
                              <p className="mt-1 font-bold text-slate-700">
                                {item.downloads.toLocaleString("vi-VN")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-col gap-3 lg:w-[220px]">
                          <button
                            type="button"
                            onClick={() => handleDownload(item.fileName)}
                            disabled={!hasFile}
                            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black transition ${
                              hasFile
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "cursor-not-allowed bg-slate-200 text-slate-400"
                            }`}
                          >
                            <FileDown size={18} />
                            Tải tài liệu
                          </button>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                            <div className="flex items-center gap-2 font-bold text-slate-700">
                              <Download size={16} />
                              Tệp đính kèm
                            </div>
                            <p className="mt-2 break-all text-xs leading-6">
                              {item.fileName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-700">
                Thông tin nhanh
              </p>
              <h3 className="mt-3 text-2xl font-black text-slate-950">
                Bộ lọc hiện tại
              </h3>
              <div className="mt-5 space-y-3 text-sm text-slate-500">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Nhóm dữ liệu
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {activeOption?.label ?? "Tất cả dữ liệu"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Số giấy phép / mã hồ sơ
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {appliedFilters.license || "Chưa nhập"}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Từ khóa
                  </p>
                  <p className="mt-1 font-bold text-slate-800">
                    {appliedFilters.keyword || "Chưa nhập"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                Hướng dẫn
              </p>
              <h3 className="mt-3 text-2xl font-black">
                Mẹo tra cứu chính xác hơn
              </h3>
              <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
                <p>
                  1. Nếu đã có mã hồ sơ, nhập trực tiếp vào ô bên trái để rút
                  gọn kết quả ngay.
                </p>
                <p>
                  2. Với nhóm cơ sở khám chữa bệnh, nên tìm theo tên riêng hoặc
                  lĩnh vực hoạt động để lọc nhanh hơn.
                </p>
                <p>
                  3. Nếu chưa rõ tên đơn vị, hãy nhập từ khóa ngắn theo chuyên
                  môn hoặc nội dung cần tra cứu.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default DataLookup;
