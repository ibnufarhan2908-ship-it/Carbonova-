import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function OnboardingTour() {
    useEffect(() => {
        const sudahLihat = localStorage.getItem("carbonova-onboarding-done");
        if (sudahLihat) return;

        const startTour = () => {
            const driverObj = driver({
                animate: true,
                showProgress: true,
                nextBtnText: "Lanjut",
                prevBtnText: "Kembali",
                doneBtnText: "Mulai Jelajah",
                steps: [
                    {
                        element: '[data-tour="home"]',
                        popover: {
                            title: "Selamat Datang di Carbonova! 🌱",
                            description: "Ini halaman utama kamu, mulai dari sini dulu ya.",
                        },
                    },
                    {
                        element: '[data-tour="materi"]',
                        popover: {
                            title: "Materi 📚",
                            description: "Belajar tentang karbon & lingkungan di sini.",
                        },
                    },
                    {
                        element: '[data-tour="molecule"]',
                        popover: {
                            title: "Molecule Explorer 🧬",
                            description: "Jelajahi molekul-molekul seru secara interaktif.",
                        },
                    },
                    {
                        element: '[data-tour="carbonlab"]',
                        popover: {
                            title: "Carbon Lab 🧪",
                            description: "Coba eksperimen & hitung jejak karbon kamu di sini.",
                        },
                    },
                    {
                        element: '[data-tour="latihan"]',
                        popover: {
                            title: "Latihan Soal ✏️",
                            description: "Uji pemahaman kamu lewat latihan soal.",
                        },
                    },
                    {
                        element: '[data-tour="tentang"]',
                        popover: {
                            title: "Tentang 👤",
                            description: "Kenalan sama Carbonova dan tim di baliknya. Yuk mulai!",
                        },
                    },
                ],
                onDestroyed: () => {
                    localStorage.setItem("carbonova-onboarding-done", "true");
                },
            });

            driverObj.drive();
        };

        const welcomeSeen = localStorage.getItem("carbonova_welcome_seen");
        if (welcomeSeen !== "true") {
            const handleWelcomeClosed = () => {
                setTimeout(startTour, 400);
            };
            window.addEventListener("carbonova:welcome_closed", handleWelcomeClosed, { once: true });
            return () => window.removeEventListener("carbonova:welcome_closed", handleWelcomeClosed);
        }

        const timer = setTimeout(startTour, 800);
        return () => clearTimeout(timer);
    }, []);

    return null;
}