import {Button} from "@/components/ui/button.jsx";

function Contact() {
    return (
        <>
            <section id="contact" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-strong rounded-3xl p-12 relative overflow-hidden">
                        <div className="absolute inset-0 shimmer opacity-20"></div>

                        <div className="text-center mb-12 relative z-10">
                            <h2 className="text-5xl font-black mb-6">
                                Siap untuk Mengubah
                                <span className="text-teal-500 block">Praktik Kesehatan Anda?</span>
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Bergabunglah dengan ribuan profesional kesehatan yang sudah menggunakan MediFlow untuk
                                menyederhanakan operasi mereka
                            </p>
                        </div>

                        <div className="max-w-2xl mx-auto relative z-10">
                            <div className="glass rounded-2xl p-8">
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama
                                                Depan</label>
                                            <input type="text"
                                                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:outline-none transition-colors"
                                                   placeholder="John"/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nama
                                                Belakang</label>
                                            <input type="text"
                                                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:outline-none transition-colors"
                                                   placeholder="Doe"/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input type="email"
                                               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:outline-none transition-colors"
                                               placeholder="john@example.com"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama
                                            Praktik</label>
                                        <input type="text"
                                               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:outline-none transition-colors"
                                               placeholder="Pusat Medis"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                                        <textarea rows="4"
                                                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:outline-none transition-colors"
                                                  placeholder="Ceritakan tentang praktik Anda..."></textarea>
                                    </div>
                                    <Button
                                        className="w-full text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-2xl"
                                        size={15}>
                                        Mulai
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}


export default Contact;