export default function ChatHeader({ onOpenStats }: { onOpenStats: () => void }) {
  return (
    <div className="sticky top-0 z-20 shrink-0 border-b border-[#464555]/20 bg-[#131b2e]/85 px-4 py-3 backdrop-blur-xl lg:border-b-0 lg:bg-transparent lg:px-8 lg:py-5">
      <div className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-3">
      <button 
        onClick={onOpenStats} 
        className="rounded-lg border border-[#464555]/60 bg-[#222a3d] px-3 py-1.5 text-xs font-semibold text-[#c7c4d8] transition hover:bg-[#2d3449] xl:hidden"
      >
        Stats
      </button>
      
      <div className="min-w-0 flex-1 text-center">
        <h1 className="truncate text-[15px] font-semibold tracking-tight text-[#dae2fd] lg:text-[38px] lg:font-bold lg:text-transparent lg:[-webkit-text-stroke:1px_rgba(218,226,253,0.16)]">thispedrito prototype chatbot ai</h1>
        <p className="text-[11px] text-[#c7c4d8] lg:text-base lg:text-[#c7c4d8]/60">Groq realtime session</p>
      </div>

      <div className="w-[58px] lg:w-[72px]" />
      </div>
    </div>
  );
}