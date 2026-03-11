import { useState, useMemo } from "react";
import Contact from "./Contact";

export default function OnlineUsersList({
  onlinePeople = {},
  offlinePeople = {},
  selectedUserId,
  setSelectedUserId,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const search = searchTerm.toLowerCase();

  const filteredOnlinePeople = useMemo(() => {
    return Object.entries(onlinePeople).filter(([_, user]) =>
      (user?.username || "").toLowerCase().includes(search)
    );
  }, [onlinePeople, search]);

  const filteredOfflinePeople = useMemo(() => {
    return Object.entries(offlinePeople).filter(([_, user]) => {
      const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`;
      return fullName.toLowerCase().includes(search);
    });
  }, [offlinePeople, search]);

  return (
    <section className="w-[29%] py-3 border-r border-gray-600 px-2 lg:px-4 bg-zinc-900">

      {/* Search */}
      <div className="text-white flex items-center gap-2 p-1 px-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 hidden sm:block"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent outline-none text-white placeholder-gray-400"
        />
      </div>

      {/* Users */}
      <div className="max-h-[85vh] overflow-auto no-scrollbar">

        {filteredOnlinePeople.map(([userId, user]) => (
          <Contact
            key={userId}
            userId={userId}
            username={user.username}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            isOnline
            avatarLink={user.avatarLink}
          />
        ))}

        {filteredOfflinePeople.map(([_, user]) => (
          <Contact
            key={user._id}
            userId={user._id}
            username={`${user.firstName} ${user.lastName}`}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            isOnline={false}
            avatarLink={user.avatarLink}
          />
        ))}

      </div>
    </section>
  );
}