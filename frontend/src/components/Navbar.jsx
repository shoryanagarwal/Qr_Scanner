function Navbar() {
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

            <div className="nav-links">

                <a href="#home" className="active">
                    Home
                </a>

                <a href="/about">About</a>

                <a href="#events">
                    Events
                </a>

                <a href="#contact">
                    Contact
                </a>

            </div>

        </nav>
    );
}

export default Navbar;