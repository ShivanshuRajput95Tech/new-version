import { memo, useCallback } from "react";
import Avatar from "./Avatar";

const Contact = ({
  userId,
  username = "User",
  selectedUserId,
  setSelectedUserId,
  isOnline = false,
  avatarLink
}) => {

  const isSelected = selectedUserId === userId;

  const handleSelect = useCallback(() => {
    setSelectedUserId?.(userId);
  }, [userId, setSelectedUserId]);

  return (
    <li
      onClick={handleSelect}
      className={`flex items-center gap-3 px-3 lg:px-5 py-2 lg:py-3 rounded-[1.3rem] capitalize cursor-pointer transition-colors
        ${isSelected ? "bg-blue-600" : "hover:bg-slate-700"}`}
    >
      <Avatar
        userId={userId}
        username={username}
        avatarLink={avatarLink}
        isOnline={isOnline}
      />

      <span className="flex-1 text-xs lg:text-base truncate">
        {username}
      </span>

      {isOnline && (
        <span className="text-[10px] lg:text-xs bg-green-500 px-2 py-0.5 rounded-full">
          Active
        </span>
      )}
    </li>
  );
};

export default memo(Contact);