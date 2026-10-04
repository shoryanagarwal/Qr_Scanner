import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import OpenGarba from "./pages/OpenGarba";
import Admin from "./pages/Admin";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/about" element={<AboutPage />} />

                <Route path="/open-garba" element={<OpenGarba />} />

                <Route path="/admin" element={<Admin />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;