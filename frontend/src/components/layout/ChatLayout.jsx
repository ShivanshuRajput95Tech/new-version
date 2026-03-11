import { useState } from "react";
import Sidebar from "./Sidebar";
import Conversations from "./Conversations";
import ChatArea from "../chat/ChatArea";

export default function ChatLayout() {

  const [activePanel, setActivePanel] = useState(null);
  // null | "sidebar" | "conversations"

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const closePanels = () => setActivePanel(null);

  return (
    <div className="flex h-screen bg-zinc-900 text-white">

      {/* Mobile Toggle */}

      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => togglePanel("sidebar")}
          className="bg-zinc-800 p-2 rounded-lg"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}

      <div
        className={`
          fixed md:static inset-y-0 left-0 z-40
          transform transition-transform duration-300
          ${activePanel === "sidebar" ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar onClose={closePanels} />
      </div>

      {/* Conversations */}

      <div
        className={`
          fixed lg:static inset-y-0 left-20 lg:left-0 z-30
          transform transition-transform duration-300
          ${
            activePanel === "conversations"
              ? "translate-x-0"
              : "-translate-x-full"
          }
          lg:translate-x-0
        `}
      >
        <Conversations onToggle={() => togglePanel("conversations")} />
      </div>

      {/* Chat Area */}

      <div className="flex-1">
        <ChatArea />
      </div>

      {/* Overlay */}

      {activePanel && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-20"
          onClick={closePanels}
        />
      )}

    </div>
  );
}