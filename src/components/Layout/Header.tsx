import React, {useState} from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import "./Header.scss";

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      <nav>
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
          <RxHamburgerMenu />
        </button>
        <ul className={`navbarList ${isOpen ? "open" : ""}`}>
          <li className="navbarItem">
            <a className="navLink" href="https://bradley-hill.com/" onClick={() => setIsOpen(false)}>
              Home Page
            </a>
          </li>
          <li className="navbarItem">
            <a className="navLink" href="https://bradley-hill.com/projects" onClick={() => setIsOpen(false)}>
              Projects
            </a>
          </li>
          <li className="navbarItem">
            <a className="navLink" href="/" onClick={() => setIsOpen(false)}>
              Forum
            </a>
          </li>
          <li className="navbarItem">
            <a className="navLink" href="/profile" onClick={() => setIsOpen(false)}>
              Profile
            </a>
          </li>
          <li className="navbarItem">
            <a className="navLink" href="/login" onClick={() => setIsOpen(false)}>
              Login
            </a>
          </li>
          <li className="navbarItem">
            <a className="navLink" href="/register" onClick={() => setIsOpen(false)}>
              Register
            </a>
          </li>
          <li className="navbarItem">
            <a className="navLink" href="/logout" onClick={() => setIsOpen(false)}>
              Logout
            </a>
          </li>
          <li className="navbarItem">
            <a className="navLink" href="/admin" onClick={() => setIsOpen(false)}>
              Admin
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
