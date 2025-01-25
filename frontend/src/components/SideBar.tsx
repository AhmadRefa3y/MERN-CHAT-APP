import { useEffect, useState } from "react";
import { Users, UserPlus } from "lucide-react";
import useAuthStore from "../store/authstore";
import SidebarSkeleton from "./SidebarSkeleton";
import AddContact from "./AddContact";
import useContactStore from "../store/contactStore";
import useChatStore from "../store/chatStore";

const Sidebar = () => {
  const { getContacts, contacts, isLoadingContacts } = useContactStore();
  const { setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  console.log(contacts);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  const filteredContacts = showOnlineOnly
    ? contacts.filter((contact) => onlineUsers.includes(contact._id))
    : contacts;

  if (isLoadingContacts) return <SidebarSkeleton />;

  return (
    <aside className="flex flex-col w-20 h-full transition-all duration-200 border-r lg:w-72 border-base-300">
      <div className="w-full p-5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="hidden font-medium lg:block">Contacts</span>
          </div>
          <button
            onClick={() =>
              (
                document.getElementById(
                  "add_contact_modal"
                ) as HTMLDialogElement
              )?.showModal()
            }
            className="btn btn-sm btn-ghost"
          >
            <UserPlus className="size-5" />
          </button>
        </div>
        <div className="items-center hidden gap-2 mt-3 lg:flex">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="w-full py-3 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <button
            key={contact._id}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
            `}
            onClick={() => setSelectedUser(contact)}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={contact.profilePic || "/avatar.png"}
                alt={contact.fullName}
                className="object-cover rounded-full size-12"
              />
              {onlineUsers.includes(contact._id) && (
                <span className="absolute bottom-0 right-0 bg-green-500 rounded-full size-3 ring-2 ring-zinc-900" />
              )}
            </div>
            <div className="hidden min-w-0 text-left lg:block">
              <div className="font-medium truncate">{contact.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(contact._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredContacts.length === 0 && (
          <div className="py-4 text-center text-zinc-500">
            No contacts found
          </div>
        )}
      </div>

      <AddContact />
    </aside>
  );
};

export default Sidebar;
