function PreviousEvents() {
    const videos = [
        {
            id: "RMSlstEdYZk",
            year: "2019",
            title: "The Grand Moment",
            description: "A beautiful glimpse of Sadgi Garba Mahotsav and the celebrations that brought everyone together.",
        },
        {
            id: "UEUV82ej0k0",
            year: "2022",
            title: "Sadgi Garba Highlights",
            description: "Relive the energy, music and unforgettable moments from the celebrations.",
        },
        {
            id: "AqTKwmc4pGI",
            year: "2022",
            title: "A Celebration To Remember",
            description: "Some of the most memorable moments from Sadgi Garba Mahotsav.",
        },
        {
            id: "uFE9lOEpQ5Q",
            year: "Previous Memories",
            title: "Moments of Togetherness",
            description: "A glimpse into the spirit, joy and togetherness of Sadgi Garba.",
        },
    ];

    return (
        <section className="previous-events-section" id="events">

            <div className="previous-events-heading">

                <p className="section-label">
                    ✦ MOMENTS FROM THE PAST ✦
                </p>

                <h2>
                    Memories That
                    <span>Stay With Us.</span>
                </h2>

                <p className="previous-events-intro">
                    Before we create new memories, let's look back at
                    the moments that made Sadgi Garba Mahotsav special.
                </p>

            </div>


            <div className="previous-events-grid">

                {videos.map((video) => (

                    <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="event-video-card"
                        key={video.id}
                    >

                        <div className="video-thumbnail">

                            <img
                                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                alt={video.title}
                            />

                            <div className="video-overlay"></div>

                            <div className="play-button">
                                ▶
                            </div>

                            <span className="video-year">
                                {video.year}
                            </span>

                        </div>


                        <div className="event-video-content">

                            <h3>
                                {video.title}
                            </h3>

                            <p>
                                {video.description}
                            </p>

                            <span className="watch-video">
                                WATCH VIDEO
                                <span> →</span>
                            </span>

                        </div>

                    </a>

                ))}

            </div>

        </section>
    );
}

export default PreviousEvents;