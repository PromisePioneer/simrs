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
                                className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 glow-blue">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
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
                                className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mb-6 glow-green">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
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
                                className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 glow-blue">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
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
                                className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
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
                                className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
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
                                className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
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