import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Journey from "./pages/Journey";

function Router() {
    return (
        <BrowserRouter>
            <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
                <Navbar />
                <div style={{ flex: 1, overflow: "hidden" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/journey" element={<Journey />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default Router;
