import { Link } from "react-router-dom";

function AboutPage() {
    return (
        <main className="about-page">

            {/* =========================
                ABOUT HERO
            ========================= */}

            <section className="about-page-hero">

                <div className="about-page-hero-content">

                    <p className="section-label">
                        ✦ ABOUT SADGI GARBA MAHOTSAV ✦
                    </p>

                    <h1>
                        More Than A Celebration,
                        <span>A Feeling Of Togetherness.</span>
                    </h1>

                    <p>
                        A celebration of faith, culture, tradition
                        and the beautiful spirit of coming together.
                    </p>

                </div>

            </section>


            {/* =========================
                OUR STORY
            ========================= */}

            <section className="about-story-section">

                <div className="about-story-heading">

                    <p className="section-label">
                        ✦ OUR STORY ✦
                    </p>

                    <h2>
                        The Spirit Behind
                        <span>Sadgi Garba Mahotsav.</span>
                    </h2>

                </div>


                <div className="about-story-content">

                    <div className="about-story-text">

                        <p className="about-lead">
                            Sadgi Garba Mahotsav is more than just
                            a Navratri celebration.
                        </p>

                        <p>
                            It is a celebration where families,
                            friends and the entire community come
                            together to experience the joy of
                            Navratri.
                        </p>

                        <p>
                            Rooted in our traditions and inspired by
                            the divine energy of Maa Durga, the
                            Mahotsav brings together devotion,
                            music, dance and togetherness.
                        </p>

                        <p>
                            Every evening is an opportunity to create
                            memories, celebrate our culture and share
                            the happiness of being together.
                        </p>

                    </div>


                    <div className="about-values">

                        <div className="about-value-card">

                            <span>✦</span>

                            <h3>
                                Faith
                            </h3>

                            <p>
                                Celebrating the divine spirit
                                of Navratri.
                            </p>

                        </div>


                        <div className="about-value-card">

                            <span>✦</span>

                            <h3>
                                Culture
                            </h3>

                            <p>
                                Keeping our traditions alive
                                through celebration.
                            </p>

                        </div>


                        <div className="about-value-card">

                            <span>✦</span>

                            <h3>
                                Togetherness
                            </h3>

                            <p>
                                Bringing families and the
                                community closer.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                OUR VISION
            ========================= */}

            <section className="about-vision-section">

                <div className="about-vision-inner">

                    <p className="section-label">
                        ✦ OUR VISION ✦
                    </p>

                    <h2>
                        Celebrating Together.
                        <span>Growing Together.</span>
                    </h2>

                    <p>
                        We believe that festivals become truly
                        meaningful when they bring people together.
                        Sadgi Garba Mahotsav is an effort to create
                        an atmosphere where devotion, culture,
                        happiness and community come together.
                    </p>

                    <div className="about-vision-divider">
                        <span>✦</span>
                    </div>

                    <p className="about-hindi">
                        जहाँ भक्ति है, वहाँ शक्ति है।
                        <br />
                        जहाँ एकता है, वहाँ उत्सव है।
                    </p>

                </div>

            </section>


            {/* =========================
                OPEN GARBA
            ========================= */}

            <section className="about-open-garba">

                <div className="about-open-content">

                    <p className="section-label">
                        ✦ ओपन गरबा • OPEN GARBA ✦
                    </p>

                    <h2>
                        Everyone Is Welcome.
                        <span>Come Celebrate With Us.</span>
                    </h2>

                    <p>
                        Join us for an evening filled with music,
                        dance, tradition and togetherness.
                        Bring your family and be a part of
                        Sadgi Garba Mahotsav.
                    </p>

                    <Link
                        to="/open-garba"
                        className="about-register-button"
                    >
                        REGISTER FOR OPEN GARBA
                        <span>→</span>
                    </Link>

                </div>

            </section>


            {/* =========================
                BACK TO HOME
            ========================= */}

            <div className="about-page-back">

                <Link to="/">
                    ← Back To Home
                </Link>

            </div>

        </main>
    );
}

export default AboutPage;