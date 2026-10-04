import durgaImage from "../assets/durga.jpeg";

function Hero() {
    return (
        <section className="hero" id="home">

            <img
                src={durgaImage}
                alt="Maa Durga"
                className="hero-image"
            />

            <div className="hero-overlay"></div>

            <div className="hero-content">

                <p className="hero-small">
                    ✦ A CELEBRATION OF FAITH & TOGETHERNESS ✦
                </p>

                <h1>
                    Sadgi
                    <span>Garba Mahotsav</span>
                </h1>

                <p className="hero-description">
                    Where devotion meets celebration,
                    and every beat brings us together.
                </p>

               

            </div>

            <div className="hero-bottom">

                <span>NAVRATRI 2026</span>

                <div className="scroll-line"></div>

                <span>CELEBRATE • DANCE • TOGETHER</span>

            </div>

        </section>
    );
}

export default Hero;