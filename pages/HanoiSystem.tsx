import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Phone,
  Navigation,
  Activity,
  Info,
  X,
  HeartPulse,
  Users,
  Building,
  Home as HomeIcon,
  ChevronLeft,
  Ambulance,
  Hospital,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/prime";
import { ALL_FACILITIES } from "@/constants";

// Fix for default Leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const HANOI_CENTER: [number, number] = [21.0285, 105.8542];
const HANOI_BOUNDS: L.LatLngBoundsExpression = [
  [20.53, 105.28],
  [21.39, 106.02],
];

const createCustomIcon = (type: string, isSelected: boolean = false) => {
  let colorClass = "bg-gray-500";
  if (type === "BV") colorClass = "bg-red-600";
  if (type === "TT") colorClass = "bg-blue-600";
  if (type === "BT") colorClass = "bg-emerald-600";
  if (type === "PB") colorClass = "bg-violet-600";
  if (type === "CC") colorClass = "bg-amber-600";
  if (type === "TYT") colorClass = "bg-cyan-600";

  const size = isSelected ? "w-10 h-10" : "w-7 h-7";
  const ring = isSelected
    ? "ring-4 ring-white shadow-[0_0_20px_rgba(0,0,0,0.4)]"
    : "border-2 border-white shadow-lg";
  const zIndex = isSelected ? "z-[1000]" : "z-10";

  return L.divIcon({
    className: `custom-map-marker ${zIndex}`,
    html: `<div class="${colorClass} ${size} ${ring} rounded-full flex items-center justify-center transition-all duration-300 ease-in-out">
            <div class="w-1.5 h-1.5 bg-white rounded-full ${
              isSelected ? "animate-ping" : ""
            }"></div>
           </div>`,
    // iconSize: [20, 20],
    // iconAnchor: [10, 10],
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41], // [Nửa chiều rộng, Toàn bộ chiều cao] -> Trỏ đúng điểm nhọn
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

interface Facility {
  id: string;
  name: string;
  type: "BV" | "TT" | "BT" | "PB" | "CC" | "TYT";
  address: string;
  phone: string;
  coords: [number, number];
  description: string;
  category: string;
}

const MapEventHandler = ({ coords }: { coords: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 500);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (coords) map.flyTo(coords, 16, { duration: 1.5 });
  }, [coords, map]);

  return null;
};

