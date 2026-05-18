interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({ input, setInput, isLoading, onSubmit }: ChatInputProps) {
  return (
    <div className="p-3 bg-[#F2F2F7] shrink-0 pb-safe">
      <form onSubmit={onSubmit} className="flex gap-2 items-end">
        <div className="flex-1 bg-white border border-gray-300 rounded-full flex items-center px-4 py-2 shadow-sm focus-within:border-[#007AFF] transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Mensaje de iMessage"
            className="w-full bg-transparent focus:outline-none text-[15px] py-1 text-black font-sans"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-[#007AFF] disabled:bg-gray-300 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-px">
            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
          </svg>
        </button>
      </form>
    </div>
  );
}