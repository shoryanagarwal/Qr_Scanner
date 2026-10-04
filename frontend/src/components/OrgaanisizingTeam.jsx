import jeetuImage from "../assets/jeetuJirati.png";
import nileshImage from "../assets/NileshChoudhary.png";

function OrganizingTeam() {
    const team = [
        {
            image: jeetuImage,
            hindiRole: "आयोजक",
            role: "ORGANIZER",
            name: "Jeetu Jirati",
        },
        {
            image: nileshImage,
            hindiRole: "संयोजक",
            role: "COORDINATOR",
            name: "Nilesh Choudhary",
        },
    ];

    return (
        <section className="organizing-section" id="team">

            <div className="organizing-decoration top-decoration">
                <span></span>
                <b>✦</b>
                <span></span>
            </div>

            <div className="organizing-heading">

                <p className="section-label">
                    ✦ आयोजक मंडल &nbsp; | &nbsp; ORGANIZING TEAM ✦
                </p>

                <h2>
                    The People Behind
                    <span>Sadgi Garba Mahotsav.</span>
                </h2>

                <p className="organizing-intro">
                    इस उत्सव को यादगार बनाने के पीछे समर्पण,
                    सहयोग और सेवा की भावना है।
                </p>

                <p className="organizing-intro english">
                    A celebration made possible through dedication,
                    teamwork and togetherness.
                </p>

            </div>


            <div className="organizing-team-grid">

                {team.map((member) => (

                    <div className="organizer-card" key={member.name}>

                        <div className="organizer-photo-frame">

                            <div className="organizer-photo-inner">

                                <img
                                    src={member.image}
                                    alt={member.name}
                                />

                            </div>

                        </div>


                        <div className="organizer-info">

                            <p className="organizer-hindi-role">
                                {member.hindiRole}
                            </p>

                            <p className="organizer-role">
                                {member.role}
                            </p>

                            <div className="organizer-divider">
                                <span>◆</span>
                            </div>

                            <h3>
                                {member.name}
                            </h3>

                        </div>

                    </div>

                ))}

            </div>


            <div className="organizing-decoration bottom-decoration">
                <span></span>
                <b>✦</b>
                <span></span>
            </div>

        </section>
    );
}

export default OrganizingTeam;