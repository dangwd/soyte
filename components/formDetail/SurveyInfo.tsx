import { ALL_FACILITIES } from "@/constants";
import { Dropdown } from "primereact/dropdown";
import React from "react";

export default function SurveyInfo({ info, fieldKey, value, onChange, error }) {
  const commonInputClass = `
    w-full h-[46px] rounded-xl border bg-white px-4 text-[15px] text-slate-700
    shadow-sm outline-none transition-all duration-200
    ${
      error
        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-300 hover:border-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
    }
  `;

  const dropdownPt = {
    root: {
      className: `
        w-full rounded-xl border bg-white text-[15px] text-slate-700 shadow-sm transition-all duration-200
        ${
          error
            ? "border-red-500 ring-2 ring-red-100"
            : "border-slate-300 hover:border-slate-400 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100"
        }
      `,
    },
    input: {
      className: "px-4 py-2 text-[15px] text-slate-700",
    },
    trigger: {
      className: "w-10 text-slate-400",
    },
    panel: {
      className:
        "mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl",
    },
    wrapper: {
      className: "max-h-60",
    },
    item: ({ context }) => ({
      className: `
        px-4 py-2 text-[14px] cursor-pointer transition-colors
        ${
          context.selected
            ? "bg-blue-500 text-white"
            : "text-slate-700 hover:bg-blue-50"
        }
      `,
    }),
    filterInput: {
      className:
        "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100",
    },
  };

  const selectOptions = info.option?.length
    ? info.option
    : ALL_FACILITIES.filter(({ type }) =>
        info.facilityTypeFilter?.includes(type),
      ).map(({ id, name }) => ({
        key: id,
        value: name,
      }));

  const renderField = () => {
    switch (info.type) {
      case "text":
        return (
          <input
            type="text"
            value={value || ""}
            className={commonInputClass}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            placeholder={info.placeholder || "Nhập nội dung"}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value || ""}
            className={commonInputClass}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            placeholder={info.placeholder || "Nhập số"}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value || ""}
            className={commonInputClass}
            onChange={(e) => onChange(fieldKey, e.target.value)}
          />
        );

      case "select":
      case "facility_multiselect":
        return (
          <Dropdown
            value={value ?? null}
            options={selectOptions}
            optionLabel="value"
            optionValue="key"
            placeholder="Chọn"
            filter
            filterPlaceholder="Tìm kiếm..."
            className="w-full"
            pt={dropdownPt}
            onChange={(e) => onChange(fieldKey, e.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <label className="mb-1 block font-medium text-slate-700">
        {info.title}
      </label>
      {renderField()}
      {error && (
        <div className="mt-2 text-sm text-red-500">
          Vui lòng nhập thông tin này
        </div>
      )}
    </div>
  );
}
