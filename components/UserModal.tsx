import React, { useEffect, useState, useRef, useMemo } from "react";
import { api } from "../api";
import { User, Permission } from "../types";
import {
  FACILITIES_BV,
  FACILITIES_TT,
  FACILITIES_BT,
  FACILITIES_TYT,
  FACILITIES_CC,
} from "../constants";
import {
  Users,
  Shield,
  X,
  Save,
  Loader2,
  ChevronDown,
  PlusIcon,
  Edit3Icon,
} from "lucide-react";
import { Toast } from "primereact/toast";
import { Button, InputText, Dropdown, MultiSelect } from "@/components/prime";

interface UserModalProps {
  visible: boolean;
  onHide: () => void;
  user: User | null; // null for add mode
  onSaveSuccess: () => void;
}

// Helper to flatten nested permission object back into dot-notation strings
const flattenPermissions = (obj: any): string[] => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return [];
  const result: string[] = [];

  const traverse = (currentObj: any, currentPath: string = "") => {
    for (const key in currentObj) {
      const value = currentObj[key];

      if (key === "children" && typeof value === "object" && value !== null) {
        traverse(value, currentPath);
        continue;
      }

      const path = currentPath ? `${currentPath}.${key}` : key;

      if (typeof value === "object" && value !== null) {
        result.push(path);
        traverse(value, path);
      } else if (key === "view" && value === true) {
        result.push(path);
      }
    }
  };

  traverse(obj);
  return Array.from(new Set(result));
};

// Helper to nest flat dot-notation strings into nested object structure
const nestPermissions = (paths: string[]): any => {
  const result: any = {};
  const actionKeys = [
    "view",
    "create",
    "update",
    "delete",
    "reply",
    "export",
    "update_status",
  ];

  paths.forEach((path) => {
    const parts = path.split(".");
    let current = result;

    parts.forEach((part, index) => {
      if (actionKeys.includes(part)) {
        current[part] = true;
        return;
      }

      if (!current[part]) current[part] = {};

      if (index === parts.length - 1) {
        current[part].view = true;
      } else {
        if (!current[part].children) current[part].children = {};
        current = current[part].children;
      }
    });
  });
  return result;
};

