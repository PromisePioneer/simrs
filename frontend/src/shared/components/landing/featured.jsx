import {
    ChartColumnBig,
    Calendar,
    Shield,
    Zap,
    Bell,
    Smartphone
} from "lucide-react";

function Featured() {
    return (
        <>
            <section id="features" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block glass px-6 py-2 rounded-full text-teal-500 font-semibold mb-4">
                            Fitur
                        </div>
                        <h2 className="text-5xl font-black mb-6">
                            Semua yang Anda Butuhkan untuk
                            <span className="text-teal-500 block">Mengubah Kesehatan</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Alat canggih yang dirancang untuk profesional kesehatan modern
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div
                            className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <div
                                className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6 glow-green">
                                <ChartColumnBig className="w-8 h-8 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Analitik Real-time</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Pantau metrik pasien, lacak hasil perawatan, dan buat keputusan berbasis data dengan
                                dashboard
                                analitik canggih.
                            </p>
                        </div>

                        <div
                            className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <div
                                className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6 glow-green">
                                <Calendar className="w-8 h-8 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Penjadwalan Cerdas</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Penjadwalan janji temu bertenaga AI yang mengoptimalkan kalender Anda dan mengurangi
                                ketidakhadiran secara otomatis.
                            </p>
                        </div>
                        <div
                            className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <div
                                className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6 glow-blue">
                                <Shield className="w-8 h-8 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Integrasi BPJS Kesehatan</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Terhubung langsung dengan sistem BPJS Kesehatan untuk verifikasi kepesertaan, klaim
                                otomatis, dan manajemen pembayaran yang lebih mudah.
                            </p>
                        </div>

                        <div
                            className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <div
                                className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6">
                                <Zap className="w-8 h-8 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Integrasi Satu Sehat</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Sinkronisasi data dengan platform Satu Sehat Kementerian Kesehatan untuk rekam medis
                                terpadu dan pelacakan kesehatan pasien secara nasional.
                            </p>
                        </div>

                        <div
                            className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <div
                                className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6">
                                <Bell className="w-8 h-8 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Peringatan Cerdas</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Notifikasi otomatis untuk peristiwa pasien kritis, pengingat obat, dan janji temu
                                tindak lanjut.
                            </p>
                        </div>

                        <div
                            className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all duration-500 cursor-pointer">
                            <div
                                className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mb-6">
                                <Smartphone className="w-8 h-8 text-white"/>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Mobile First</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Akses rekam pasien dan kelola perawatan dari mana saja dengan aplikasi mobile kami yang
                                sepenuhnya responsif.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Featured;