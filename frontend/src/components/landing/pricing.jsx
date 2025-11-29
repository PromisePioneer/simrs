import {Button} from "@/components/ui/button.jsx";

function Pricing() {
    return (
        <>
            <section id="pricing" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-block glass px-6 py-2 rounded-full text-cyan-600 font-semibold mb-4">
                            Harga
                        </div>
                        <h2 className="text-5xl font-black mb-6">
                            Harga yang Sederhana,
                            <span className="gradient-text block">Transparan</span>
                        </h2>
                        <p className="text-xl text-gray-600">Pilih paket yang sesuai dengan praktik Anda</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all">
                            <div className="text-sm font-semibold text-cyan-600 mb-2">PEMULA</div>
                            <div className="text-5xl font-black mb-2">Rp 250.000<span
                                className="text-xl text-gray-500">/bln</span></div>
                            <p className="text-gray-600 mb-8">Sempurna untuk praktik kecil</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Termasuk 1.000 transaksi</span>
                                </li>

                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Termasuk 100+ pasien</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Untuk setiap tambahan transaksi, dikenakan biaya Rp2.000</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span
                                        className="text-gray-700">Sudah termasuk akun tenaga kesehatan selain dokter</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Domain klinik</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Gratis 3x pelatihan online</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Gratis biaya pemasangan</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Gratis biaya pemeliharaan</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Dapat melakukan kustomisasi</span>
                                </li>
                            </ul>
                            <Button
                                className="w-full text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg">
                                Uji Coba Dan Daftarkan Klinik
                            </Button>
                        </div>

                        <div
                            className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all relative overflow-hidden">
                            <div
                                className="absolute top-0 right-0 bg-gradient-to-br from-cyan-500 to-emerald-500 text-white text-sm font-semibold px-4 py-1 rounded-bl-xl">
                                PALING POPULER
                            </div>
                            <div className="text-sm font-semibold text-teal-600 mb-2">PROFESIONAL</div>
                            <div className="text-5xl font-black mb-2">Rp 400.000<span
                                className="text-xl text-gray-500">/bln</span></div>
                            <p className="text-gray-600 mb-8">Ideal untuk praktik yang berkembang</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Termasuk 1.000 transaksi</span>
                                </li>

                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Termasuk 500+ pasien</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Untuk setiap tambahan transaksi, dikenakan biaya Rp2.000</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span
                                        className="text-gray-700">Sudah termasuk akun tenaga kesehatan selain dokter</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Domain klinik</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Gratis 3x pelatihan online</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Gratis biaya pemasangan</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Gratis biaya pemeliharaan</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Dapat melakukan kustomisasi</span>
                                </li>
                            </ul>
                            <Button
                                className="w-full text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg">
                                Uji Coba Dan Daftarkan Klinik
                            </Button>
                        </div>

                        <div className="glass-strong rounded-3xl p-8 hover:scale-105 transition-all">
                            <div className="text-sm font-semibold text-cyan-600 mb-2">ENTERPRISE</div>
                            <div className="text-5xl font-black mb-2">Kustom<span
                                className="text-xl text-gray-500"></span>
                            </div>
                            <p className="text-gray-600 mb-8">Untuk organisasi kesehatan besar</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Termasuk 1.000 transaksi</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Untuk setiap tambahan transaksi, dikenakan biaya Rp2.000</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span
                                        className="text-gray-700">Sudah termasuk akun tenaga kesehatan selain dokter</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Domain klinik / Rumah sakit</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Gratis 3x pelatihan online</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Gratis biaya pemasangan</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Gratis biaya pemeliharaan</span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <svg className="w-6 h-6 text-emerald-500 flex-shrink-0" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path fillRule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-gray-700">Dapat melakukan kustomisasi</span>
                                </li>
                            </ul>
                            <Button
                                className="w-full text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg">
                                Uji Coba Dan Daftarkan Klinik
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}


export default Pricing;