import {Input} from "@shared/components/ui/input";
import {Label} from "@shared/components/ui/label";
import {Button} from "@shared/components/ui/button";
import {Checkbox} from "@shared/components/ui/checkbox";
import {useState, useEffect} from "react";
import {Eye, EyeOff, AlertCircle, Activity, Building, Shield, Users, Zap} from "lucide-react";
import {Link, useNavigate} from "@tanstack/react-router";
import {useAuthStore} from "@features/auth";

function Register() {
    const navigate = useNavigate();
    const {register, loading, error: authError, clearError} = useAuthStore();

    const [formData, setFormData] = useState({
        name: "", email: "", password: "", password_confirmation: "",
        phone: "", tenant_name: "", tenant_type: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => { return () => clearError(); }, [clearError]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        if (errors[e.target.name]) setErrors({...errors, [e.target.name]: null});
        if (authError) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        clearError();
        const newErrors = {};
        if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = "Kata sandi tidak cocok";
        if (formData.password.length < 8) newErrors.password = "Kata sandi minimal 8 karakter";
        if (!agreeTerms) newErrors.terms = "Anda harus menyetujui syarat dan ketentuan";
        if (!formData.tenant_type) newErrors.tenant_type = "Jenis klinik harus dipilih";
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        const result = await register(formData);
        if (result.success) navigate('/dashboard');
    };

    const fields = [
        {id: "name", label: "Nama Lengkap", type: "text", placeholder: "Dr. John Doe"},
        {id: "email", label: "Email", type: "email", placeholder: "nama@klinik.com"},
        {id: "phone", label: "Nomor Telepon", type: "tel", placeholder: "08123456789"},
        {id: "tenant_name", label: "Nama Klinik", type: "text", placeholder: "Klinik Sehat Sejahtera"},
    ];

    const inputClass = (fieldId) =>
        `h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500 dark:bg-slate-900
         [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] dark:[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(15,23,42)]
         [&:-webkit-autofill]:[-webkit-text-fill-color:inherit]
         ${errors[fieldId] ? 'border-red-400' : ''}`;

    return (
        <div className="min-h-screen flex">
            {/* Left - Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white dark:bg-slate-950 overflow-y-auto">
                <div className="lg:hidden flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white"/>
                    </div>
                    <span className="font-semibold text-lg">Zyntera</span>
                </div>

                <div className="w-full max-w-sm">
                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1.5">Buat akun baru</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Daftarkan klinik Anda ke Zyntera</p>
                    </div>

                    {authError && (
                        <div className="mb-5 flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"/>
                            <span>{typeof authError === 'string' ? authError : Object.values(authError).flat().join(", ")}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map(f => (
                            <div key={f.id} className="space-y-1.5">
                                <Label htmlFor={f.id} className="text-sm font-medium text-slate-700 dark:text-slate-300">{f.label}</Label>
                                <Input
                                    id={f.id} name={f.id} type={f.type} placeholder={f.placeholder}
                                    value={formData[f.id]} onChange={handleChange} required
                                    className={inputClass(f.id)}
                                />
                                {errors[f.id] && <p className="text-xs text-red-600 dark:text-red-400">{errors[f.id]}</p>}
                            </div>
                        ))}

                        {/* Jenis Klinik */}
                        <div className="space-y-1.5">
                            <Label htmlFor="tenant_type" className="text-sm font-medium text-slate-700 dark:text-slate-300">Jenis Klinik</Label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"/>
                                <select
                                    id="tenant_type" name="tenant_type" value={formData.tenant_type}
                                    onChange={handleChange} required
                                    className={`pl-9 w-full h-10 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-0 appearance-none transition-colors ${errors.tenant_type ? 'border-red-400' : ''}`}
                                >
                                    <option value="">Pilih Jenis Klinik</option>
                                    <option value="rs">Rumah Sakit</option>
                                    <option value="klinik">Klinik</option>
                                    <option value="beauty_clinic">Klinik Kecantikan</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                                </svg>
                            </div>
                            {errors.tenant_type && <p className="text-xs text-red-600 dark:text-red-400">{errors.tenant_type}</p>}
                        </div>

                        {/* Password fields */}
                        {[
                            {id: "password", label: "Kata Sandi", show: showPassword, toggle: () => setShowPassword(!showPassword), placeholder: "Minimal 8 karakter"},
                            {id: "password_confirmation", label: "Konfirmasi Kata Sandi", show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword), placeholder: "Masukkan ulang kata sandi"},
                        ].map(f => (
                            <div key={f.id} className="space-y-1.5">
                                <Label htmlFor={f.id} className="text-sm font-medium text-slate-700 dark:text-slate-300">{f.label}</Label>
                                <div className="relative">
                                    <Input
                                        id={f.id} name={f.id}
                                        type={f.show ? "text" : "password"}
                                        placeholder={f.placeholder}
                                        value={formData[f.id]}
                                        onChange={handleChange} required
                                        className={`h-10 pr-10 border-slate-200 dark:border-slate-700 focus-visible:ring-teal-500 dark:bg-slate-900 ${errors[f.id] ? 'border-red-400' : ''}`}
                                    />
                                    <button type="button" onClick={f.toggle}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {f.show ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                                    </button>
                                </div>
                                {errors[f.id] && <p className="text-xs text-red-600 dark:text-red-400">{errors[f.id]}</p>}
                            </div>
                        ))}

                        {/* Terms — fix layout berantakan */}
                        <div className="space-y-1">
                            <div className="flex items-start gap-2.5">
                                <Checkbox
                                    id="terms"
                                    checked={agreeTerms}
                                    onCheckedChange={setAgreeTerms}
                                    className="mt-0.5 shrink-0 border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                />
                                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer leading-relaxed select-none">
                                    Saya menyetujui{" "}
                                    <a href="#" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">Syarat dan Ketentuan</a>
                                    {" "}serta{" "}
                                    <a href="#" className="text-teal-600 hover:text-teal-700 font-medium hover:underline">Kebijakan Privasi</a>
                                </label>
                            </div>
                            {errors.terms && (
                                <p className="text-xs text-red-600 dark:text-red-400 ml-7">{errors.terms}</p>
                            )}
                        </div>

                        <Button
                            onClick={handleSubmit} disabled={loading}
                            className="w-full h-10 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
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

            {/* Right - Branding */}
            <div className="hidden lg:flex lg:w-[40%] bg-slate-900 flex-col p-12 relative overflow-hidden">
                {/* Grid background */}
                <div className="absolute inset-0 opacity-[0.04]"
                     style={{
                         backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                         backgroundSize: '40px 40px'
                     }}
                />
                <div className="absolute top-1/4 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"/>
                <div className="absolute bottom-1/3 -left-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"/>

                {/* Logo — top */}
                <div className="relative z-10 flex items-center gap-3 mb-auto">
                    <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white"/>
                    </div>
                    <span className="text-white font-semibold text-xl tracking-tight">Zyntera</span>
                </div>

                {/* Center content — vertically centered */}
                <div className="relative z-10 space-y-8 my-auto">
                    <div>
                        <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">Bergabunglah sekarang</p>
                        <h2 className="text-white text-3xl font-bold leading-tight mb-3">
                            Mulai perjalanan digital<br/>klinik Anda hari ini
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Ribuan tenaga medis telah mempercayai Zyntera untuk mengelola operasional klinik mereka.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {Icon: Shield, title: "Keamanan Terjamin", desc: "Data pasien dienkripsi dengan standar enterprise"},
                            {Icon: Users, title: "Kolaborasi Tim", desc: "Kelola seluruh staf medis dari satu platform"},
                            {Icon: Zap, title: "Akses Real-time", desc: "Data pasien tersinkronisasi secara langsung"},
                        ].map(({Icon, title, desc}) => (
                            <div key={title} className="flex items-start gap-3.5">
                                <div className="flex-shrink-0 w-9 h-9 bg-teal-500/15 rounded-xl flex items-center justify-center border border-teal-500/20">
                                    <Icon className="w-4 h-4 text-teal-400"/>
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{title}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer — bottom */}
                <p className="relative z-10 text-slate-600 text-xs mt-auto">© 2025 Zyntera. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Register;