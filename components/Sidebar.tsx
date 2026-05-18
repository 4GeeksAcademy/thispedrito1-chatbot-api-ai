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
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`${showMobileStats ? "translate-x-0" : "translate-x-full pointer-events-none"} fixed inset-0 z-50 h-full w-full bg-[#060e20] p-6 text-[#dae2fd] transition-transform duration-300 xl:hidden`}>
        <div>
          <button
            onClick={onClose}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-[#44e2cd]"
          >
            ← Volver
          </button>

          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#dae2fd]">Token Dashboard</h3>
            <span className="text-[#44e2cd]">◉</span>
          </div>

          <div className="relative mb-5 overflow-hidden rounded-2xl border border-[#464555]/30 bg-[#131b2e]/90 p-5">
            <p className="mono-ui text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Current Session</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="mono-ui text-4xl font-bold text-[#c3c0ff]">{stats.total}</span>
              <span className="pb-1 text-sm text-[#c7c4d8]">tokens</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-[#464555]/20 bg-[#222a3d]/60 p-3">
              <span className="mono-ui block text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Prompt</span>
              <span className="mono-ui text-lg font-semibold text-[#dae2fd]">{stats.prompt}</span>
            </div>

            <div className="rounded-xl border border-[#464555]/20 bg-[#222a3d]/60 p-3">
              <span className="mono-ui block text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Completion</span>
              <span className="mono-ui text-lg font-semibold text-[#dae2fd]">{stats.completion}</span>
            </div>

            <div className="rounded-xl border border-[#464555]/20 bg-[#222a3d]/60 p-3">
              <span className="mono-ui block text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Requests</span>
              <span className="mono-ui text-lg font-semibold text-[#dae2fd]">{stats.requestCount}</span>
            </div>

            <div className="rounded-xl border border-[#464555]/20 bg-[#222a3d]/60 p-3">
              <span className="mono-ui block text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Avg Time</span>
              <span className="mono-ui text-lg font-semibold text-[#dae2fd]">{stats.averageTime.toFixed(2)}s</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#464555]/20 bg-[#171f33]/70 p-4">
            <span className="mono-ui block text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Active Engine</span>
            <span className="mt-1 block text-sm font-semibold text-[#c3c0ff] break-words">{stats.modelName}</span>
            <span className="mt-2 block text-xs text-[#c7c4d8]">Total Time: {stats.totalTime.toFixed(2)}s</span>
          </div>

          <button
            onClick={onClearSession}
            className="mt-6 w-full rounded-xl border border-[#93000a]/40 bg-[#93000a]/20 px-4 py-3 text-sm font-semibold text-[#ffdad6] transition hover:bg-[#93000a]/30"
          >
            Borrar Conversación
          </button>
        </div>
      </aside>

      <aside className="relative z-10 hidden h-full w-[255px] border-l border-[#464555]/20 bg-[#060e20]/80 p-5 text-[#dae2fd] backdrop-blur-xl xl:block">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[30px] font-semibold text-[#dae2fd]">Token Dashboard</h3>
            <span className="text-[#44e2cd]">◉</span>
          </div>

          <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#464555]/30 bg-[#131b2e]/90 p-5">
            <p className="mono-ui text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Current Session</p>
            <div className="mt-2 flex items-end gap-2">
              <span className="mono-ui text-5xl font-bold text-[#c3c0ff]">{stats.total}</span>
              <span className="pb-1 text-sm text-[#c7c4d8]">tokens</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3.5 text-sm">
            <div className="rounded-xl border border-[#464555]/20 bg-[#222a3d]/60 p-3">
              <span className="mono-ui block text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Prompt</span>
              <span className="mono-ui text-lg font-semibold text-[#dae2fd]">{stats.prompt}</span>
            </div>
            
            <div className="rounded-xl border border-[#464555]/20 bg-[#222a3d]/60 p-3">
              <span className="mono-ui block text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Completion</span>
              <span className="mono-ui text-lg font-semibold text-[#dae2fd]">{stats.completion}</span>
            </div>
            
            <div className="rounded-xl border border-[#464555]/20 bg-[#222a3d]/60 p-3">
              <span className="mono-ui block text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Requests</span>
              <span className="mono-ui text-lg font-semibold text-[#dae2fd]">{stats.requestCount}</span>
            </div>

            <div className="rounded-xl border border-[#464555]/20 bg-[#222a3d]/60 p-3">
              <span className="mono-ui block text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Avg Time</span>
              <span className="mono-ui text-lg font-semibold text-[#dae2fd]">{stats.averageTime.toFixed(2)}s</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#464555]/20 bg-[#171f33]/70 p-4">
            <span className="mono-ui block text-[10px] uppercase tracking-[0.2em] text-[#c7c4d8]">Active Engine</span>
            <span className="mt-1 block text-sm font-semibold text-[#c3c0ff] break-words">{stats.modelName}</span>
            <span className="mt-2 block text-xs text-[#c7c4d8]">Total Time: {stats.totalTime.toFixed(2)}s</span>
          </div>
            
          <button
            onClick={onClearSession}
            className="mt-6 w-full rounded-xl border border-[#93000a]/40 bg-[#93000a]/20 px-4 py-3 text-sm font-semibold text-[#ffdad6] transition hover:bg-[#93000a]/30"
          >
            Borrar Conversación
          </button>
        </div>
      </aside>
    </>
  );
}