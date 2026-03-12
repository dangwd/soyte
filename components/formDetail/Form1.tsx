import { api } from "@/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import React, { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

export default function BieuMau1Table({ id, type, formData }) {
 const toast = useRef<Toast>(null);
 const navigate = useNavigate();

 const [errors, setErrors] = useState<Record<string, boolean>>({});
 const [tableData, setTableData] = useState(formData.data);
 const [formInfo, setFormInfo] = useState({
   title: formData.name,
   description: formData.description,
 });

 const [visible, setVisible] = useState(false);
 const [creatorName, setCreatorName] = useState("");
 const [age, setAge] = useState("");
 const [birthday, setBirthday] = useState("");
 const [email, setEmail] = useState("");
 const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

 const toRoman = (num: number) => {
   const roman = [
     "I",
     "II",
     "III",
     "IV",
     "V",
     "VI",
     "VII",
     "VIII",
     "IX",
     "X",
     "XI",
     "XII",
     "XIII",
     "XIV",
     "XV",
     "XVI",
     "XVII",
     "XVIII",
     "XIX",
   ];
   return roman[num] || num;
 };

 const toggleSection = (index: number) => {
   setOpenSections((prev) => ({
     ...prev,
     [index]: !prev[index],
   }));
 };

 const clearFieldError = (key: string) => {
   setErrors((prev) => ({
     ...prev,
     [key]: false,
   }));
 };

 const updateProgress = (
   sectionIndex: number,
   optionIndex: number,
   value: number | string,
 ) => {
   const newData = [...tableData];
   newData[sectionIndex].option[optionIndex].progress.value = value;
   setTableData(newData);

   clearFieldError(`progress-${sectionIndex}-${optionIndex}`);
 };

 const updateRating = (
   sectionIndex: number,
   optionIndex: number,
   value: number | string,
 ) => {
   const newData = [...tableData];
   newData[sectionIndex].option[optionIndex].rating.value = value;
   setTableData(newData);

   clearFieldError(`rating-${sectionIndex}-${optionIndex}`);
 };

const updateNote = (
  sectionIndex: number,
  optionIndex: number,
  value: string,
) => {
  const newData = [...tableData];
  newData[sectionIndex].option[optionIndex].note = value;
  setTableData(newData);

  if (value.trim()) {
    clearFieldError(`note-${sectionIndex}-${optionIndex}`);
  }
};

 const isValidEmail = (value: string) => {
   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
 };

const validateForm = () => {
  const newErrors: Record<string, boolean> = {};
  const sectionsToOpen: Record<number, boolean> = {};
  let isValid = true;

  if (!creatorName.trim()) {
    newErrors["creatorName"] = true;
    isValid = false;
  }

  if (!age.trim()) {
    newErrors["age"] = true;
    isValid = false;
  }

  if (!birthday) {
    newErrors["birthday"] = true;
    isValid = false;
  }

  if (!email.trim() || !isValidEmail(email.trim())) {
    newErrors["email"] = true;
    isValid = false;
  }

  tableData.forEach((section: any, sectionIndex: number) => {
    section.option.forEach((item: any, optionIndex: number) => {
      const progressValue = item?.progress?.value;
      const ratingValue = item?.rating?.value;
      const noteValue = item?.note;

      if (
        progressValue === null ||
        progressValue === undefined ||
        progressValue === "" ||
        progressValue === -1
      ) {
        newErrors[`progress-${sectionIndex}-${optionIndex}`] = true;
        sectionsToOpen[sectionIndex] = true;
        isValid = false;
      }

      if (
        ratingValue === null ||
        ratingValue === undefined ||
        ratingValue === "" ||
        ratingValue === -1
      ) {
        newErrors[`rating-${sectionIndex}-${optionIndex}`] = true;
        sectionsToOpen[sectionIndex] = true;
        isValid = false;
      }

      if (!noteValue || !String(noteValue).trim()) {
        newErrors[`note-${sectionIndex}-${optionIndex}`] = true;
        sectionsToOpen[sectionIndex] = true;
        isValid = false;
      }
    });
  });

  setErrors(newErrors);

  if (!isValid) {
    setOpenSections((prev) => ({
      ...prev,
      ...sectionsToOpen,
    }));
  }

  return isValid;
};
 const submitForm = async () => {
   const isValid = validateForm();
  console.log("data", tableData);
  
   if (!isValid) {
     toast.current?.show({
       severity: "error",
       summary: "Thiếu thông tin",
       detail: "Vui lòng nhập đầy đủ tất cả trường bắt buộc trước khi gửi",
     });
     return;
   }

   try {
     const payload = {
       form_id: Number(id),
       creator_name: creatorName.trim(),
       age: age.trim(),
       birthday,
       email: email.trim(),
       type,
       submission_data: tableData,
       status: "pending",
     };

     await api.post("/feedbacks", payload);

     toast.current?.show({
       severity: "success",
       summary: "Thành công",
       detail: "Lưu thành công",
     });

     setVisible(false);
     navigate("/");
   } catch (error) {
     console.error("Submit error:", error);
     toast.current?.show({
       severity: "error",
       summary: "Lỗi",
       detail: "Gửi biểu mẫu thất bại",
     });
   }
 };

  const convertSubmissionData = (data: any) => {
    return data.map((section) => ({
      name: section.name,
      option: section.option.map((item) => ({
        tiendo: item.progress?.value ?? 0,
        danhgia: item.rating?.value ?? 0,
        ghichu: item.note || "",
      })),
    }));
  };

  return (
    <div className="mx-auto mt-4 w-full px-3 sm:mt-6 sm:px-4 xl:w-[88%] 2xl:w-[92%]">
      <Toast ref={toast} />

      <div className="mb-6 rounded-[28px] border border-white/60 bg-white/70 p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-7">
        <h3 className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl">
          {formInfo.title}
        </h3>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          {formInfo.description}
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <span className="relative w-full">
            <i className="pi pi-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <InputText
              value={creatorName}
              onChange={(e) => {
                setCreatorName(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, creatorName: false }));
                }
              }}
              placeholder="Nhập họ và tên"
              className={`h-[46px] w-full rounded-2xl border bg-white/80 pl-11 pr-4 text-[15px] text-slate-700 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:shadow-md ${
                errors.creatorName
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              }`}
            />
          </span>
          {errors.creatorName && (
            <small className="text-red-500">Vui lòng nhập họ và tên</small>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Tuổi <span className="text-red-500">*</span>
          </label>
          <span className="relative w-full">
            <i className="pi pi-id-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <InputText
              value={age}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setAge(value);
                if (value.trim()) {
                  setErrors((prev) => ({ ...prev, age: false }));
                }
              }}
              placeholder="Nhập tuổi"
              className={`h-[46px] w-full rounded-2xl border bg-white/80 pl-11 pr-4 text-[15px] text-slate-700 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:shadow-md ${
                errors.age
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              }`}
            />
          </span>
          {errors.age && (
            <small className="text-red-500">Vui lòng nhập tuổi</small>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Ngày sinh <span className="text-red-500">*</span>
          </label>
          <span className="relative w-full">
            <i className="pi pi-calendar absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <InputText
              value={birthday}
              onChange={(e) => {
                setBirthday(e.target.value);
                if (e.target.value) {
                  setErrors((prev) => ({ ...prev, birthday: false }));
                }
              }}
              type="date"
              className={`h-[46px] w-full rounded-2xl border bg-white/80 pl-11 pr-4 text-[15px] text-slate-700 shadow-sm outline-none transition-all duration-200 hover:shadow-md ${
                errors.birthday
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              }`}
            />
          </span>
          {errors.birthday && (
            <small className="text-red-500">Vui lòng chọn ngày sinh</small>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Email <span className="text-red-500">*</span>
          </label>
          <span className="relative w-full">
            <i className="pi pi-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <InputText
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (
                  e.target.value.trim() &&
                  isValidEmail(e.target.value.trim())
                ) {
                  setErrors((prev) => ({ ...prev, email: false }));
                }
              }}
              type="email"
              placeholder="example@email.com"
              className={`h-[46px] w-full rounded-2xl border bg-white/80 pl-11 pr-4 text-[15px] text-slate-700 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 hover:shadow-md ${
                errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
              }`}
            />
          </span>
          {errors.email && (
            <small className="text-red-500">Vui lòng nhập email hợp lệ</small>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white/70 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        {tableData.map((section, sIndex) => {
          const sectionHasError = section.option.some((_, oIndex) => {
            return (
              errors[`note-${sIndex}-${oIndex}`] ||
              errors[`progress-${sIndex}-${oIndex}`] ||
              errors[`rating-${sIndex}-${oIndex}`]
            );
          });

          return (
            <div
              key={sIndex}
              className="border-b border-slate-200/70 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => toggleSection(sIndex)}
                className={`flex w-full items-center gap-3 px-4 py-4 text-left text-white transition-all duration-200 hover:brightness-110 ${
                  sectionHasError ? "bg-red-500" : "bg-primary-800"
                }`}
              >
                <i
                  className={`pi ${
                    openSections[sIndex]
                      ? "pi-chevron-down"
                      : "pi-chevron-right"
                  } text-xs`}
                />
                <span className="min-w-[30px] font-semibold">
                  {toRoman(sIndex)}
                </span>
                <span className="text-sm font-semibold sm:text-base">
                  {section.name}
                </span>
                {sectionHasError && (
                  <span className="ml-auto rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                    Thiếu thông tin
                  </span>
                )}
              </button>

              {!openSections[sIndex] && (
                <div className="space-y-4 p-3 sm:p-4">
                  {section.option.map((item, oIndex) => {
                    const noteError = errors[`note-${sIndex}-${oIndex}`];
                    const progressError =
                      errors[`progress-${sIndex}-${oIndex}`];
                    const ratingError = errors[`rating-${sIndex}-${oIndex}`];
                    const itemHasError =
                      noteError || progressError || ratingError;

                    return (
                      <div
                        key={oIndex}
                        className={`overflow-hidden rounded-[24px] border bg-white/90 shadow-sm ${
                          itemHasError
                            ? "border-red-400 shadow-red-100"
                            : "border-slate-200/80"
                        }`}
                      >
                        <div
                          className={`px-4 py-4 ${
                            itemHasError
                              ? "border-b border-red-200 bg-red-50/60"
                              : "border-b border-slate-200/70"
                          }`}
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                                itemHasError
                                  ? "border-red-300 bg-red-100 text-red-600"
                                  : "border-slate-300 bg-slate-50 text-slate-600"
                              }`}
                            >
                              {oIndex + 1}
                            </div>
                            <div
                              className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                                itemHasError ? "text-red-400" : "text-slate-400"
                              }`}
                            >
                              Nội dung thực hiện
                            </div>
                          </div>

                          <div className="text-[15px] leading-7 text-slate-700">
                            {item.content}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-3">
                          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4">
                            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Phương thức thực hiện
                            </div>
                            <div className="text-sm leading-6 text-slate-700">
                              {item.method}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4">
                            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Sản phẩm đầu ra
                            </div>
                            <div className="text-sm leading-6 text-slate-700">
                              {item.productOut}
                            </div>
                          </div>

                          <div
                            className={`rounded-2xl border bg-slate-50/60 p-4 ${
                              noteError
                                ? "border-red-500 bg-red-50/70"
                                : "border-slate-200/70"
                            }`}
                          >
                            <div
                              className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                                noteError ? "text-red-500" : "text-slate-400"
                              }`}
                            >
                              Ghi chú / Kiến nghị{" "}
                              <span className="text-red-500">*</span>
                            </div>

                            <InputTextarea
                              value={item.note || ""}
                              onChange={(e) =>
                                updateNote(sIndex, oIndex, e.target.value)
                              }
                              rows={3}
                              autoResize
                              className={`w-full rounded-2xl border bg-white/80 px-4 py-3 text-[15px] shadow-sm outline-none transition-all ${
                                noteError
                                  ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                                  : "border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                              }`}
                              placeholder="Nhập ghi chú hoặc kiến nghị"
                            />

                            {noteError && (
                              <small className="mt-2 block text-red-500">
                                Vui lòng nhập ghi chú / kiến nghị
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 border-t border-slate-200/70 px-4 py-4 xl:grid-cols-2">
                          <div>
                            <div
                              className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                                progressError
                                  ? "text-red-500"
                                  : "text-slate-400"
                              }`}
                            >
                              Tiến độ thực hiện{" "}
                              <span className="text-red-500">*</span>
                            </div>

                            <div
                              className={`rounded-2xl p-2 ${
                                progressError
                                  ? "border border-red-500 bg-red-50/60"
                                  : "border border-transparent"
                              }`}
                            >
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                {[
                                  { label: "Đã thực hiện", value: 1 },
                                  { label: "Đang thực hiện", value: 2 },
                                  { label: "Chưa thực hiện", value: 3 },
                                ].map((progress) => {
                                  const active =
                                    item.progress.value === progress.value;

                                  return (
                                    <label
                                      key={progress.value}
                                      htmlFor={`progress-${sIndex}-${oIndex}-${progress.value}`}
                                      className={`inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                                        active
                                          ? "border-blue-500 bg-blue-500 text-white"
                                          : progressError
                                            ? "border-red-300 bg-white text-slate-700 hover:border-red-400"
                                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                                      }`}
                                    >
                                      <RadioButton
                                        inputId={`progress-${sIndex}-${oIndex}-${progress.value}`}
                                        name={`progress-${sIndex}-${oIndex}`}
                                        value={progress.value}
                                        checked={active}
                                        onChange={() =>
                                          updateProgress(
                                            sIndex,
                                            oIndex,
                                            progress.value,
                                          )
                                        }
                                      />
                                      <span>{progress.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>

                            {progressError && (
                              <small className="mt-2 block text-red-500">
                                Vui lòng chọn tiến độ thực hiện
                              </small>
                            )}
                          </div>

                          <div>
                            <div
                              className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                                ratingError ? "text-red-500" : "text-slate-400"
                              }`}
                            >
                              Đánh giá <span className="text-red-500">*</span>
                            </div>

                            <div
                              className={`rounded-2xl p-2 ${
                                ratingError
                                  ? "border border-red-500 bg-red-50/60"
                                  : "border border-transparent"
                              }`}
                            >
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {[
                                  { label: "Đạt", value: 1 },
                                  { label: "Không đạt", value: 2 },
                                ].map((rating) => {
                                  const active =
                                    item.rating.value === rating.value;

                                  return (
                                    <label
                                      key={rating.value}
                                      htmlFor={`rating-${sIndex}-${oIndex}-${rating.value}`}
                                      className={`inline-flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                                        active
                                          ? "border-emerald-500 bg-emerald-500 text-white"
                                          : ratingError
                                            ? "border-red-300 bg-white text-slate-700 hover:border-red-400"
                                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                                      }`}
                                    >
                                      <RadioButton
                                        inputId={`rating-${sIndex}-${oIndex}-${rating.value}`}
                                        name={`rating-${sIndex}-${oIndex}`}
                                        value={rating.value}
                                        checked={active}
                                        onChange={() =>
                                          updateRating(
                                            sIndex,
                                            oIndex,
                                            rating.value,
                                          )
                                        }
                                      />
                                      <span>{rating.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>

                            {ratingError && (
                              <small className="mt-2 block text-red-500">
                                Vui lòng chọn đánh giá
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mb-4 mt-6 flex justify-end">
        <Button
          label="Gửi biểu mẫu"
          icon="pi pi-send"
          onClick={submitForm}
          className="
          rounded-2xl border-0 bg-gradient-to-r from-emerald-400 to-green-500
          px-5 py-3 text-sm font-semibold text-white
          shadow-lg shadow-emerald-200 transition-all duration-200
          hover:-translate-y-0.5 hover:shadow-xl
          active:translate-y-0 sm:text-base
        "
        />
      </div>
    </div>
  );
}
