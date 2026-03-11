import { memo } from "react";

const links = [
  { label: "About", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Licensing", href: "#" },
  { label: "Contact", href: "#" }
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 shadow mx-4 rounded-lg">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">

        <div className="sm:flex sm:items-center sm:justify-between">

          {/* Logo */}
          <a
            href="/"
            className="flex items-center mb-4 sm:mb-0 space-x-3"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="SwiftChat Logo"
            />
            <span className="text-2xl font-semibold text-white">
              SwiftChat
            </span>
          </a>

          {/* Links */}
          <ul className="flex flex-wrap items-center text-sm font-medium text-gray-400">

            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:underline mr-4 md:mr-6"
                >
                  {link.label}
                </a>
              </li>
            ))}

          </ul>

        </div>

        <hr className="my-6 border-gray-700 lg:my-8" />

        {/* Copyright */}

        <span className="block text-sm text-center text-gray-400">
          © {year}{" "}
          <a href="/" className="hover:underline">
            SwiftChat
          </a>. All Rights Reserved.
        </span>

      </div>
    </footer>
  );
}

export default memo(Footer);