import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Checkbox} from "@/components/ui/checkbox";
import {useState, useEffect} from "react";
import {Eye, EyeOff, Headset, Shield, Users, Zap, Building} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {useAuthStore} from "@/store/authStore"; // Import the auth store

function Register() {
    const navigate = useNavigate(); // For navigation after successful registration
    const {register, loading, error: authError, clearError} = useAuthStore(); // Get auth store methods and state

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        tenant_name: "",
        tenant_type: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [errors, setErrors] = useState({});

    // Clear auth errors when component unmounts or when form data changes
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear errors when user starts typing
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: null});
        }
        // Clear auth errors when user changes form data
        if (authError) {
            clearError();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Clear any previous auth errors
        clearError();

        // Validate form
        const newErrors = {};
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Kata sandi tidak cocok";
        }
        if (formData.password.length < 8) {
            newErrors.password = "Kata sandi minimal 8 karakter";
        }
        if (!agreeTerms) {
            newErrors.terms = "Anda harus menyetujui syarat dan ketentuan";
        }
        if (!formData.tenant_type) {
            newErrors.tenant_type = "Jenis klinik harus dipilih";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const result = await register(formData);

        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-between">
            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-6xl">
                    <div
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden md:flex transform transition-all duration-500 hover:shadow-3xl">
                        {/* Form Section */}
                        <div
                            className="md:w-1/2 p-8 sm:p-12 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 max-h-[90vh] overflow-y-auto">
                            <Card className="border-0 shadow-none bg-transparent">
                                <CardContent className="px-0 space-y-6">
                                    {/* Display auth errors if any */}
                                    {authError && (
                                        <div
                                            className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                            {typeof authError === 'string' ? authError :
                                                Object.entries(authError).map(([key, value]) => (
                                                    <div key={key}>{value}</div>
                                                ))
                                            }
                                        </div>
                                    )}

                                    <div className="space-y-5">
                                        {/* Name Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'name' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="name"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">
                                                Nama Lengkap
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    placeholder="Dr. John Doe"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('name')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className={`pl-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300 ${errors.name ? 'border-red-500' : ''}`}
                                                />
                                                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                </svg>
                                            </div>
                                            {errors.name && (
                                                <p className="text-xs text-red-600 dark:text-red-400">{errors.name}</p>
                                            )}
                                        </div>

                                        {/* Email Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'email' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="email"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">
                                                Email
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="nama@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className={`pl-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
                                                />
                                                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                                </svg>
                                            </div>
                                            {errors.email && (
                                                <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>
                                            )}
                                        </div>

                                        {/* Phone Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'phone' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="phone"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">
                                                Nomor Telepon
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="08123456789"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('phone')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className={`pl-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300 ${errors.phone ? 'border-red-500' : ''}`}
                                                />
                                                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                                </svg>
                                            </div>
                                            {errors.phone && (
                                                <p className="text-xs text-red-600 dark:text-red-400">{errors.phone}</p>
                                            )}
                                        </div>

                                        {/* Clinic Name Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'tenant_name' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="tenant_name"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">
                                                Nama Klinik
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="tenant_name"
                                                    name="tenant_name"
                                                    type="text"
                                                    placeholder="Klinik Sehat Sejahtera"
                                                    value={formData.tenant_name}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('tenant_name')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className={`pl-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300 ${errors.tenant_name ? 'border-red-500' : ''}`}
                                                />
                                                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                                </svg>
                                            </div>
                                            {errors.tenant_name && (
                                                <p className="text-xs text-red-600 dark:text-red-400">{errors.tenant_name}</p>
                                            )}
                                        </div>

                                        {/* Clinic Type Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'tenant_type' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="tenant_type"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">
                                                Jenis Klinik
                                            </Label>
                                            <div className="relative">
                                                <select
                                                    id="tenant_type"
                                                    name="tenant_type"
                                                    value={formData.tenant_type}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('tenant_type')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className={`pl-10 pr-10 w-full h-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:border-teal-500 focus:ring-teal-500 transition-all duration-300 appearance-none ${errors.tenant_type ? 'border-red-500' : ''}`}
                                                >
                                                    <option value="">Pilih Jenis Klinik</option>
                                                    <option value="rs">Rumah Sakit</option>
                                                    <option value="klinik">Klinik</option>
                                                    <option value="beauty_clinic">Klinik Kecantikan</option>
                                                </select>
                                                <Building
                                                    className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none"/>
                                                <svg
                                                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none"
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M19 9l-7 7-7-7"/>
                                                </svg>
                                            </div>
                                            {errors.tenant_type && (
                                                <p className="text-xs text-red-600 dark:text-red-400">{errors.tenant_type}</p>
                                            )}
                                        </div>

                                        {/* Password Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="password"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">
                                                Kata Sandi
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Minimal 8 karakter"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className={`pl-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300 ${errors.password ? 'border-red-500' : ''}`}
                                                />
                                                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                </svg>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4"/> :
                                                        <Eye className="h-4 w-4"/>}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor"
                                                         viewBox="0 0 20 20">
                                                        <path fillRule="evenodd"
                                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        {/* Confirm Password Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'password_confirmation' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="password_confirmation"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">
                                                Konfirmasi Kata Sandi
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Masukkan ulang kata sandi"
                                                    value={formData.password_confirmation}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('password_confirmation')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className={`pl-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300 ${errors.password_confirmation ? 'border-red-500' : ''}`}
                                                />
                                                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                                </svg>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4"/> :
                                                        <Eye className="h-4 w-4"/>}
                                                </button>
                                            </div>
                                            {errors.password_confirmation && (
                                                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor"
                                                         viewBox="0 0 20 20">
                                                        <path fillRule="evenodd"
                                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                    {errors.password_confirmation}
                                                </p>
                                            )}
                                        </div>

                                        {/* Terms & Conditions */}
                                        <div className="space-y-2">
                                            <div className="flex items-start space-x-2">
                                                <Checkbox
                                                    id="terms"
                                                    checked={agreeTerms}
                                                    onCheckedChange={setAgreeTerms}
                                                    className="border-gray-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500 mt-1"
                                                />
                                                <Label htmlFor="terms"
                                                       className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-relaxed">
                                                    Saya menyetujui{" "}
                                                    <a href="#"
                                                       className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium">
                                                        Syarat dan Ketentuan
                                                    </a>
                                                    {" "}serta{" "}
                                                    <a href="#"
                                                       className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium">
                                                        Kebijakan Privasi
                                                    </a>
                                                </Label>
                                            </div>
                                            {errors.terms && (
                                                <p className="text-xs text-red-600 dark:text-red-400 flex items-center ml-6">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor"
                                                         viewBox="0 0 20 20">
                                                        <path fillRule="evenodd"
                                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                    {errors.terms}
                                                </p>
                                            )}
                                        </div>

                                        {/* Register Button */}
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                         xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                                                stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor"
                                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Mendaftar...
                                                </span>
                                            ) : "Daftar Sekarang"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Illustration Section */}
                        <div className="md:w-1/2 p-8 sm:p-12 bg-teal-600 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
                            </div>

                            {/* Floating Elements */}
                            <div
                                className="absolute top-10 right-10 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>
                            <div
                                className="absolute bottom-20 left-10 w-32 h-32 bg-teal-300 opacity-10 rounded-full blur-2xl"></div>
                            <div
                                className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-300 opacity-10 rounded-full blur-xl"></div>

                            <div className="relative z-10 h-full flex flex-col justify-center text-white">
                                <div className="mb-8">
                                    <h2 className="text-4xl font-bold mb-4">Bergabunglah dengan Kami</h2>
                                    <p className="text-lg opacity-90">
                                        Sistem manajemen klinik modern yang memudahkan praktik Anda
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div
                                            className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <Shield className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Keamanan Terjamin</h3>
                                            <p className="text-sm opacity-90">Data pasien Anda diamankan dengan enkripsi
                                                tingkat enterprise</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div
                                            className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <Users className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Kolaborasi Tim</h3>
                                            <p className="text-sm opacity-90">Kelola tim medis Anda dengan mudah dan
                                                efisien</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div
                                            className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <Zap className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Cepat & Responsif</h3>
                                            <p className="text-sm opacity-90">Akses data pasien kapan saja, di mana saja
                                                dengan cepat</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div
                                            className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                            <Headset className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">Dukungan 24/7</h3>
                                            <p className="text-sm opacity-90">Tim support kami siap membantu Anda kapan
                                                pun dibutuhkan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Sudah punya akun?{" "}
                            <Link to="/login"
                                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors">
                                Masuk sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                <p>&copy; 2025 Zyntera</p>
            </footer>
        </div>
    );
}

export default Register;