function Specialities() {
    const specialities = [
        {
            number: "01",
            title: "Special Performances",
            text: "Every day brings a new performance, making every evening of Navratri special and memorable."
        },
        {
            number: "02",
            title: "Open Garba",
            text: "Everyone is welcome to join the celebration, dance to the beats and celebrate together."
        },
        {
            number: "03",
            title: "Prizes & Surprises",
            text: "Participate in exciting activities and stand a chance to win special prizes."
        },
        {
            number: "04",
            title: "Navratri Quizzes",
            text: "Fun and engaging quizzes based on Navratri, its traditions and our culture."
        }
    ];

    return (
        <section className="specialities-section" id="specialities">

            <div className="specialities-heading">

                <p className="section-label">
                    ✦ THE SADGI EXPERIENCE ✦
                </p>

                <h2>
                    What Makes
                    <span>Sadgi Garba Special?</span>
                </h2>

                <p className="specialities-intro">
                    Every evening has something special.
                    But one tradition makes Sadgi truly distinctive.
                </p>

            </div>


            {/* GRAND AARTI FEATURE */}

            <div className="aarti-feature">

                <div className="aarti-number">
                    01
                </div>

                <div className="aarti-content">

                    <p className="aarti-label">
                        ✦ GRAND AARTI ✦
                    </p>

                    <h3>
                        Bharat Mata
                        <span>Ki Aarti</span>
                    </h3>

                    <p className="aarti-description">
                        A deeply cherished tradition of Sadgi Garba
                        Mahotsav — bringing the entire community
                        together in a moment of devotion, pride
                        and unity.
                    </p>

                    <div className="aarti-line"></div>

                    <p className="aarti-caption">
                        A moment that brings us together as one.
                    </p>

                </div>

                <div className="aarti-symbol">
                    ✦
                </div>

            </div>


            {/* OTHER SPECIALITIES */}

            <div className="specialities-grid">

                {specialities.map((item) => (

                    <div
                        className="speciality-card"
                        key={item.number}
                    >

                        <span className="speciality-number">
                            {item.number}
                        </span>

                        <div className="speciality-icon">
                            ✦
                        </div>

                        <h3>
                            {item.title}
                        </h3>

                        <p>
                            {item.text}
                        </p>

                    </div>

                ))}

            </div>

        </section>
    );
}

export default Specialities;