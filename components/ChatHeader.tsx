export default function ChatHeader({ onOpenStats }: { onOpenStats: () => void }) {
  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 p-3 flex justify-between items-center z-10 sticky top-0 shrink-0">
      <button 
        onClick={onOpenStats} 
        className="md:hidden text-[#007AFF] font-medium text-sm p-2 -ml-2"
      >
        📊 Stats
      </button>
      
      <div className="text-center flex-1">
        <h1 className="font-semibold text-[16px] leading-tight text-black">Asistente Llama 3.1</h1>
        <p className="text-[11px] text-gray-500">Groq Engine</p>
      </div>
      
      <div className="w-16 md:hidden"></div>
    </div>
  );
}