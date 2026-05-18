import { SessionStats } from "../types/chat";

interface SidebarProps {
  stats: SessionStats;
  showMobileStats: boolean;
  onClose: () => void;
  onClearSession: () => void;
}

export default function Sidebar({ stats, showMobileStats, onClose, onClearSession }: SidebarProps) {
  return (
    <>
      {showMobileStats && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <div className={`${showMobileStats ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 fixed md:relative z-50 w-4/5 md:w-1/4 lg:w-80 h-full bg-[#1C1C1E] p-6 border-r border-gray-800 flex flex-col justify-between text-white shadow-2xl md:shadow-none overflow-y-auto`}>
        <div>
          <button 
            onClick={onClose}
            className="md:hidden mb-6 text-[#0A84FF] font-semibold flex items-center gap-2"
          >
            ← Volver al chat
          </button>

          <h2 className="text-lg font-semibold mb-6 text-gray-200 tracking-wide">Analíticas de Sesión</h2>
          
          <div className="space-y-4 text-sm">
            <div className="bg-[#2C2C2E] p-4 rounded-xl">
              <span className="text-gray-400 block text-xs uppercase font-semibold mb-1">Prompt Tokens</span>
              <span className="text-2xl font-medium">{stats.prompt}</span>
            </div>
            
            <div className="bg-[#2C2C2E] p-4 rounded-xl">
              <span className="text-gray-400 block text-xs uppercase font-semibold mb-1">Completion Tokens</span>
              <span className="text-2xl font-medium">{stats.completion}</span>
            </div>
            
            <div className="bg-[#0A84FF]/20 p-4 rounded-xl border border-[#0A84FF]/30">
              <span className="text-[#0A84FF] block text-xs uppercase font-semibold mb-1">Total Consumido</span>
              <span className="text-2xl font-medium text-[#0A84FF]">{stats.total}</span>
            </div>

            <div className="bg-[#2C2C2E] p-4 rounded-xl mt-6 border border-gray-700">
              <span className="text-gray-400 block text-xs uppercase font-semibold mb-1">Modelo Activo</span>
              <span className="font-medium text-purple-400 break-words">{stats.modelName}</span>
            </div>
            
            {stats.time > 0 && (
              <div className="bg-[#2C2C2E] p-4 rounded-xl border border-gray-700">
                <span className="text-gray-400 block text-xs uppercase font-semibold mb-1">Tiempo</span>
                <span className="font-medium text-yellow-400">{stats.time.toFixed(3)} s</span>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={onClearSession}
          className="mt-8 text-[#FF453A] bg-[#FF453A]/10 hover:bg-[#FF453A]/20 py-3 px-4 rounded-xl w-full transition font-semibold"
        >
          Borrar Conversación
        </button>
      </div>
    </>
  );
}