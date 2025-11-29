import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Checkbox} from "@/components/ui/checkbox";
import {useState} from "react";
import {Eye, EyeOff, Headset, Shield, Users, Zap} from "lucide-react";
import {Link} from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        clinicName: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Basic validation
        const newErrors = {};
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Kata sandi tidak cocok";
        }
        if (formData.password.length < 8) {
            newErrors.password = "Kata sandi minimal 8 karakter";
        }
        if (!agreeTerms) {
            newErrors.terms = "Anda harus menyetujui syarat dan ketentuan";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            console.log("Registration data:", formData);
            setLoading(false);
            // Navigate to login or dashboard
        }, 1500);
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
                                                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
                                                />
                                                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                </svg>
                                            </div>
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
                                                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
                                                />
                                                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                                                </svg>
                                            </div>
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
                                                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
                                                />
                                                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Clinic Name Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'clinicName' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="clinicName"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">
                                                Nama Klinik
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="clinicName"
                                                    name="clinicName"
                                                    type="text"
                                                    placeholder="Klinik Sehat Sejahtera"
                                                    value={formData.clinicName}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('clinicName')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className="pl-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
                                                />
                                                <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                                </svg>
                                            </div>
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
                                                    className="pl-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
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
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="confirmPassword"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">
                                                Konfirmasi Kata Sandi
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Masukkan ulang kata sandi"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('confirmPassword')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className="pl-10 pr-10 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
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
                                            {errors.confirmPassword && (
                                                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor"
                                                         viewBox="0 0 20 20">
                                                        <path fillRule="evenodd"
                                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                    {errors.confirmPassword}
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
                                            className="w-full  text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
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