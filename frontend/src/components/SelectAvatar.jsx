import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"

const SelectAvatar = ({ setSelectedLink, selectedLink }) => {

  const [avatars, setAvatars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {

    const controller = new AbortController()

    const fetchAvatars = async () => {
      try {

        const response = await axios.get("/api/avatar/all", {
          signal: controller.signal
        })

        setAvatars(response.data)

      } catch (err) {

        if (!axios.isCancel(err)) {
          console.error(err)
          setError("Failed to load avatars")
        }

      } finally {
        setLoading(false)
      }
    }

    fetchAvatars()

    return () => controller.abort()

  }, [])

  const handleSelect = useCallback((link) => {
    setSelectedLink(link)
  }, [setSelectedLink])

  return (

    <div className="mb-4">

      <label className="block mb-2 text-sm font-medium text-white">
        Select Avatar
      </label>

      {/* Loading */}

      {loading && (
        <div className="text-gray-400 text-sm">
          Loading avatars...
        </div>
      )}

      {/* Error */}

      {error && (
        <div className="text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Avatar Grid */}

      {!loading && !error && (

        <div className="grid grid-cols-4 gap-4">

          {avatars.map((avatar) => {

            const isSelected = selectedLink === avatar.link

            return (

              <button
                key={avatar._id}
                type="button"
                onClick={() => handleSelect(avatar.link)}
                className={`relative cursor-pointer border-2 rounded-lg p-2 transition-all duration-200 hover:scale-105 ${
                  isSelected
                    ? "border-blue-500"
                    : "border-gray-600 hover:border-gray-400"
                }`}
              >

                <img
                  src={avatar.link}
                  alt="avatar"
                  loading="lazy"
                  className="w-full aspect-square object-cover rounded-md"
                />

                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500/20 rounded-lg pointer-events-none"/>
                )}

              </button>

            )

          })}

        </div>

      )}

    </div>

  )

}

export default SelectAvatar