import { useMemo, useState } from "react";
import {
  Phone,
  Video,
  Search,
  MoreHorizontal,
  Paperclip,
  Smile,
  Send,
  Info,
  Image as ImageIcon,
  Star,
  Share2,
  Users,
  FileText,
  Smartphone,
  Crosshair,
  MapPin,
  Trash2,
  ExternalLink,
  AlertCircle,
  Music,
  ListTodo,
  Folder,
  NotebookPen,
  Bell,
  X,
  Volume2,
  CameraOff,
  UserPlus,
  VideoOff,
  MicOff,
  Pause,
  Code,
  Plus,
} from "lucide-react";

const formatTime = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

function EmptyChatState({ title = "You’ve not chat yet !!" }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <div className="relative mb-4">
        <div className="w-36 h-36 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 animate-pulse" />
        <div className="absolute inset-0 m-auto w-20 h-20 rounded-2xl bg-white shadow flex items-center justify-center">
          <Send className="text-indigo-500" size={26} />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-slate-700">{title}</h2>
      <p className="text-sm text-slate-500 mt-2">There is no chat done yet. Click on a user to start chat.</p>
    </div>
  );
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function RightSidebar({ selectedUser, openModal }) {
  return (
    <aside className="hidden 2xl:flex w-[360px] bg-white border-l border-slate-200 p-5 flex-col gap-4 relative">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center text-2xl">
          {selectedUser ? `${selectedUser.firstName?.[0] || ""}${selectedUser.lastName?.[0] || ""}` : "L"}
        </div>
        <h4 className="mt-3 font-semibold text-slate-800">{selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : "Lea"}</h4>
        <p className="text-sm text-slate-400">+91 9860000004</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[Search, Users, Share2, Star].map((Icon, i) => (
          <button key={i} className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"><Icon size={16} className="mx-auto" /></button>
        ))}
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
        <h5 className="text-sm font-semibold text-slate-700 mb-2">Contact info</h5>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-center gap-2"><Smartphone size={14} /> +12 3456789587</li>
          <li className="flex items-center gap-2"><Crosshair size={14} /> https://pixelstrap</li>
          <li className="flex items-center gap-2"><MapPin size={14} /> 1766 Fidler Drive Texas, 78238.</li>
        </ul>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
        <ul className="space-y-3 text-sm text-slate-700">
          <li className="flex items-center justify-between"><span>Block</span><input type="checkbox" className="accent-indigo-500" /></li>
          <li className="flex items-center justify-between"><span>Mute</span><input type="checkbox" className="accent-indigo-500" /></li>
          <li className="flex items-center justify-between"><span>Get Notification</span><input type="checkbox" defaultChecked className="accent-indigo-500" /></li>
        </ul>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex items-center gap-2"><Share2 size={14} /> share Contact</li>
          <li className="flex items-center gap-2"><Trash2 size={14} /> Clear Chat</li>
          <li className="flex items-center gap-2"><ExternalLink size={14} /> Export Chat</li>
          <li className="flex items-center gap-2 text-rose-500"><AlertCircle size={14} /> Report Contact</li>
        </ul>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
        <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><FileText size={14} /> Shared Document</h5>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>Simple_practice_project.zip</li>
          <li>Word_Map.jpg</li>
          <li>Latest_Design_portfolio.pdf</li>
        </ul>
      </div>

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3">
        <h5 className="text-sm font-semibold text-slate-700 mb-2">Common groups</h5>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>Tech Ninjas</li>
          <li>Family Ties</li>
        </ul>
      </div>

      <div className="absolute top-5 -right-12 bg-white border border-slate-200 rounded-2xl px-2 py-3 shadow-lg flex flex-col gap-2">
        <button onClick={() => openModal("msg")} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"><Folder size={16} /></button>
        <button onClick={() => openModal("snippet")} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"><NotebookPen size={16} /></button>
        <button onClick={() => openModal("todo")} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"><ListTodo size={16} /></button>
        <button onClick={() => openModal("addContact")} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"><Plus size={16} /></button>
        <button onClick={() => openModal("callLog")} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"><Bell size={16} /></button>
      </div>

      <div className="mt-auto grid grid-cols-4 gap-2">
        {[Info, ImageIcon, Star, Search].map((Icon, i) => (
          <button key={i} className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"><Icon size={16} className="mx-auto" /></button>
        ))}
      </div>
    </aside>
  );
}

