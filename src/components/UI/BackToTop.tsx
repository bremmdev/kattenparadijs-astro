import ChevronUp from "../icons/ChevronUp.tsx";
import React from "react";

const BackToTop = () => {
    const [isScrollable, setIsScrollable] = React.useState(false);

    React.useEffect(() => {
        const check = () => setIsScrollable(document.body.scrollHeight > window.innerHeight * 1.2);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    };

    if (!isScrollable) return null;

    return (
        <button
            onClick={scrollToTop}
            className="mx-auto grid place-items-center size-12 transition-all duration-300 rounded-full p-1 bg-radial from-theme-lightest to-theme-light hover:scale-110"
            aria-label="back to top"
        >
            <ChevronUp />
        </button>
    );
};

export default BackToTop;
