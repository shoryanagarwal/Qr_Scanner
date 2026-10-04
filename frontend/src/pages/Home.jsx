import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Specialities from "../components/Specialities";
import PreviousEvents from "../components/PreviousEvents";
import Thoughts from "../components/Thoughts";
import OrganizingTeam from "../components/OrgaanisizingTeam";

function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <About />
            <Specialities />
            <PreviousEvents />
            <Thoughts />
            <OrganizingTeam />
        </main>
    );
}

export default Home;