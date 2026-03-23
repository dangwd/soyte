import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck, Lock, XCircle } from "lucide-react";
import { Button } from "@/components/prime";

const ConfirmPassword: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 6;
    const hasUpper = /[A-Z]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const noSpace = !/\s/.test(pass);
    
    return {
      minLength,
      hasUpper,
      hasSpecial,
      noSpace,
      isValid: minLength && hasUpper && hasSpecial && noSpace
    };
  };

  const validation = validatePassword(password);
  const passwordsMatch = password && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) return;
    if (!passwordsMatch) return;

    setIsLoading(true);
    try {
      // Simulate API call to set password
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e7eb] flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-6 transition group"
        >
          <ArrowLeft
            size={16}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />
          Quay lại đăng nhập
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-[#0066a2] p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full p-0.5 shadow-lg flex items-center justify-center overflow-hidden border-2 border-white">
                <img
                  src="https://storage-vnportal.vnpt.vn/gov-hni/6749/soyte.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-white uppercase tracking-tight">
                Xác nhận mật khẩu
              </h1>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-2 bg-white/10 py-1 px-3 rounded-full inline-block">
                Người dùng: {username}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {success ? (
              <div className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center space-y-3 animate-in zoom-in-95 duration-300">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-green-800 font-bold">Thành công!</h3>
                  <p className="text-green-600 text-xs">Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển hướng đến trang đăng nhập...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Lock size={12} /> Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full p-4 bg-gray-50 border ${password && !validation.isValid ? 'border-red-200' : 'border-gray-200'} rounded-2xl outline-none focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all text-sm font-bold`}
                        placeholder="Nhập mật khẩu mới"
                      />
                      <Button
                        type="button"
                        icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        text
                        rounded
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 !text-gray-400 hover:!text-primary-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <CheckCircle2 size={12} /> Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full p-4 bg-gray-50 border ${confirmPassword && !passwordsMatch ? 'border-red-200' : 'border-gray-200'} rounded-2xl outline-none focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all text-sm font-bold`}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <Button
                        type="button"
                        icon={showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        text
                        rounded
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 !text-gray-400 hover:!text-primary-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Điều kiện mật khẩu:</p>
                   <ValidationItem label="Ít nhất 6 ký tự" isValid={validation.minLength} hasInput={!!password} />
                   <ValidationItem label="Ít nhất 1 chữ cái in hoa" isValid={validation.hasUpper} hasInput={!!password} />
                   <ValidationItem label="Ít nhất 1 ký tự đặc biệt" isValid={validation.hasSpecial} hasInput={!!password} />
                   <ValidationItem label="Không chứa khoảng trắng" isValid={validation.noSpace} hasInput={!!password} />
                   <ValidationItem label="Mật khẩu xác nhận phải khớp" isValid={passwordsMatch} hasInput={!!confirmPassword} />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !validation.isValid || !passwordsMatch}
                  loading={isLoading}
                  label="XÁC NHẬN MẬT KHẨU"
                  className="w-full py-4 !bg-[#0088cc] !text-white font-black rounded-2xl shadow-xl shadow-primary-100 hover:!bg-[#0077bb] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                />
              </>
            )}
          </form>

          <footer className="bg-gray-50/50 p-6 text-center border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
              Bảo mật tài khoản là ưu tiên hàng đầu
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

const ValidationItem: React.FC<{ label: string; isValid: boolean; hasInput: boolean }> = ({ label, isValid, hasInput }) => {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold">
      {hasInput ? (
        isValid ? (
          <CheckCircle2 size={14} className="text-green-500" />
        ) : (
          <XCircle size={14} className="text-red-400" />
        )
      ) : (
        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200"></div>
      )}
      <span className={hasInput ? (isValid ? "text-green-700" : "text-red-600") : "text-gray-500"}>
        {label}
      </span>
    </div>
  );
};

export default ConfirmPassword;