const HanoiSystem = () => {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(
    null,
  );
  const [filterType, setFilterType] = useState<
    "ALL" | "BV" | "TT" | "BT" | "PB"
  >("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFacilities = useMemo(() => {
    return ALL_FACILITIES.filter((item) => {
      const matchType = filterType === "ALL" || item.type === filterType;
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });
  }, [filterType, searchTerm]);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "BV":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          label: "Bệnh viện",
          icon: <HeartPulse size={14} />,
        };
      case "TT":
        return {
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
          label: "TT Chuyên khoa",
          icon: <Activity size={14} />,
        };
      case "BT":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          label: "Cơ sở Trợ giúp",
          icon: <Users size={14} />,
        };
      case "PB":
        return {
          color: "text-violet-600",
          bg: "bg-violet-50",
          border: "border-violet-200",
          label: "Phòng/Chi cục",
          icon: <Building size={14} />,
        };
      case "CC":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          label: "Cơ sở chuyên môn",
          icon: <Ambulance size={14} />,
        };
      case "TYT":
        return {
          color: "text-cyan-600",
          bg: "bg-cyan-50",
          border: "border-cyan-200",
          label: "Trạm Y tế",
          icon: <Hospital size={14} />,
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          label: "Khác",
          icon: <Info size={14} />,
        };
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Header Section with Back Button */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm z-20">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1 text-primary-700 hover:text-primary-800 font-bold bg-primary-50 px-3 py-1.5 rounded-lg border border-primary-100 transition-all group"
          >
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <HomeIcon size={16} />
            <span className="hidden md:inline">Trang chủ</span>
          </Link>
          <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
          <div className="flex items-center gap-3">
            <div className="bg-primary-700 p-1.5 rounded-lg text-white shadow-lg hidden sm:block">
              <MapPin size={20} />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-black text-primary-900 uppercase leading-tight">
                Mạng lưới Y tế Hà Nội
              </h1>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                Dữ liệu địa điểm 68 cơ sở y tế trực thuộc
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden relative">
        {/* SIDEBAR */}
        <div className="w-full md:w-[420px] bg-white border-r border-gray-200 flex flex-col z-30 absolute md:relative h-full transition-transform">
          <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc địa chỉ..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-100 outline-none text-xs font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "ALL", label: "Tất cả" },
                { id: "CC", label: "Chi cục" },
                { id: "TYT", label: "Trạm Y Tế" },
                { id: "BV", label: "Bệnh viện" },
                { id: "TT", label: "Trung tâm" },
                { id: "BT", label: "Trợ giúp" },
              ].map((btn) => (
                <Button
                  key={btn.id}
                  label={btn.label}
                  onClick={() => setFilterType(btn.id as any)}
                  className={`p-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all whitespace-nowrap
                        ${
                          filterType === btn.id
                            ? "!bg-primary-900 !text-white !border-primary-900 shadow-md"
                            : "!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-100"
                        }`}
                />
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto no-scrollbar bg-white">
            {filteredFacilities.map((fac) => {
              const style = getTypeStyle(fac.type);
              return (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac as Facility)}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-primary-50 transition-all flex gap-4 ${
                    selectedFacility?.id === fac.id
                      ? "bg-primary-50 border-l-4 border-l-primary-600"
                      : "border-l-4 border-l-transparent"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
                      selectedFacility?.id === fac.id
                        ? "scale-110 shadow-lg"
                        : ""
                    } ${style.bg} ${style.color}`}
                  >
                    {style.icon}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-[13px] font-black text-gray-800 leading-tight mb-1">
                      {fac.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mb-2 italic leading-tight">
                      {fac.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-block text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-tighter border ${style.color} ${style.border} ${style.bg}`}
                      >
                        {fac.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAP CONTAINER */}
        <div className="flex-grow relative bg-slate-200 overflow-hidden h-full z-10">
          <MapContainer
            center={HANOI_CENTER}
            zoom={13}
            minZoom={10}
            maxZoom={18}
            maxBounds={HANOI_BOUNDS}
            maxBoundsViscosity={1.0}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapEventHandler coords={selectedFacility?.coords || null} />
            {filteredFacilities.map((fac: any) => (
              <Marker
                key={fac.id}
                position={fac.coords}
                icon={createCustomIcon(
                  fac.type,
                  selectedFacility?.id === fac.id,
                )}
                eventHandlers={{ click: () => setSelectedFacility(fac) }}
              />
            ))}
          </MapContainer>

          {/* FLOATING DETAIL PANEL */}
          {selectedFacility && (
            <div className="absolute bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-[1000] animate-in slide-in-from-bottom-5 border border-gray-100 ring-4 ring-primary-900/10">
              <div className="bg-primary-900 p-4 text-white">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded">
                    {selectedFacility.category}
                  </span>
                  <Button
                    icon={<X size={16} />}
                    text
                    rounded
                    onClick={() => setSelectedFacility(null)}
                    className="!text-white hover:!bg-white/20"
                  />
                </div>
                <h2 className="text-lg font-black mt-2 leading-tight uppercase">
                  {selectedFacility.name}
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-4 text-[13px] text-gray-700">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={18}
                      className="text-red-600 shrink-0 mt-0.5"
                    />
                    <p className="font-bold leading-tight text-gray-900">
                      {selectedFacility.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-primary-600 shrink-0" />
                    <span className="font-black text-primary-900 text-base">
                      {selectedFacility.phone}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    label="Chỉ đường"
                    icon={<Navigation size={16} />}
                    className="!bg-primary-700 hover:!bg-primary-800 !text-white px-2 py-1"
                  />
                  <Button
                    label="Gọi điện"
                    icon={<Phone size={16} />}
                    outlined
                    className="!border-gray-200 hover:!border-primary-600 !text-gray-700"
                    onClick={() =>
                      (window.location.href = `tel:${selectedFacility.phone}`)
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HanoiSystem;
