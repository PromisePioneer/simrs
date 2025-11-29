import {Button} from "@/components/ui/button.jsx";
import {Link} from "react-router-dom";


function Navbar() {
    return (
        <>
            <nav className="glass-strong fixed w-full top-0 z-50 border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div
                                className="rounded-xl flex items-center justify-center shadow-lg">
                                <img src="src/assets/zyntera.png" alt="company_logo" className="w-20 h-20"/>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features"
                               className="text-gray-700 hover:text-cyan-600 transition font-medium">Fitur</a>
                            <a href="#testimonials"
                               className="text-gray-700 hover:text-cyan-600 transition font-medium">Testimoni</a>
                            <a href="#pricing"
                               className="text-gray-700 hover:text-cyan-600 transition font-medium">Harga</a>
                            <a href="#contact"
                               className="text-gray-700 hover:text-cyan-600 transition font-medium">Kontak</a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="hidden md:block text-gray-700 hover:text-cyan-600 transition font-medium"
                            >
                                Masuk
                            </Link>
                            <Button
                                className=" text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                Mulai
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}


export default Navbar;