const UserModal: React.FC<UserModalProps> = ({
  visible,
  onHide,
  user,
  onSaveSuccess,
}) => {
  const toast = useRef<Toast>(null);
  const isEdit = !!user;

  const [formData, setFormData] = useState<any>({
    full_name: "",
    email: "",
    password: "",
    role: "user",
    status: 0,
    type: "",
    unit: "",
    permissions: {},
    us: "",
    pass: "",
  });

  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedParents, setExpandedParents] = useState<
    Record<number, boolean>
  >({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (visible) {
      setErrors({});
      fetchPermissions();
      if (isEdit && user) {
        const unit = user.unit || user.facility_id || "";
        let type = user.type || "";

        if (!type && unit) {
          if (FACILITIES_BV.some((f) => f.id === unit)) type = "BV";
          else if (FACILITIES_TT.some((f) => f.id === unit)) type = "TT";
          else if (FACILITIES_BT.some((f) => f.id === unit)) type = "BT";
          else if (FACILITIES_TYT.some((f) => f.id === unit)) type = "TYT";
          else if (FACILITIES_CC.some((f) => f.id === unit)) type = "CC";
        }

        setFormData({
          full_name: user.full_name || "",
          email: user.email || "",
          role: user.role || "user",
          status: Number(user.status) as 0 | 1,
          type: type,
          unit: user.role === "admin" ? (unit && typeof unit === "string" ? unit.split(",") : (Array.isArray(unit) ? unit : [])) : unit,
          us: user.us || "",
          pass: user.pass || "",
          password: "", // Don't show password or populate it
        });

        const perms =
          user.permissions && typeof user.permissions === "object"
            ? flattenPermissions(user.permissions)
            : Array.isArray(user.permissions)
              ? user.permissions
              : [];

        setSelectedPermissions(perms);
      } else {
        setFormData({
          full_name: "",
          email: "",
          password: "",
          role: "user",
          status: 0,
          type: "",
          unit: "",
          us: "",
          pass: "",
        });
        setSelectedPermissions([]);
        setExpandedParents({});
      }
    }
  }, [visible, user]);

  const fetchPermissions = async () => {
    try {
      const response = await api.getPermissions();
      const data = response.permissions || response.data || response;
      setAvailablePermissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  const hierarchicalPermissions = useMemo(() => {
    const filterActionsRecursive = (
      items: Permission[],
      depth = 0,
    ): Permission[] => {
      if (depth >= 2) return [];

      return items
        .filter((p) => {
          const name = p.name.toLowerCase();
          return (
            !name.endsWith(".create") &&
            !name.endsWith(".update") &&
            !name.endsWith(".delete") &&
            !name.endsWith(".reply") &&
            !name.endsWith(".export") &&
            !name.endsWith(".update_status")
          );
        })
        .map((p) => ({
          ...p,
          children: p.children
            ? filterActionsRecursive(p.children, depth + 1)
            : [],
        }));
    };

    const hasAlreadyNested = availablePermissions.some(
      (p) => p.children && p.children.length > 0,
    );

    if (hasAlreadyNested) {
      const filtered = filterActionsRecursive(availablePermissions);
      const allIds = new Set(filtered.map((p) => p.id));
      return filtered.filter((p) => !p.parent_id || !allIds.has(p.parent_id));
    }

    const map: Record<number, Permission & { children: Permission[] }> = {};
    const filteredFlat = availablePermissions.filter((p) => {
      const name = p.name.toLowerCase();
      return (
        !name.endsWith(".create") &&
        !name.endsWith(".update") &&
        !name.endsWith(".delete") &&
        !name.endsWith(".reply") &&
        !name.endsWith(".export") &&
        !name.endsWith(".update_status")
      );
    });

    filteredFlat.forEach((p) => {
      map[p.id] = { ...p, children: p.children || [] };
    });

    const roots: (Permission & { children: Permission[] })[] = [];
    filteredFlat.forEach((p) => {
      if (p.parent_id && map[p.parent_id]) {
        map[p.parent_id].children.push(map[p.id]);
      } else {
        roots.push(map[p.id]);
      }
    });

    return roots;
  }, [availablePermissions]);

  const handleTogglePermission = (permission: any) => {
    const permissionName = permission.name;
    const isSelected = selectedPermissions.includes(permissionName);

    let newSelected = [...selectedPermissions];

    const getAllDescendantNames = (p: any): string[] => {
      let names: string[] = [p.name];
      if (p.children && p.children.length > 0) {
        p.children.forEach((child: any) => {
          names = [...names, ...getAllDescendantNames(child)];
        });
      }
      return names;
    };

    const getAncestorNames = (pName: string): string[] => {
      const p = availablePermissions.find((x) => x.name === pName);
      if (!p || !p.parent_id) return [];
      const parent = availablePermissions.find((x) => x.id === p.parent_id);
      if (!parent) return [];
      return [parent.name, ...getAncestorNames(parent.name)];
    };

    if (isSelected) {
      const descendantsToDeselect = getAllDescendantNames(permission);
      newSelected = newSelected.filter((p) => !descendantsToDeselect.includes(p));
    } else {
      const descendantsToSelect = getAllDescendantNames(permission);
      newSelected = Array.from(
        new Set([...newSelected, ...descendantsToSelect]),
      );
      const ancestorsToSelect = getAncestorNames(permissionName);
      newSelected = Array.from(new Set([...newSelected, ...ancestorsToSelect]));
      if (permission.children?.length > 0) {
        setExpandedParents((prev) => ({ ...prev, [permission.id]: true }));
      }
    }
    setSelectedPermissions(newSelected);
  };

  const getFacilityOptions = (type: string) => {
    switch (type) {
      case "BV": return FACILITIES_BV.map((f) => ({ label: f.name, value: f.id }));
      case "TT": return FACILITIES_TT.map((f) => ({ label: f.name, value: f.id }));
      case "BT": return FACILITIES_BT.map((f) => ({ label: f.name, value: f.id }));
      case "TYT": return FACILITIES_TYT.map((f) => ({ label: f.name, value: f.id }));
      case "CC": return FACILITIES_CC.map((f) => ({ label: f.name, value: f.id }));
      default: return [];
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Họ và tên không được để trống.";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email không được để trống.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!formData.role) {
      newErrors.role = "Vui lòng chọn vai trò.";
    }

    if (formData.role === "user") {
      if (!formData.type) {
        newErrors.type = "Vui lòng chọn loại hình.";
      }
      if (formData.type && !formData.unit) {
        newErrors.unit = "Vui lòng chọn đơn vị.";
      }
    }

    if (!isEdit && !formData.password) {
      newErrors.password = "Mật khẩu không được để trống.";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.current?.show({
        severity: "warn",
        summary: "Thông tin chưa hợp lệ",
        detail: "Vui lòng kiểm tra lại các trường thông tin.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const hierarchicalPermissions =
        formData.role === "user" ? {} : nestPermissions(selectedPermissions);

      const dataToSubmit = {
        ...formData,
        unit: Array.isArray(formData.unit) ? formData.unit.join(",") : formData.unit,
        permissions: hierarchicalPermissions,
      };

      let res;
      if (isEdit && user) {
        res = await api.updateUser(user.id, dataToSubmit);
      } else {
        res = await api.register(dataToSubmit);
      }

      if (!res?.message) {
        toast.current?.show({
          severity: "success",
          summary: "Thành công",
          detail: isEdit ? "Cập nhật người dùng thành công" : "Thêm người dùng mới thành công",
        });
      }

      setTimeout(() => {
        onSaveSuccess();
        onHide();
      }, 1000);
    } catch (error: any) {
      console.error("Error saving user:", error);
      if (error.message && error.message.includes("API Error")) {
        toast.current?.show({
          severity: "error",
          summary: "Lỗi",
          detail: "Không thể lưu thông tin người dùng",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const renderPermissionItem = (item: Permission, level = 0) => {
    const isSelected = selectedPermissions.includes(item.name);
    const children = item.children || [];
    const hasChildren = children.length > 0;
    const isExpanded = !!expandedParents[item.id] || isSelected;

    return (
      <React.Fragment key={item.id}>
        <div
          className={`group flex items-center gap-3 p-3.5 rounded-xl transition-all cursor-pointer border mb-2 ${isSelected ? "bg-primary-50 border-primary-200 shadow-sm" : "bg-white border-gray-100 hover:border-gray-300"}`}
          style={{ marginLeft: `${level * 24}px` }}
          onClick={() => handleTogglePermission(item)}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? "bg-primary-600 border-primary-600 shadow-primary-100 shadow-lg" : "bg-gray-50 border-gray-200 group-hover:border-primary-300"}`}>
              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full animate-in zoom-in-50" />}
            </div>
            <div className={`text-[11px] font-black tracking-tight leading-tight uppercase transition-colors ${isSelected ? "text-primary-800" : "text-gray-600"}`}>
              {item.description}
            </div>
          </div>
          {hasChildren && (
            <div className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
              <ChevronDown size={14} className={isSelected ? "text-primary-500" : "text-gray-400"} />
            </div>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="animate-in slide-in-from-top-1 fade-in duration-300">
            {children.map((child) => renderPermissionItem(child, level + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Toast ref={toast} />
      <div className={`bg-white w-full ${formData.role === "user" ? "max-w-[40vw]" : "max-w-[60vw]"} rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] transition-all duration-300`}>
        <div className="bg-primary-700 p-4 flex justify-between items-center text-white shrink-0">
          <h3 className="font-bold flex items-center gap-2 text-lg uppercase tracking-tight">
            {isEdit ? <Edit3Icon size={20} /> : <PlusIcon size={20} />}
            {isEdit ? "CẬP NHẬT THÔNG TIN" : "THÊM MỚI NGƯỜI DÙNG"}
          </h3>
          <Button icon={<X size={20} />} text rounded onClick={onHide} className="!text-white hover:!bg-white/20" />
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className={`grid grid-cols-1 ${formData.role !== "user" ? "md:grid-cols-2" : ""} gap-8`}>
            <div className="space-y-6">
              <h4 className="font-black text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2">
                <Users size={18} className="text-primary-600" />
                THÔNG TIN CƠ BẢN
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className={`w-full p-3 bg-gray-50 border ${errors.full_name ? "border-red-500" : "border-gray-200"} rounded-xl focus:ring-2 focus:ring-primary-100 outline-none font-bold text-gray-700 transition-all`}
                    placeholder="Nhập họ và tên đầy đủ"
                  />
                  {errors.full_name && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">{errors.full_name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                    Địa chỉ Email <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isEdit}
                    className={`w-full p-3 border ${errors.email ? "border-red-500" : "border-gray-200"} rounded-xl outline-none font-bold transition-all ${isEdit ? "bg-gray-100 text-gray-400" : "bg-gray-50 text-gray-700 focus:ring-2 focus:ring-primary-100"}`}
                    placeholder="example@gmail.com"
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">{errors.email}</p>}
                </div>

                {!isEdit && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">
                      Mật khẩu tài khoản <span className="text-red-500">*</span>
                    </label>
                    <InputText
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full p-3 bg-gray-50 border ${errors.password ? "border-red-500" : "border-gray-200"} rounded-xl focus:ring-2 focus:ring-primary-100 outline-none font-bold text-gray-700 transition-all`}
                      placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">{errors.password}</p>}
                  </div>
                )}

                <div className={isEdit ? "grid grid-cols-2 gap-4" : "block"}>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Vai trò hệ thống</label>
                    <Dropdown
                      value={formData.role}
                      options={[
                        { label: "Người dùng", value: "user" },
                        { label: "Quản trị viên", value: "admin" },
                      ]}
                      onChange={(e) => setFormData({ ...formData, role: e.value, unit: e.value === "admin" ? [] : "" })}
                      className={`w-full !bg-gray-50 !border-${errors.role ? "red-500" : "gray-200"} !rounded-xl outline-none font-bold text-gray-700`}
                    />
                    {errors.role && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">{errors.role}</p>}
                  </div>
                  {isEdit && (
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Trạng thái</label>
                      <Dropdown
                        value={formData.status}
                        options={[
                          { label: "Hoạt động", value: 1 },
                          { label: "Vô hiệu hóa", value: 0 },
                        ]}
                        onChange={(e) => setFormData({ ...formData, status: e.value })}
                        className="w-full !bg-gray-50 !border-gray-200 !rounded-xl outline-none font-bold text-gray-700"
                      />
                    </div>
                  )}
                </div>

                {formData.role === "user" && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 animate-in slide-in-from-top-2">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Loại hình cơ sở <span className="text-red-500">*</span></label>
                      <Dropdown
                        value={formData.type}
                        options={[
                          { label: "Bệnh viện", value: "BV" },
                          { label: "Trung tâm y tế", value: "TT" },
                          { label: "Bảo trợ xã hội", value: "BT" },
                          { label: "Trạm y tế", value: "TYT" },
                          { label: "Cấp cứu 115", value: "CC" },
                        ]}
                        onChange={(e) => setFormData({ ...formData, type: e.value, unit: "" })}
                        placeholder="-- Chọn loại hình --"
                        className={`w-full !bg-white !border-${errors.type ? "red-500" : "gray-200"} !rounded-xl outline-none font-bold text-gray-700`}
                      />
                      {errors.type && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">{errors.type}</p>}
                    </div>

                    {formData.type && (
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Đơn vị công tác <span className="text-red-500">*</span></label>
                        <Dropdown
                          value={formData.unit}
                          options={getFacilityOptions(formData.type)}
                          onChange={(e) => setFormData({ ...formData, unit: e.value })}
                          placeholder="-- Chọn đơn vị --"
                          filter
                          filterPlaceholder="Tìm kiếm tên đơn vị..."
                          virtualScrollerOptions={{ itemSize: 38 }}
                          className={`w-full !bg-white !border-${errors.unit ? "red-500" : "gray-200"} !rounded-xl outline-none font-bold text-gray-700`}
                        />
                        {errors.unit && <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">{errors.unit}</p>}
                      </div>
                    )}
                  </div>
                )}

                {formData.role === "admin" && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 animate-in slide-in-from-top-2">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Loại hình quản lý</label>
                      <Dropdown
                        value={formData.type}
                        options={[
                          { label: "Bệnh viện", value: "BV" },
                          { label: "Trung tâm y tế", value: "TT" },
                          { label: "Bảo trợ xã hội", value: "BT" },
                          { label: "Trạm y tế", value: "TYT" },
                          { label: "Cấp cứu 115", value: "CC" },
                        ]}
                        onChange={(e) => {
                          const newType = e.value;
                          const options = getFacilityOptions(newType);
                          const allUnitIds = options.map((o) => o.value);
                          setFormData({ ...formData, type: newType, unit: allUnitIds });
                        }}
                        placeholder="-- Chọn loại hình --"
                        className="w-full !bg-white !border-gray-200 !rounded-xl outline-none font-bold text-gray-700"
                      />
                    </div>

                    {formData.type && (
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1">Đơn vị quản lý</label>
                        <MultiSelect
                          value={formData.unit}
                          options={getFacilityOptions(formData.type)}
                          onChange={(e) => setFormData({ ...formData, unit: e.value })}
                          placeholder="-- Chọn đơn vị --"
                          filter
                          filterPlaceholder="Tìm kiếm tên đơn vị..."
                          className="w-full !bg-white !border-gray-200 !rounded-xl outline-none font-bold text-gray-700 user-modal-ms h-[48px]"
                          panelClassName="facility-ms-panel"
                          maxSelectedLabels={3}
                          selectedItemsLabel="{0} đơn vị đã chọn"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {formData.role !== "user" && (
              <div className="space-y-6">
                <h4 className="font-black text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-2 uppercase text-sm">
                  <Shield size={18} className="text-primary-600" />
                  PHÂN QUYỀN ({selectedPermissions.length})
                </h4>
                <div className="bg-gray-100 p-5 rounded-3xl border border-gray-200 max-h-[450px] overflow-y-auto custom-scrollbar-thin">
                  {availablePermissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                      <Loader2 className="animate-spin mb-2" size={24} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Đang kết nối...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {hierarchicalPermissions.map((permission) => renderPermissionItem(permission))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-4 shrink-0 bg-gray-50/50">
          <Button label="HỦY BỎ" onClick={onHide} className="flex-1 py-4 border-gray-200 text-gray-500 font-black rounded-2xl hover:bg-white transition-all uppercase tracking-widest text-[11px] shadow-sm" outlined />
          <Button
            label={isEdit ? "CẬP NHẬT DỮ LIỆU" : "KHỞI TẠO NGƯỜI DÙNG"}
            icon={isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving}
            className="flex-1 p-4 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-2xl shadow-xl shadow-primary-200 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-[11px]"
          />
        </div>
      </div>
    </div>
  );
};

export default UserModal;
