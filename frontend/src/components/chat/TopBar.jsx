import { useMemo } from "react";

export default function TopBar({
  setSelectedUserId,
  selectedUserId,
  offlinePeople = {},
  onlinePeople = {},
}) {

  const { name, isOnline } = useMemo(() => {
    const onlineUser = onlinePeople[selectedUserId];

    if (onlineUser) {
      return {
        name: onlineUser.username,
        isOnline: true
      };
    }

    const offlineUser = offlinePeople[selectedUserId];

    return {
      name: offlineUser?.firstName || "User",
      isOnline: false
    };
  }, [selectedUserId, onlinePeople, offlinePeople]);

  return (
    <div className="absolute right-2 text-white w-full py-5 bg-zinc-800 rounded-lg px-4 flex items-center justify-between">

      {/* Back button */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 cursor-pointer"
        role="button"
        onClick={() => setSelectedUserId(null)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>

      {/* User info */}
      <span>{name}</span>

      {/* Status indicator */}
      <span
        className={`h-3 w-3 rounded-full ${
          isOnline ? "bg-green-500" : "bg-gray-500"
        }`}
      />

    </div>
  );
}