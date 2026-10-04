import { useState } from "react";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">

            <div className="logo">
                <div className="logo-symbol">✦</div>

                <span className="logo-main">
                    SADGI
                </span>

                <span className="logo-sub">
                    GARBA MAHOTSAV
                </span>
            </div>

            {/* Desktop Navigation */}
            <div className="nav-links">

                <a href="#home" className="active">
                    Home
                </a>

                <a href="/about">
                    About
                </a>

                <a href="#events">
                    Events
                </a>

                <a href="#contact">
                    Contact
                </a>

            </div>

            {/* Mobile Hamburger */}
            <button
                className={`menu-toggle ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>

                <a
                    href="#home"
                    onClick={() => setMenuOpen(false)}
                >
                    Home
                </a>

                <a
                    href="/about"
                    onClick={() => setMenuOpen(false)}
                >
                    About
                </a>

                <a
                    href="#events"
                    onClick={() => setMenuOpen(false)}
                >
                    Events
                </a>

                <a
                    href="#contact"
                    onClick={() => setMenuOpen(false)}
                >
                    Contact
                </a>

            </div>

        </nav>
    );
}

export default Navbar;