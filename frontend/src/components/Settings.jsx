import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"

export default function Settings({ onClose }) {

  const { user } = useAuth()

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  )

  const [notifications, setNotifications] = useState(true)

  /* Apply theme */

  useEffect(() => {

    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    )

    localStorage.setItem("theme", theme)

  }, [theme])

  /* Close on ESC */

  useEffect(() => {

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)

    return () => window.removeEventListener("keydown", handleEsc)

  }, [onClose])

  return (

    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-800 p-6 rounded-xl w-full max-w-md text-white shadow-xl"
      >

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl font-semibold">
            Settings
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition"
          >
            ✕
          </button>

        </div>

        {/* Content */}

        <div className="space-y-6">

          {/* Theme */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Theme
            </label>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-zinc-700 rounded px-3 py-2 outline-none"
            >

              <option value="dark">Dark</option>
              <option value="light">Light</option>

            </select>

          </div>

          {/* Notifications */}

          <div className="flex items-center justify-between">

            <span className="text-sm">
              Notifications
            </span>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition ${
                notifications
                  ? "bg-indigo-500"
                  : "bg-zinc-600"
              }`}
            >

              <div
                className={`w-5 h-5 bg-white rounded-full transform transition ${
                  notifications
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />

            </button>

          </div>

          {/* Profile */}

          <div>

            <label className="block text-sm font-medium mb-2">
              Profile
            </label>

            <div className="flex items-center gap-3">

              <img
                src={user?.avatar || "https://i.imgur.com/qGsYvAK.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />

              <div>

                <div className="font-medium">
                  {user?.email || "User"}
                </div>

                <div className="text-sm text-green-400">
                  Online
                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </div>

  )

}