export default function ChatArea({ selectedUser, messages = [], onSendMessage, loading, mode, subMode }) {
  const [message, setMessage] = useState("");
  const [activeModal, setActiveModal] = useState(null);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [messages]
  );

  const submit = async () => {
    const trimmed = message.trim();
    if (!trimmed || !selectedUser || mode !== "chat" || subMode !== "direct") return;
    await onSendMessage(trimmed);
    setMessage("");
  };

  const showDirect = mode === "chat" && subMode === "direct";
  const showGroup = mode === "chat" && subMode === "group";
  const openModal = (name) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  return (
    <main className="flex-1 flex bg-slate-100 overflow-hidden">
      <section className="flex-1 flex flex-col min-w-0">
        <header className="h-20 px-6 bg-white border-b border-slate-200 flex items-center justify-between">
          {showGroup ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-600 text-white font-semibold flex items-center justify-center">TN</div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">Tech Ninjas</h3>
                  <p className="text-sm text-emerald-500">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><Search size={18} /></button>
                <button onClick={() => openModal("videoCall")} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><Video size={18} /></button>
                <button onClick={() => openModal("audioCall")} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><Phone size={18} /></button>
                <button onClick={() => openModal("conferenceCall")} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><MoreHorizontal size={18} /></button>
              </div>
            </>
          ) : selectedUser ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white font-semibold flex items-center justify-center">
                  {(selectedUser.firstName?.[0] || "") + (selectedUser.lastName?.[0] || "")}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-sm text-emerald-500">{selectedUser.status || "Online"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <button onClick={() => openModal("audioCall")} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><Phone size={18} /></button>
                <button onClick={() => openModal("videoCall")} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><Video size={18} /></button>
                <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><Search size={18} /></button>
                <button onClick={() => openModal("conferenceCall")} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><MoreHorizontal size={18} /></button>
              </div>
            </>
          ) : (
            <h3 className="text-slate-500 font-medium">Select a conversation to start messaging</h3>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)]">
          {!showDirect && !showGroup && <EmptyChatState />}

          {showGroup && <EmptyChatState title="Group conversation is empty" />}

          {showDirect && (
            <>
              {loading && <p className="text-sm text-slate-400">Loading messages...</p>}
              {!loading && selectedUser && !sortedMessages.length && <p className="text-sm text-slate-400">No messages yet. Send the first message.</p>}

              {sortedMessages.map((item) => {
                const mine = item.isMine;
                return (
                  <div key={item._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[72%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${mine ? "bg-indigo-500 text-white rounded-br-md" : "bg-white text-slate-700 border border-slate-200 rounded-bl-md"}`}>
                        {item.text}
                      </div>
                      <span className="text-xs text-slate-400 mt-1">{formatTime(item.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="p-5 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 bg-slate-50">
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-200"><Paperclip size={18} /></button>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder={showDirect && selectedUser ? "Write your message..." : "Select Direct chat/user first"}
              disabled={!(showDirect && selectedUser)}
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 disabled:opacity-50"
            />
            <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-200"><Smile size={18} /></button>
            <button onClick={submit} disabled={!(showDirect && selectedUser)} className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 disabled:opacity-60"><Send size={16} /></button>
          </div>
        </div>
      </section>

      <RightSidebar selectedUser={selectedUser} openModal={openModal} />

      <Modal open={activeModal === "snippet"} title={<><Code size={16} /> Code snippets</>} onClose={closeModal}>
        <div className="space-y-3 text-sm">
          <input className="w-full border border-slate-200 rounded-xl px-3 py-2" placeholder="title(optional)" />
          <select className="w-full border border-slate-200 rounded-xl px-3 py-2 bg-white">
            <option>ebnf</option>
            <option>c++</option>
            <option>diff</option>
            <option>dart</option>
          </select>
          <textarea rows={5} className="w-full border border-slate-200 rounded-xl px-3 py-2" />
          <input className="w-full border border-slate-200 rounded-xl px-3 py-2" placeholder="add comment (optional)" />
          <div className="flex justify-end gap-2">
            <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-rose-500 text-white">Cancel</button>
            <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-indigo-500 text-white">Create & post</button>
          </div>
        </div>
      </Modal>

      <Modal open={activeModal === "audioCall"} title="Audio call" onClose={closeModal}>
        <div className="text-center space-y-4">
          <div className="text-xl font-semibold">Josephin water</div>
          <p className="text-slate-500">log angelina california</p>
          <div className="flex items-center justify-center gap-3">
            <button className="w-12 h-12 rounded-full bg-emerald-500 text-white grid place-items-center"><Phone size={18} /></button>
            <button onClick={closeModal} className="w-12 h-12 rounded-full bg-rose-500 text-white grid place-items-center"><Phone size={18} /></button>
          </div>
        </div>
      </Modal>

      <Modal open={activeModal === "videoCall"} title="Video call" onClose={closeModal}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Josephin water</h4>
              <p className="text-sm text-slate-500">America, California</p>
            </div>
            <div className="text-sm text-slate-500">00:00:00</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[Pause, Phone, MicOff].map((Icon, i) => (
              <button key={i} className={`h-11 rounded-xl ${i === 1 ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-700"} grid place-items-center`}><Icon size={18} /></button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={activeModal === "conferenceCall"} title="Conference call" onClose={closeModal}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Incoming Call • Conference Call</p>
          <div className="grid grid-cols-4 gap-2">
            {[Volume2, CameraOff, UserPlus, VideoOff, MicOff, Pause, Phone].map((Icon, i) => (
              <button key={i} className={`h-10 rounded-lg ${Icon === Phone ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-700"} grid place-items-center`}><Icon size={16} /></button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={activeModal === "addContact"} title="Add Contact" onClose={closeModal}>
        <div className="space-y-3">
          <input className="w-full border border-slate-200 rounded-xl px-3 py-2" placeholder="Email or Username" />
          <input className="w-full border border-slate-200 rounded-xl px-3 py-2" placeholder="Contact number" />
          <div className="flex justify-end gap-2">
            <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-rose-500 text-white">Cancel</button>
            <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-indigo-500 text-white">Add contact</button>
          </div>
        </div>
      </Modal>

      <Modal open={activeModal === "todo"} title="Create To-Do" onClose={closeModal}>
        <div className="space-y-3">
          <input className="w-full border border-slate-200 rounded-xl px-3 py-2" placeholder="Fill Your Feelings" />
          <div className="grid grid-cols-2 gap-2">
            <select className="border border-slate-200 rounded-xl px-3 py-2 bg-white">
              <option>Assign To</option>
              <option>Josephin john</option>
              <option>Lynetin john</option>
            </select>
            <input type="date" className="border border-slate-200 rounded-xl px-3 py-2" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-indigo-500 text-white">Save</button>
            <button onClick={closeModal} className="px-4 py-2 rounded-lg bg-rose-500 text-white">Cancel</button>
          </div>
        </div>
      </Modal>

      <Modal open={activeModal === "msg"} title="Create New Message" onClose={closeModal}>
        <div className="space-y-3">
          <input className="w-full border border-slate-200 rounded-xl px-3 py-2" placeholder="Search" />
          <ul className="max-h-64 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
            {["Josephin water", "Jony Lynetin", "Sufiya Elija", "Mukrani Pabelo"].map((name, i) => (
              <li key={name} className={`p-3 flex items-center justify-between ${i === 1 ? "bg-indigo-50" : ""}`}>
                <div>
                  <p className="font-medium text-slate-700">{name}</p>
                  <p className="text-xs text-slate-500">Hi, i am {name.split(" ")[0]}.</p>
                </div>
                <span className="text-xs text-slate-400">{i + 2}:00 pm</span>
              </li>
            ))}
          </ul>
        </div>
      </Modal>

      <Modal open={activeModal === "callLog"} title="Call logs" onClose={closeModal}>
        <ul className="space-y-2">
          {["3:30 pm", "3:10 pm", "3:00 pm"].map((time, i) => (
            <li key={time + i} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-700">Jony Lynetin</p>
                <p className="text-sm text-slate-500">{time}</p>
              </div>
              <button className={`w-9 h-9 rounded-full ${i === 2 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"} grid place-items-center`}>
                {i % 2 === 0 ? <Phone size={15} /> : <Video size={15} />}
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </main>
  );
}
