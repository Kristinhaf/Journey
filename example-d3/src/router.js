import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Journey from "./pages/Journey";

function Router() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/journey" element={<Journey />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
