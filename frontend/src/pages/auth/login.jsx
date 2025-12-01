import {Input} from "@/components/ui/input.jsx";
import {Label} from "@/components/ui/label.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Separator} from "@/components/ui/separator.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";
import {useEffect, useState} from "react";
import {Link, useNavigate} from '@tanstack/react-router'
import {useAuthStore} from "@/store/authStore.js";
import {Eye, EyeOff, Users} from "lucide-react";

function Login() {
    const {login, loading, error, loggedIn} = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
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
        <div
            className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-between">

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-6xl">
                    <div
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden md:flex transform transition-all duration-500 hover:shadow-3xl">
                        {/* Form Section */}
                        <div
                            className="md:w-1/2 p-8 sm:p-12 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700">
                            <Card className="border-0 shadow-none bg-transparent">
                                <CardHeader className="px-0 pt-0">
                                    <CardTitle
                                        className="text-3xl font-bold text-center mb-2 text-teal-600">
                                        Masuk ke akun Anda
                                    </CardTitle>
                                    <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                                        Masukkan kredensial Anda untuk mengakses portal layanan kesehatan
                                    </CardDescription>
                                </CardHeader>
                                <Separator
                                    className="my-6 bg-gradient-to-r from-transparent via-teal-200 to-transparent"/>
                                <CardContent className="px-0 space-y-6">
                                    {/* Error Display */}
                                    {error && typeof error === 'string' && (
                                        <div
                                            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-start space-x-2 transform transition-all duration-300 animate-pulse">
                                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor"
                                                 viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'email' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="email"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">Email</Label>
                                            <div className="relative">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="nama@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
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
                                            {error?.email && (
                                                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor"
                                                         viewBox="0 0 20 20">
                                                        <path fillRule="evenodd"
                                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                    {error?.email[0]}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password Field */}
                                        <div
                                            className={`space-y-2 transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
                                            <Label htmlFor="password"
                                                   className="text-gray-700 dark:text-gray-300 font-medium">Kata
                                                Sandi</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Masukkan kata sandi Anda"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
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
                                            {error?.password && (
                                                <p className="text-xs text-red-600 dark:text-red-400 flex items-center mt-1">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor"
                                                         viewBox="0 0 20 20">
                                                        <path fillRule="evenodd"
                                                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                    {error?.password[0]}
                                                </p>
                                            )}
                                        </div>

                                        {/* Remember Me & Forgot Password */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="remember"
                                                    checked={rememberMe}
                                                    onCheckedChange={setRememberMe}
                                                    className="border-gray-300 dark:border-gray-600 text-teal-600 focus:ring-teal-500"
                                                />
                                                <Label htmlFor="remember"
                                                       className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                                    Ingat saya
                                                </Label>
                                            </div>
                                            <button
                                                type="button"
                                                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
                                            >
                                                Lupa kata sandi?
                                            </button>
                                        </div>

                                        {/* Login Button */}
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full hover:from-teal-700 hover:to-blue-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
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
                                                    Memuat...
                                                </span>
                                            ) : "Masuk"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Illustration Section */}
                        <div
                            className="md:w-1/2 p-8 sm:p-12 bg-teal-600 relative overflow-hidden">
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

                            <div className="relative z-10 h-full flex flex-col justify-center">
                                <div
                                    className="glass-strong rounded-3xl p-6 shadow-2xl relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20">
                                    <div className="absolute inset-0 shimmer opacity-30"></div>

                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold">Dashboard Pasien</h3>
                                            <p className="text-sm ">Analitik Real-time</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                                            <div
                                                className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
                                            <div
                                                className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse delay-150"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div
                                            className="glass p-4 rounded-2xl hover:scale-105 transition-all cursor-pointer bg-white/10 backdrop-blur-sm border border-white/20">
                                            <div className=" text-2xl font-bold">1.247</div>
                                            <div className="text-sm ">Total Pasien</div>
                                            <div className="text-xs  mt-1 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd"
                                                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                                          clipRule="evenodd"/>
                                                </svg>
                                                12% bulan ini
                                            </div>
                                        </div>
                                        <div
                                            className="glass p-4 rounded-2xl hover:scale-105 transition-all cursor-pointer bg-white/10 backdrop-blur-sm border border-white/20">
                                            <div className=" text-2xl font-bold">89</div>
                                            <div className="text-sm ">Janji Temu</div>
                                            <div className="text-xs  mt-1">Hari ini</div>
                                        </div>
                                    </div>

                                    <div
                                        className="glass p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                                        <div className="text-sm font-semibold  mb-3">Aktivitas Pasien</div>
                                        <div className="flex items-end justify-between h-32 space-x-2">
                                            <div
                                                className="flex-1 bg-teal-600 rounded-lg chart-bar animate-pulse"
                                                style={{height: '60%', animationDelay: '0.1s'}}></div>
                                            <div
                                                className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-lg chart-bar animate-pulse"
                                                style={{height: '85%', animationDelay: '0.2s'}}></div>
                                            <div
                                                className="flex-1 bg-teal-600 rounded-lg chart-bar animate-pulse"
                                                style={{height: '70%', animationDelay: '0.3s'}}></div>
                                            <div
                                                className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-lg chart-bar animate-pulse"
                                                style={{height: '95%', animationDelay: '0.4s'}}></div>
                                            <div
                                                className="flex-1 bg-teal-600 rounded-lg chart-bar animate-pulse"
                                                style={{height: '75%', animationDelay: '0.5s'}}></div>
                                            <div
                                                className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-lg chart-bar animate-pulse"
                                                style={{height: '88%', animationDelay: '0.6s'}}></div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="absolute -right-8 top-20 glass-strong rounded-2xl p-4 shadow-xl hero-float-delay w-56 bg-white/10 backdrop-blur-md border border-white/20">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
                                            <Users className="w-6 h-6 "/>
                                        </div>
                                        <div>
                                            <div className="font-semibold ">Dr. Sarah Chen</div>
                                            <div className="text-xs ">Spesialis Jantung</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="text-xs ">Tersedia Berikutnya:</div>
                                        <div className="text-xs font-semibold ">14:30</div>
                                    </div>
                                </div>

                                <div
                                    className="absolute -left-8 bottom-20 glass-strong rounded-2xl p-4 shadow-xl hero-float w-64 bg-white/10 backdrop-blur-md border border-white/20">
                                    <div className="flex items-start space-x-3">
                                        <div
                                            className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 " fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                                <path
                                                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold ">Janji Temu Baru</div>
                                            <div className="text-xs  mt-1">John Doe dijadwalkan untuk pukul
                                                15:00
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Belum punya akun?{" "}
                            <Link to="/auth/register"
                                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors">
                                Daftar sekarang
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

export default Login;