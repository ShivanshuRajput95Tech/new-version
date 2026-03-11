import { memo } from "react"

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl"
}

const colors = [
  "bg-indigo-600",
  "bg-blue-600",
  "bg-green-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-orange-600"
]

function getInitials(name) {
  if (!name) return "?"

  const parts = name.trim().split(" ")
  if (parts.length === 1) return parts[0][0].toUpperCase()

  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function getColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

const Avatar = memo(
  ({
    name = "",
    src,
    size = "md",
    bgColor,
    textColor = "text-white",
    className = ""
  }) => {

    const safeName = typeof name === "string" ? name.trim() : ""

    const initials = getInitials(safeName)

    const sizeClass = sizeClasses[size] || sizeClasses.md

    const color = bgColor || getColor(safeName)

    if (src) {
      return (
        <img
          src={src}
          alt={safeName || "User avatar"}
          title={safeName || "User"}
          className={`${sizeClass} ${className} rounded-full object-cover`}
        />
      )
    }

    return (
      <div
        role="img"
        aria-label={safeName || "User avatar"}
        title={safeName || "User"}
        className={`${sizeClass} ${color} ${textColor} ${className} rounded-full flex items-center justify-center font-semibold select-none`}
      >
        {initials}
      </div>
    )
  }
)

Avatar.displayName = "Avatar"

export default Avatar