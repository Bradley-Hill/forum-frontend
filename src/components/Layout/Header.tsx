import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAuth } from "../../hooks/useAuth";
import UserStatus from "../Shared/UserStatus";
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
            <Link
              className="navLink"
              to="/"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Forum"
            >
              Forum
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li className="navbarItem">
                <Link
                  className="navLink"
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  aria-label="Go to Profile"
                >
                  Profile
                </Link>
              </li>
              {user?.role === "admin" && (
                <li className="navbarItem">
                  <Link
                    className="navLink"
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    aria-label="Go to Admin"
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li className="navbarItem">
                <Link
                  className="navLink"
                  to="/logout"
                  onClick={() => setIsOpen(false)}
                  aria-label="Go to Logout"
                >
                  Logout
                </Link>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li className="navbarItem">
                <Link
                  className="navLink"
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  aria-label="Go to Login"
                >
                  Login
                </Link>
              </li>
            </>
          )}
        </ul>
        {isAuthenticated && (
          <div className="navbar-user-status">
            <UserStatus />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
