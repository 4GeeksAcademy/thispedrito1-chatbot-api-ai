interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  totalTokens: number;
}

export default function ChatInput({ input, setInput, isLoading, onSubmit, totalTokens }: ChatInputProps) {
  return (
    <div className="shrink-0 w-full bg-[#0b1326] px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-2 md:px-6 md:pt-3">
      <form onSubmit={onSubmit} className="mx-auto w-full max-w-[820px] rounded-2xl border border-[#464555]/40 bg-[#222a3d]/88 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl transition focus-within:border-[#4f46e5]/50">
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="rounded-xl p-3 text-[#c7c4d8] transition hover:bg-[#2d3449] hover:text-[#dae2fd]"
            aria-label="Adjuntar"
          >
            <span className="text-xl">+</span>
          </button>

          <div className="flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Message thispedrito AI..."
            className="w-full bg-transparent px-1 py-3 text-[15px] font-medium text-[#dae2fd] placeholder:text-[#c7c4d8]/40 outline-none md:text-[22px]"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="rounded-xl bg-[#c3c0ff] p-3 text-[#1d00a5] transition hover:brightness-105 disabled:bg-[#464555] disabled:text-[#918fa1]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
          </svg>
        </button>
        </div>

        <div className="flex items-center justify-between px-3 pb-1 pt-2">
          <span className="text-[10px] text-[#c7c4d8]/75">AI can make mistakes. Verify critical code.</span>
          <span className="mono-ui rounded-full border border-[#03c6b2]/30 bg-[#03c6b2]/10 px-2 py-0.5 text-[10px] text-[#44e2cd]">
            {totalTokens} Tokens
          </span>
        </div>
      </form>
    </div>
  );
}