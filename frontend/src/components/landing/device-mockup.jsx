function DeviceMockup() {
    return <>
        (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="glass-strong rounded-3xl p-12 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer opacity-20"></div>

                    <div className="text-center mb-16 relative z-10">
                        <h2 className="text-5xl font-black mb-6">
                            <span className="text-teal-500">Dapat Diakses di Mana Saja</span>
                        </h2>
                        <p className="text-xl text-gray-600">
                            Desktop, tablet, atau mobile - data Anda sinkron secara mulus
                        </p>
                    </div>

                    <div className="perspective relative z-10">
                        <div className="flex items-center justify-center space-x-8">
                            <div className="preserve-3d float">
                                <div className="glass-strong rounded-3xl p-4 shadow-2xl w-80">
                                    <div
                                        className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-2xl p-6 aspect-[4/3]">
                                        <div className="text-xs font-semibold text-gray-600 mb-3">Tampilan Tablet</div>
                                        <div className="space-y-3">
                                            <div className="glass p-3 rounded-xl">
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-lg"></div>
                                                    <div className="flex-1">
                                                        <div className="h-2 bg-gray-300 rounded w-3/4 mb-1"></div>
                                                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="glass p-3 rounded-xl">
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg"></div>
                                                    <div className="flex-1">
                                                        <div className="h-2 bg-gray-300 rounded w-2/3 mb-1"></div>
                                                        <div className="h-2 bg-gray-200 rounded w-2/5"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="preserve-3d float-delay">
                                <div className="glass-strong rounded-3xl p-3 shadow-2xl w-48">
                                    <div
                                        className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-2xl p-4 aspect-[9/19]">
                                        <div className="text-xs font-semibold text-gray-600 mb-3">Tampilan Mobile</div>
                                        <div className="space-y-2">
                                            <div className="glass p-2 rounded-lg">
                                                <div className="h-2 bg-gray-300 rounded w-4/5 mb-1"></div>
                                                <div className="h-2 bg-gray-200 rounded w-3/5"></div>
                                            </div>
                                            <div className="glass p-2 rounded-lg">
                                                <div className="h-2 bg-gray-300 rounded w-3/4 mb-1"></div>
                                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                            <div className="glass p-2 rounded-lg">
                                                <div className="h-2 bg-gray-300 rounded w-4/5 mb-1"></div>
                                                <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        )
    </>
}

export default DeviceMockup;