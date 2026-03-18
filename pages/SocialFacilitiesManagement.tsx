import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
} from "lucide-react";
import { api } from "../api";
import AdminLayout from "../components/AdminLayout";
import { Dropdown, Button } from "@/components/prime";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import FacilityForm from "../components/FacilityForm";

const FACILITY_TYPES = [
  { id: "all", title: "Tất cả các loại" },
  { id: "BV", title: "Bệnh viện" },
  { id: "BT", title: "Cơ sở bảo trợ" },
  { id: "TT", title: "Trung tâm" },
  { id: "CC", title: "Chi cục" },
  { id: "TYT", title: "Trạm y tế" },
];

const SocialFacilitiesManagement = () => {
  const [allFacilities, setAllFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);

  const toast = useRef<Toast>(null);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      // Fetch all facilities at once for FE pagination
      const response = await api.get(`/social-facilities`);
      if (response && response.success) {
        setAllFacilities(response.data);
      } else {
        setAllFacilities([]);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Không thể tải danh sách cơ sở y tế",
      });
      setAllFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Logic lọc và tìm kiếm trên FE
  const filteredFacilities = React.useMemo(() => {
    return allFacilities.filter((item) => {
      const matchType = filterType === "all" || item.type === filterType;
      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(searchLower) ||
        item.address.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower);

      return matchType && matchSearch;
    });
  }, [allFacilities, searchTerm, filterType]);

  // Logic phân trang trên FE
  const totalItems = filteredFacilities.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedFacilities = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredFacilities.slice(startIndex, startIndex + pageSize);
  }, [filteredFacilities, currentPage, pageSize]);

  // Reset trang về 1 khi lọc hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // Thống kê theo từng type
  const typeStats = React.useMemo(() => {
    return FACILITY_TYPES.filter((t) => t.id !== "all").map((type) => ({
      ...type,
      count: allFacilities.filter((f) => f.type === type.id).length,
    }));
  }, [allFacilities]);

  const handleDelete = async (id: string) => {
    confirmDialog({
      message: "Bạn có chắc chắn muốn xóa cơ sở y tế này?",
      header: "Xác nhận xóa",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await api.delete(`/social-facilities/${id}`);
          toast.current?.show({
            severity: "success",
            summary: "Thành công",
            detail: "Đã xóa cơ sở y tế",
          });
          fetchFacilities();
        } catch (error) {
          toast.current?.show({
            severity: "error",
            summary: "Lỗi",
            detail: "Lỗi khi xóa cơ sở y tế",
          });
        }
      },
    });
  };

  return (
    <AdminLayout title="Quản lý Cơ sở Y tế">
      <Toast ref={toast} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <button
          onClick={() => setFilterType("all")}
          className={`p-4 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 active:scale-95 ${filterType === "all"
            ? "bg-primary-50 border-primary-500 ring-2 ring-primary-100 ring-offset-2 shadow-md"
            : "bg-white border-gray-100 hover:border-primary-500 hover:shadow-md"
            }`}
        >
          <p className="text-gray-400 text-[9px] font-black uppercase mb-1">
            Tổng số
          </p>
          <h3 className={`text-xl font-black ${filterType === 'all' ? 'text-primary-600' : 'text-gray-800'}`}>
            {allFacilities.length}
          </h3>
        </button>
        {typeStats.map((stat) => (
          <button
            key={stat.id}
            onClick={() => setFilterType(stat.id)}
            className={`p-4 rounded-2xl shadow-sm border transition-all duration-300 flex flex-col items-center justify-center text-center transform hover:-translate-y-1 active:scale-95 ${filterType === stat.id
              ? "bg-primary-50 border-primary-500 ring-2 ring-primary-100 ring-offset-2 shadow-md"
              : "bg-white border-gray-100 hover:border-primary-500 hover:shadow-md"
              }`}
          >
            <p className="text-gray-400 text-[9px] font-black uppercase mb-1">
              {stat.title}
            </p>
            <h3 className={`text-xl font-black ${filterType === stat.id ? 'text-primary-600' : 'text-gray-800'}`}>
              {stat.count}
            </h3>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-100 font-medium text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              onClick={() => {
                setEditingFacility(null);
                setIsFormOpen(true);
              }}
              className="!bg-secondary-600 hover:!bg-secondary-700 text-white font-black py-2.5 px-6 rounded-xl shadow-lg shadow-secondary-100 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Plus size={18} /> THÊM MỚI
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">Cơ sở y tế</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Liên hệ</th>
                <th className="px-6 py-4">Vị trí</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2
                      size={40}
                      className="animate-spin text-primary-600 mx-auto mb-4"
                    />
                    <p className="text-gray-400 font-bold uppercase text-[10px]">
                      Đang tải dữ liệu...
                    </p>
                  </td>
                </tr>
              ) : paginatedFacilities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                    Không tìm thấy cơ sở y tế nào.
                  </td>
                </tr>
              ) : (
                paginatedFacilities.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <h4 className="font-bold text-gray-800 text-sm">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                          <MapPin size={12} /> {item.address}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex w-fit px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-100 uppercase">
                          {FACILITY_TYPES.find((t) => t.id === item.type)?.title ||
                            item.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start text-[11px] text-gray-600">
                        {item.phone && (
                          <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                            <Phone size={12} className="text-gray-400" />
                            {item.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-[10px] text-gray-500 font-mono">
                        <span>Lat: {item.latitude?.toFixed(4)}</span>
                        <span>Lng: {item.longitude?.toFixed(4)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          icon={<Edit3 size={18} />}
                          text
                          rounded
                          onClick={() => {
                            setEditingFacility(item);
                            setIsFormOpen(true);
                          }}
                        />
                        <Button
                          icon={<Trash2 size={18} />}
                          text
                          rounded
                          severity="danger"
                          onClick={() => handleDelete(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
          <div className="text-sm text-gray-600">
            Hiển thị <span className="font-bold">{paginatedFacilities.length}</span> trên{" "}
            <span className="font-bold">{totalItems}</span> cơ sở
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                icon={<ChevronLeft size={16} />}
                label="Trước"
                text
                className="!text-xs"
              />
              <div className="px-4 py-1.5 text-xs font-black bg-white border border-gray-200 rounded-lg shadow-sm">
                {currentPage} / {totalPages}
              </div>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                icon={<ChevronRight size={16} />}
                label="Sau"
                iconPos="right"
                text
                className="!text-xs"
              />
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <FacilityForm
          initialData={editingFacility}
          onClose={() => setIsFormOpen(false)}
          onSave={() => {
            setIsFormOpen(false);
            fetchFacilities();
          }}
        />
      )}
    </AdminLayout>
  );
};

export default SocialFacilitiesManagement;
