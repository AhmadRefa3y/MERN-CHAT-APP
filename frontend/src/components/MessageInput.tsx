import { useRef, useState } from "react";
import useChatStore from "../store/chatStore";
import { Image, Loader, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { sendMessage, isSendingMessage, typing } = useChatStore();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (!file?.type.startsWith("image")) {
            toast.error("Please select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!text && !imagePreview) {
            return;
        }
        try {
            await sendMessage({ text: text.trim(), image: imagePreview });
            setText("");
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            toast.error("Failed to send message");
        }
    };
    return (
        <div className="p-4 w-full">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
            >
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            typing();
                        }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />

                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                    type="submit"
                    className={`btn btn-sm btn-circle flex items-center justify-center ${
                        isSendingMessage && "animate-pulse"
                    }`}
                    disabled={
                        (!text.trim() && !imagePreview) || isSendingMessage
                    }
                >
                    {isSendingMessage ? (
                        <Loader className="size-4 animate-spin" />
                    ) : (
                        <Send size={22} />
                    )}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
