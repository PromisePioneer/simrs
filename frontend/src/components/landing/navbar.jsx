import {Button} from "@/components/ui/button.jsx";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";

function Navbar() {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const text = "Zyntera";

    useEffect(() => {
        let currentIndex = 0;

        if (isTyping) {
            const typingInterval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayText(text.substring(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    setIsTyping(false);
                }
            }, 150);

            return () => clearInterval(typingInterval);
        }
    }, [isTyping, text]);

    return (
        <>
            <nav className="glass-strong fixed w-full top-0 z-50 border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="rounded-xl flex items-center justify-center">
                                <div
                                    className="text-5xl font-extrabold bg-clip-text text-teal-500 min-w-[220px]"
                                >
                                    {displayText}
                                    <span className="inline-block ml-1 h-12 w-1 bg-teal-500 animate-blink"></span>
                                </div>
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
                                asChild
                                className="text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                            >
                                <Link to="/register">Mulai</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;