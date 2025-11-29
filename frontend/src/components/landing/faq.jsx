function Faq() {
    return (
        <>
            <section className="px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block glass px-6 py-2 rounded-full text-emerald-600 font-semibold mb-4">
                            FAQ
                        </div>
                        <h2 className="text-5xl font-black mb-6">
                            Pertanyaan yang Sering
                            <span className="gradient-text block">Diajukan</span>
                        </h2>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-strong rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Apakah MediFlow aman untuk data pasien?</h3>
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <p className="text-gray-600">
                                Ya, MediFlow sepenuhnya aman. Kami menggunakan enkripsi standar industri, pusat data
                                aman, dan audit keamanan rutin untuk memastikan data pasien Anda selalu terlindungi
                                sesuai standar kesehatan Indonesia.
                            </p>
                        </div>

                        <div className="glass-strong rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Bisakah saya mengintegrasikan MediFlow dengan BPJS
                                    Kesehatan?</h3>
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <p className="text-gray-600">
                                Tentu saja! MediFlow menawarkan integrasi langsung dengan sistem BPJS Kesehatan untuk
                                verifikasi kepesertaan dan proses klaim yang lebih mudah. Fitur ini tersedia di paket
                                Profesional dan Enterprise.
                            </p>
                        </div>

                        <div className="glass-strong rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Apakah MediFlow terintegrasi dengan platform Satu
                                    Sehat?</h3>
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <p className="text-gray-600">
                                Ya, MediFlow sepenuhnya terintegrasi dengan platform Satu Sehat Kementerian Kesehatan.
                                Ini memungkinkan sinkronisasi data kesehatan pasien secara nasional dan akses ke rekam
                                medis dari berbagai fasilitas kesehatan.
                            </p>
                        </div>

                        <div className="glass-strong rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Apakah ada aplikasi mobile yang tersedia?</h3>
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <p className="text-gray-600">
                                Ya, MediFlow sepenuhnya responsif dan berfungsi di semua perangkat. Kami juga menawarkan
                                aplikasi iOS dan Android asli untuk paket Profesional dan Enterprise.
                            </p>
                        </div>

                        <div className="glass-strong rounded-3xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Jenis dukungan apa yang Anda tawarkan?</h3>
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                            <p className="text-gray-600">
                                Kami menawarkan dukungan email untuk semua paket, dukungan prioritas untuk paket
                                Profesional, dan dukungan telepon 24/7 dengan manajer akun khusus untuk paket
                                Enterprise.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}


export default Faq;