import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {useEffect, useState} from "react";
import {Link, useNavigate} from '@tanstack/react-router'
import {useAuthStore} from "@/store/authStore.js";
import {Eye, EyeOff, AlertCircle, Activity} from "lucide-react";

function Login() {
    const {login, loading, error, loggedIn} = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        await login(email, password);
    }

    useEffect(() => {
        if (loggedIn) {
            navigate("/dashboard");
        }
    }, [loggedIn, navigate]);

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-[45%] bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]"
                     style={{
                         backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                         backgroundSize: '40px 40px'
                     }}
                />
                <div className="absolute top-1/3 -left-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"/>
                <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"/>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white"/>
                    </div>
                    <span className="text-white font-semibold text-xl tracking-tight">Zyntera</span>
                </div>

                <div className="relative z-10 space-y-6">
                    <div>
                        <p className="text-teal-400 text-sm font-medium uppercase tracking-widest mb-3">Platform Klinik Digital</p>
                        <h2 className="text-white text-4xl font-bold leading-tight">
                            Kelola klinik Anda<br/>
                            <span className="text-teal-400">lebih efisien.</span>
                        </h2>
                    </div>
                    <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                        Sistem manajemen klinik terpadu untuk rawat jalan, rawat inap, rekam medis, dan farmasi.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {[
                            {value: "1.200+", label: "Pasien Aktif"},
                            {value: "98%", label: "Uptime SLA"},
                            {value: "50+", label: "Klinik Partner"},
                            {value: "24/7", label: "Dukungan"},
                        ].map(stat => (
                            <div key={stat.label} className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                                <p className="text-white font-bold text-xl">{stat.value}</p>
                                <p className="text-slate-400 text-xs mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-slate-600 text-sm">© 2025 Zyntera. All rights reserved.</p>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-slate-950">
                <div className="lg:hidden flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white"/>
                    </div>
                    <span className="font-semibold text-lg text-slate-900 dark:text-white">Zyntera</span>
                </div>

                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">Selamat datang kembali</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Masuk ke akun Zyntera Anda</p>
                    </div>

                    {error && typeof error === 'string' && (
                        <div className="mb-5 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nama@klinik.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500 dark:bg-slate-900"
                            />
                            {error?.email && (
                                <p className="text-xs text-red-600 dark:text-red-400">{error.email[0]}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Kata Sandi
                                </Label>
                                <button type="button" className="text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium">
                                    Lupa kata sandi?
                                </button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan kata sandi"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-10 pr-10 border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500 dark:bg-slate-900"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                </button>
                            </div>
                            {error?.password && (
                                <p className="text-xs text-red-600 dark:text-red-400">{error.password[0]}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={setRememberMe}
                                className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                            />
                            <Label htmlFor="remember" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer font-normal">
                                Ingat saya selama 30 hari
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm transition-colors mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Memuat...
                                </span>
                            ) : "Masuk"}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Belum punya akun?{" "}
                        <Link to="/auth/register" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;