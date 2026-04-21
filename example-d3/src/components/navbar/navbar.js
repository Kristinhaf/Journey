import "./navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <NavLink to="/" className="logo">
                    Journey
                </NavLink>
                <ul className="nav-links">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
