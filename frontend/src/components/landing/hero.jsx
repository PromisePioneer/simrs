import {Button} from "@/components/ui/button.jsx";
import {Link} from '@tanstack/react-router'

function Hero() {
    return (
        <>
            <section className="pt-32 pb-20 px-6 mb-[200px] relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 fade-in visible">
                            <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span
                                    className="text-sm font-medium text-gray-700">Terintegrasi BPJS &amp; Satu Sehat</span>
                            </div>

                            <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                                Manajemen
                                <span className="text-teal-500 block">Kesehatan</span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                                Sederhanakan perawatan pasien, otomatisasi alur kerja, dan tingkatkan hasil klinis
                                dengan platform
                                manajemen kesehatan bertenaga AI kami.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Button asChild
                                        className=" text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl"
                                        size={13}>

                                    <Link to="/register">
                                        Mulai Uji Coba Gratis
                                    </Link>
                                </Button>
                                <button
                                    className="glass px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-lg flex items-center space-x-2">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
                                    </svg>
                                    <span>Coming Soon!</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative fade-in visible">
                            <div className="hero-float">
                                <div className="glass-strong rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 shimmer opacity-30"></div>

                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">Dashboard Pasien</h3>
                                            <p className="text-sm text-gray-500">Analitik Real-time</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div
                                            className="glass p-4 rounded-2xl hover:scale-105 transition-all cursor-pointer">
                                            <div className="text-cyan-600 text-2xl font-bold">1.247</div>
                                            <div className="text-sm text-gray-600">Total Pasien</div>
                                            <div className="text-xs text-emerald-500 mt-1">↑ 12% bulan ini</div>
                                        </div>
                                        <div
                                            className="glass p-4 rounded-2xl hover:scale-105 transition-all cursor-pointer">
                                            <div className="text-emerald-600 text-2xl font-bold">89</div>
                                            <div className="text-sm text-gray-600">Janji Temu</div>
                                            <div className="text-xs text-emerald-500 mt-1">Hari ini</div>
                                        </div>
                                    </div>

                                    <div className="glass p-4 rounded-2xl">
                                        <div className="text-sm font-semibold text-gray-700 mb-3">Aktivitas Pasien</div>
                                        <div className="flex items-end justify-between h-32 space-x-2">
                                            <div
                                                className="flex-1 bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-lg chart-bar"
                                                style={{height: '60%', animationDelay: '0.1s'}}></div>
                                            <div
                                                className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-lg chart-bar"
                                                style={{height: '85%', animationDelay: '0.2s'}}></div>
                                            <div
                                                className="flex-1 bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-lg chart-bar"
                                                style={{height: '70%', animationDelay: '0.3s'}}></div>
                                            <div
                                                className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-lg chart-bar"
                                                style={{height: '95%', animationDelay: '0.4s'}}></div>
                                            <div
                                                className="flex-1 bg-gradient-to-t from-cyan-400 to-cyan-300 rounded-lg chart-bar"
                                                style={{height: '75%', animationDelay: '0.5s'}}></div>
                                            <div
                                                className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-lg chart-bar"
                                                style={{height: '88%', animationDelay: '0.6s'}}></div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="absolute -right-8 top-20 glass-strong rounded-2xl p-4 shadow-xl hero-float-delay w-56">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-xl"></div>
                                        <div>
                                            <div className="font-semibold text-gray-800">Dr. Sarah Chen</div>
                                            <div className="text-xs text-gray-500">Spesialis Jantung</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="text-xs text-gray-600">Tersedia Berikutnya:</div>
                                        <div className="text-xs font-semibold text-emerald-600">14:30</div>
                                    </div>
                                </div>

                                <div
                                    className="absolute -left-8 bottom-20 glass-strong rounded-2xl p-4 shadow-xl hero-float w-64">
                                    <div className="flex items-start space-x-3">
                                        <div
                                            className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                                <path
                                                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-gray-800">Janji Temu Baru</div>
                                            <div className="text-xs text-gray-600 mt-1">John Doe dijadwalkan untuk pukul
                                                15:00
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero;