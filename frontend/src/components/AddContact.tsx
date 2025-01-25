import { Search, UserPlus, X } from "lucide-react";
import { useState } from "react";
import useContactStore from "../store/contactStore";

const AddContact = () => {
  const [email, setEmail] = useState("");
  const {
    searchUserByEmail,
    searchResults,
    isSearching,
    addContact,
    isAddingContact,
    getContacts,
  } = useContactStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      searchUserByEmail(email.trim());
    }
  };

  const handleAddContact = async (contactId: string) => {
    await addContact(contactId);
    await getContacts();
    setEmail("");
    useContactStore.setState({ searchResults: null });
    closeModal();
  };

  const closeModal = () => {
    setEmail("");
    useContactStore.setState({ searchResults: null });
    (
      document.getElementById("add_contact_modal") as HTMLDialogElement
    )?.close();
  };

  return (
    <dialog id="add_contact_modal" className="modal">
      <div className="modal-box max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="sticky top-0 flex items-center justify-between pt-1 mb-4 bg-base-100">
          <h3 className="text-lg font-bold">Add New Contact</h3>
          <button onClick={closeModal} className="btn btn-sm btn-ghost">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex w-full gap-2">
          <input
            type="email"
            placeholder="Search by email..."
            className="w-full input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn shrink-0" disabled={isSearching}>
            <Search className="size-5" />
          </button>
        </form>

        {searchResults && (
          <div className="p-3 mt-4 border rounded-lg border-base-300">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center min-w-0 gap-3">
                <img
                  src={searchResults.profilePic || "/avatar.png"}
                  alt={searchResults.fullName}
                  className="rounded-full size-10 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-medium truncate">
                    {searchResults.fullName}
                  </h3>
                  <p className="text-sm truncate text-base-content/70">
                    {searchResults.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAddContact(searchResults._id)}
                className="btn btn-primary"
                disabled={isAddingContact}
              >
                <UserPlus className="size-5" />
                Add Contact
              </button>
            </div>
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </dialog>
  );
};

// Add this to your global CSS file (src/index.css or equivalent)
const styles = `
@layer utilities {
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default AddContact;
