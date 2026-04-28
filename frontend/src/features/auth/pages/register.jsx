import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@shared/components/ui/input";
import { Button } from "@shared/components/ui/button";
import { Checkbox } from "@shared/components/ui/checkbox";
import { Label } from "@shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { Eye, EyeOff, AlertCircle, Activity, Building, Shield, Users, Zap } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@features/auth";

const DEFAULT_VALUES = {
    name: "", email: "", phone: "", tenant_name: "",
    tenant_type: "", password: "", password_confirmation: "", terms: false,
};

function Register() {
    const navigate = useNavigate();
    const { register, loading, error: authError, clearError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register: rhfRegister, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm({
        mode: "all",
        reValidateMode: "onChange",
        defaultValues: DEFAULT_VALUES,
    });

    useEffect(() => { return () => clearError(); }, [clearError]);

    const onSubmit = async (data) => {
        clearError();
        const result = await register(data);
        if (result.success) navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex">
            {/* Left - Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-slate-950 overflow-y-auto">
                <div className="lg:hidden flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-lg">Zyntera</span>
                </div>

                <div className="w-full max-w-xl">
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">Buat akun baru</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Daftarkan klinik Anda ke Zyntera</p>
                    </div>

                    {authError && (
                        <div className="mb-5 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{typeof authError === "string" ? authError : Object.values(authError).flat().join(", ")}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Nama */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap <span className="text-destructive">*</span></Label>
                                <Input id="name" placeholder="Dr. John Doe"
                                       {...rhfRegister("name", { required: "Nama lengkap wajib diisi" })} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                                <Input id="email" type="email" placeholder="nama@klinik.com"
                                       {...rhfRegister("email", {
                                           required: "Email wajib diisi",
                                           pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Format email tidak valid" }
                                       })} />
                                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                            </div>

                            {/* Telepon */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Nomor Telepon <span className="text-destructive">*</span></Label>
                                <Input id="phone" type="tel" placeholder="08123456789"
                                       {...rhfRegister("phone", { required: "Nomor telepon wajib diisi" })} />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                            </div>

                            {/* Nama Klinik */}
                            <div className="space-y-2">
                                <Label htmlFor="tenant_name">Nama Klinik <span className="text-destructive">*</span></Label>
                                <Input id="tenant_name" placeholder="Klinik Sehat Sejahtera"
                                       {...rhfRegister("tenant_name", { required: "Nama klinik wajib diisi" })} />
                                {errors.tenant_name && <p className="text-sm text-destructive">{errors.tenant_name.message}</p>}
                            </div>

                            {/* Jenis Klinik */}
                            <div className="space-y-2">
                                <Label>Jenis Klinik <span className="text-destructive">*</span></Label>
                                <Controller
                                    name="tenant_type"
                                    control={control}
                                    rules={{ required: "Jenis klinik harus dipilih" }}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <Building className="w-4 h-4 text-slate-400 mr-2" />
                                                <SelectValue placeholder="Pilih Jenis Klinik" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="rs">Rumah Sakit</SelectItem>
                                                <SelectItem value="klinik">Klinik</SelectItem>
                                                <SelectItem value="beauty_clinic">Klinik Kecantikan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.tenant_type && <p className="text-sm text-destructive">{errors.tenant_type.message}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Kata Sandi <span className="text-destructive">*</span></Label>
                                <div className="relative">
                                    <Input id="password" type={showPassword ? "text" : "password"}
                                           placeholder="Minimal 8 karakter" className="pr-10"
                                           {...rhfRegister("password", {
                                               required: "Kata sandi wajib diisi",
                                               minLength: { value: 8, message: "Kata sandi minimal 8 karakter" }
                                           })} />
                                    <button type="button" onClick={() => setShowPassword(s => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                            </div>

                            {/* Konfirmasi Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi <span className="text-destructive">*</span></Label>
                                <div className="relative">
                                    <Input id="password_confirmation" type={showConfirmPassword ? "text" : "password"}
                                           placeholder="Masukkan ulang kata sandi" className="pr-10"
                                           {...rhfRegister("password_confirmation", {
                                               required: "Konfirmasi kata sandi wajib diisi",
                                               validate: val => val === watch("password") || "Kata sandi tidak cocok"
                                           })} />
                                    <button type="button" onClick={() => setShowConfirmPassword(s => !s)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>}
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="space-y-1">
                            <div className="flex items-start gap-2.5">
                                <Controller
                                    name="terms"
                                    control={control}
                                    rules={{ validate: v => v || "Anda harus menyetujui syarat dan ketentuan" }}
                                    render={({ field }) => (
                                        <Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange}
                                                  className="mt-0.5 shrink-0 border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600" />
                                    )}
                                />
                                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer leading-relaxed select-none">
                                    Saya menyetujui{" "}
                                    <a href="#" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">Syarat dan Ketentuan</a>
                                    {" "}serta{" "}
                                    <a href="#" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">Kebijakan Privasi</a>
                                </label>
                            </div>
                            {errors.terms && <p className="text-sm text-destructive ml-7">{errors.terms.message}</p>}
                        </div>

                        <Button type="submit" disabled={isSubmitting || loading}
                                className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                            {(isSubmitting || loading) ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Mendaftar...
                                </span>
                            ) : "Daftar Sekarang"}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Sudah punya akun?{" "}
                        <Link to="/auth/login" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium">
                            Masuk sekarang
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right - Branding (unchanged) */}
            <div className="hidden lg:flex lg:w-[40%] bg-slate-900 flex-col p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div className="absolute top-1/4 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/3 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3 mb-auto">
                    <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-semibold text-xl tracking-tight">Zyntera</span>
                </div>

                <div className="relative z-10 space-y-8 my-auto">
                    <div>
                        <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">Bergabunglah sekarang</p>
                        <h2 className="text-white text-3xl font-bold leading-tight mb-3">Mulai perjalanan digital<br />klinik Anda hari ini</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">Ribuan tenaga medis telah mempercayai Zyntera untuk mengelola operasional klinik mereka.</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { Icon: Shield, title: "Keamanan Terjamin", desc: "Data pasien dienkripsi dengan standar enterprise" },
                            { Icon: Users, title: "Kolaborasi Tim", desc: "Kelola seluruh staf medis dari satu platform" },
                            { Icon: Zap, title: "Akses Real-time", desc: "Data pasien tersinkronisasi secara langsung" },
                        ].map(({ Icon, title, desc }) => (
                            <div key={title} className="flex items-start gap-3.5">
                                <div className="shrink-0 w-9 h-9 bg-teal-500/15 rounded-xl flex items-center justify-center border border-teal-500/20">
                                    <Icon className="w-4 h-4 text-teal-400" />
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{title}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="relative z-10 text-slate-600 text-xs mt-auto">© 2025 Zyntera. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Register;