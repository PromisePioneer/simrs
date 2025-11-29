import { useEffect } from "react";

import Navbar from "@/components/landing/navbar.jsx";
import Hero from "@/components/landing/hero.jsx";
import Featured from "@/components/landing/featured.jsx";
import '../assets/css/landing.css';
import DeviceMockup from "@/components/landing/device-mockup.jsx";
import Testimonial from "@/components/landing/testimonial.jsx";
import Pricing from "@/components/landing/pricing.jsx";
import Faq from "@/components/landing/faq.jsx";
import Contact from "@/components/landing/contact.jsx";
import Footer from "@/components/landing/footer.jsx";

function Landing() {

    useEffect(() => {

        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll(".fade-in");
        fadeElements.forEach((el) => observer.observe(el));

        const anchors = document.querySelectorAll('a[href^="#"]');
        const smoothScroll = (e) => {
            e.preventDefault();
            const target = document.querySelector(e.currentTarget.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        };

        anchors.forEach((anchor) =>
            anchor.addEventListener("click", smoothScroll)
        );

        return () => {
            fadeElements.forEach((el) => observer.unobserve(el));
            anchors.forEach((anchor) =>
                anchor.removeEventListener("click", smoothScroll)
            );
        };

    }, []);

    return (
        <>
            <Navbar/>
            <Hero/>
            <Featured/>
            <DeviceMockup/>
            <Testimonial/>
            <Pricing/>
            <Faq/>
            <Contact/>
            <Footer/>
        </>
    );
}

export default Landing;
