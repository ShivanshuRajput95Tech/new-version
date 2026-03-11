import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { memo } from "react";

const navLinks = [
  { label: "Developer", path: "/developer" },
  { label: "Design Studio", path: "/design" },
  { label: "Test Chat", path: "/test" },
  { label: "Contact", path: "#" }
];

function LandingNav() {
  const { isAuthenticated } = useAuth();

  return (
    <nav>
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">

        {/* Logo */}

        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Swift Chat Logo"
          />
          <span className="text-2xl font-semibold text-white whitespace-nowrap">
            Swift-Chat
          </span>
        </Link>

        {/* Mobile Menu Button */}

        <button
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>

          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 17 14"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Desktop Navigation */}

        <div className="hidden md:flex gap-3">

          <Link
            to={isAuthenticated ? "/chathome" : "/login"}
            className="py-1 px-2 text-white hover:text-slate-300 transition"
          >
            {isAuthenticated ? "Home" : "Login"}
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="py-1 px-2 text-white hover:text-slate-300 transition"
            >
              {link.label}
            </Link>
          ))}

        </div>

      </div>
    </nav>
  );
}

export default memo(LandingNav);