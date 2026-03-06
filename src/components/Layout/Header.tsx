import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAuth } from "../../hooks/useAuth";
import "./Header.scss";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="navbar">
      <nav role="navigation" aria-label="Main navigation">
        <button
          className="hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="main-nav-list"
        >
          <RxHamburgerMenu />
        </button>
        <ul className={`navbarList ${isOpen ? "open" : ""}`} id="main-nav-list">
          <li className="navbarItem">
            <a
              className="navLink"
              href="https://bradley-hill.com/"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Home Page"
            >
              Home Page
            </a>
          </li>
          <li className="navbarItem">
            <a
              className="navLink"
              href="https://bradley-hill.com/projects"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Projects"
            >
              Projects
            </a>
          </li>
          <li className="navbarItem">
            <a
              className="navLink"
              href="/"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Forum"
            >
              Forum
            </a>
          </li>
          {isAuthenticated && (
            <>
              <li className="navbarItem">
                <a
                  className="navLink"
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  aria-label="Go to Profile"
                >
                  Profile
                </a>
              </li>
              {user?.role === "admin" && (
                <li className="navbarItem">
                  <a
                    className="navLink"
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    aria-label="Go to Admin"
                  >
                    Admin
                  </a>
                </li>
              )}
              <li className="navbarItem">
                <a
                  className="navLink"
                  href="/logout"
                  onClick={() => setIsOpen(false)}
                  aria-label="Go to Logout"
                >
                  Logout
                </a>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li className="navbarItem">
                <a
                  className="navLink"
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  aria-label="Go to Login"
                >
                  Login
                </a>
              </li>
              <li className="navbarItem">
                <a
                  className="navLink"
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  aria-label="Go to Register"
                >
                  Register
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
