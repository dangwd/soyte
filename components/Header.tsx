import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Phone,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import { MAIN_MENU } from "../constants";
import { useAuth } from "../AuthContext";
import { Button } from "@/components/prime";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime] = useState(new Date());
  const { user, logout } = useAuth(); // Use the context

  const location = useLocation();

  useEffect(() => {
    // const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // return () => {
    //   clearInterval(timer);
    // };
  }, []);

  const getFormattedDateTime = (date: Date) => {
    const days = [
      "Chủ nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    return `${days[date.getDay()]}, ${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.toLocaleTimeString("vi-VN")}`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md font-sans">
      {/* Top Bar */}
      <div className="bg-primary-700 text-white py-2 text-[11px] md:text-xs border-b border-primary-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-medium text-primary-100 hidden md:inline-block">
              {getFormattedDateTime(currentTime)}
            </span>
            <span className="opacity-30 hidden md:inline-block">|</span>
            <span className="flex items-center font-bold text-white hover:text-yellow-300 transition-colors cursor-pointer text-[10px] md:text-xs">
              <Phone size={14} className="mr-1.5 animate-pulse" />
              ĐƯỜNG DÂY NÓNG SỞ Y TẾ: 02439985765/ 0967981616
            </span>
          </div>
          <div className="flex items-center space-x-3 md:space-x-4 font-medium">
            {user ? (
              <div className="relative flex items-center gap-3">
                <span className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded text-secondary-300">
                  <User size={12} /> {user.full_name || "Quản trị viên"}
                </span>
                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-1 bg-secondary-500 hover:bg-secondary-600 px-2.5 py-1 rounded font-bold text-white transition-all shadow-lg text-[10px] md:text-xs"
                  >
                    <LayoutDashboard size={14} /> QUẢN TRỊ
                  </Link>
                )}
                <Button
                  onClick={logout}
                  label="Thoát"
                  icon="pi pi-sign-out"
                  iconPos="left"
                  className="p-0 text-[10px] md:text-xs hover:text-red-300 transition"
                  text
                />
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200 transition">
                  Đăng nhập cán bộ
                </Link>
                <span className="opacity-30">|</span>
                <Link
                  to="/citizen"
                  className="hover:text-primary-200 transition"
                >
                  Cổng công dân
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
 
      <div className="bg-white py-6 md:py-8 shadow-sm relative z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-4 group">
              <img
                src="https://storage-vnportal.vnpt.vn/gov-hni/6749/soyte.png"
                alt="Logo Sở Y Tế"
                className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <h2 className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:block">
                  TRANG THÔNG TIN ĐIỆN TỬ CHUYÊN NGÀNH Y TẾ
                </h2>
                <h1 className="text-xl md:text-3xl font-black text-[#d32f2f] uppercase leading-none py-1 group-hover:text-red-700 transition-colors">
                  SỨC KHỎE THỦ ĐÔ
                </h1>
                <p className="text-[11px] md:text-sm text-primary-800 font-bold italic">
                  Kết nối thông tin, bảo vệ sức khỏe cộng đồng
                </p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center flex-1 max-w-sm justify-end">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Tìm kiếm thông tin..."
                  className="w-full pl-5 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all text-sm"
                />
                <Button
                  className="absolute right-1 top-1 bottom-1 px-4 bg-primary-600 text-white rounded-full hover:bg-primary-700"
                  aria-label="Search"
                >
                  <Search size={16} />
                </Button>
              </div>
            </div>

            <Button
              className="lg:hidden absolute top-4 right-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              text
              rounded
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } lg:block bg-gradient-to-r from-primary-800 to-primary-900 text-white transition-all duration-300 shadow-lg border-t border-primary-600`}
      >
        <div className="container mx-auto px-4">
          <ul className="flex flex-col lg:flex-row lg:items-center justify-between py-2 lg:py-0">
            {MAIN_MENU.map((item) => {
              const isActive =
                location.pathname.startsWith(item.path) && item.path !== "/";
              const isHomeActive =
                item.path === "/" && location.pathname === "/";
              const hasChildren = item.children && item.children.length > 0;

              return (
                <li
                  key={item.id}
                  className="relative group lg:static xl:relative"
                >
                  {hasChildren ? (
                    <>
                      <div
                        className={`
                                flex items-center justify-between cursor-pointer px-3 py-3.5 text-[13px] uppercase font-bold border-b-4 border-transparent hover:bg-white/10 hover:border-secondary-400 transition-all
                                ${
                                  isActive || isHomeActive
                                    ? "bg-white/10 border-secondary-500 text-secondary-300"
                                    : "text-gray-100"
                                }
                            `}
                      >
                        <Link
                          to={item.path}
                          className="flex-grow tracking-wide"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                        <ChevronDown
                          size={14}
                          className="ml-1 lg:block hidden group-hover:rotate-180 transition-transform duration-200 opacity-70"
                        />
                      </div>

                      <div className="hidden lg:group-hover:block absolute left-0 top-full bg-white shadow-2xl rounded-b-lg w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-200 border-t-4 border-secondary-500 ring-1 ring-black/5">
                        <ul className="py-2">
                          {item.children?.map((child:any) => (
                            <li key={child.id}>
                              <Link
                                to={!child.linkUrl ? child.path : child.linkUrl}
                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 border-l-4 border-transparent hover:border-primary-500 transition-all"
                              >
                                {child.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block px-3 py-3.5 text-[13px] uppercase font-bold border-b-4 border-transparent hover:bg-white/10 hover:border-secondary-400 transition-all tracking-wide
                        ${
                          isActive || isHomeActive
                            ? "bg-white/10 border-secondary-500 text-secondary-300"
                            : "text-gray-100"
                        }
                        `}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
