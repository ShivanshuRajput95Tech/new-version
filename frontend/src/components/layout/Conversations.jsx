import { useState, useMemo } from "react";

export default function Conversations({ onToggle }) {

  const users = [
    { id: 1, name: "Alice", lastMessage: "Last message preview...", time: "2m" },
    { id: 2, name: "Bob", lastMessage: "Last message preview...", time: "5m" },
    { id: 3, name: "Charlie", lastMessage: "Last message preview...", time: "10m" }
  ];

  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]);

  return (
    <div className="w-72 bg-zinc-850 border-r border-zinc-700 flex flex-col">

      {/* Header */}

      <div className="p-4 text-lg font-semibold flex items-center justify-between bg-zinc-800/50">
        <span>Chats</span>

        <button
          onClick={onToggle}
          className="lg:hidden text-white hover:bg-zinc-700 p-1 rounded transition"
        >
          ✕
        </button>
      </div>

      {/* Search */}

      <div className="p-4">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-700 rounded px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Chat List */}

      <div className="flex-1 overflow-y-auto">

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-400 p-6">
            No conversations found
          </div>
        )}

        {filteredUsers.map((user, index) => (
          <div
            key={user.id}
            className="px-4 py-3 hover:bg-zinc-700 cursor-pointer border-b border-zinc-700 transition-all duration-200 hover:scale-[1.02]"
            style={{ animationDelay: `${index * 0.05}s` }}
          >

            <div className="flex items-center gap-3">

              {/* Avatar */}

              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name[0]}
              </div>

              {/* User Info */}

              <div className="flex-1">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-zinc-400 truncate">
                  {user.lastMessage}
                </div>
              </div>

              {/* Time */}

              <div className="text-xs text-zinc-500">
                {user.time}
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}