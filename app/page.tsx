"use client";

import { useState, useEffect } from "react";
import { Message, SessionStats } from "../types/chat";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";

const INITIAL_STATS: SessionStats = {
  prompt: 0,
  completion: 0,
  total: 0,
  modelName: "Llama 3.1 8B",
  totalTime: 0,
  requestCount: 0,
  averageTime: 0,
};

function getFriendlyError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "No pudimos completar la solicitud. Intenta nuevamente en unos segundos.";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsj, setErrorMsj] = useState<string>("");
  const [showMobileStats, setShowMobileStats] = useState<boolean>(false);
  
  const [stats, setStats] = useState<SessionStats>(INITIAL_STATS);

  // Cargar historial de localStorage al montar el componente
  useEffect(() => {
    try {
      const savedChat = localStorage.getItem("groq_session_chat");
      const savedStats = localStorage.getItem("groq_session_stats");
      const parsedChat = savedChat ? (JSON.parse(savedChat) as Message[]) : null;
      let mergedStats: SessionStats | null = null;

      if (savedStats) {
        const parsedStats = JSON.parse(savedStats) as Partial<SessionStats> & { time?: number };
        mergedStats = {
          ...INITIAL_STATS,
          ...parsedStats,
          totalTime: parsedStats.totalTime ?? parsedStats.time ?? 0,
        };

        mergedStats.averageTime =
          mergedStats.requestCount > 0
            ? mergedStats.totalTime / mergedStats.requestCount
            : 0;
      }

      const hydrationTimer = window.setTimeout(() => {
        if (parsedChat) {
          setMessages(parsedChat);
        }
        if (mergedStats) {
          setStats(mergedStats);
        }
      }, 0);

      return () => window.clearTimeout(hydrationTimer);
    } catch {
      localStorage.removeItem("groq_session_chat");
      localStorage.removeItem("groq_session_stats");
    }
  }, []);

  // Guardar en localStorage de forma reactiva cuando cambien los estados
  useEffect(() => {
    localStorage.setItem("groq_session_chat", JSON.stringify(messages));
    localStorage.setItem("groq_session_stats", JSON.stringify(stats));
  }, [messages, stats]);

  // Resetear la sesión por completo
  const clearSession = () => {
    setMessages([]);
    setStats(INITIAL_STATS);
    localStorage.removeItem("groq_session_chat");
    localStorage.removeItem("groq_session_stats");
    setErrorMsj("");
    setShowMobileStats(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setErrorMsj("");
    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    const requestStartMs = Date.now();

    try {
      // Consumo de nuestra API interna apuntando a /api/chat
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.error ||
            "No fue posible obtener respuesta del asistente. Revisa tu conexión e intenta de nuevo."
        );
      }

      const data = await response.json();
      const aiContent = data?.choices?.[0]?.message?.content;
      if (!aiContent) {
        throw new Error("La API respondió sin contenido. Intenta nuevamente.");
      }

      const aiMessage: Message = { role: "assistant", content: aiContent };
      setMessages([...updatedMessages, aiMessage]);

      // Mapeo seguro de las métricas de consumo de tokens del Groq Engine
      setStats((prev) => {
        const elapsedSeconds = (Date.now() - requestStartMs) / 1000;
        const usage = data?.usage ?? {};
        const nextRequestCount = prev.requestCount + 1;
        const nextTotalTime = prev.totalTime + elapsedSeconds;

        return {
          prompt: prev.prompt + (usage.prompt_tokens || 0),
          completion: prev.completion + (usage.completion_tokens || 0),
          total: prev.total + (usage.total_tokens || 0),
          modelName: data.model || prev.modelName,
          totalTime: nextTotalTime,
          requestCount: nextRequestCount,
          averageTime: nextTotalTime / nextRequestCount,
        };
      });

    } catch (error: unknown) {
      console.error(error);
      setErrorMsj(getFriendlyError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const historyItems = messages
    .filter((msg) => msg.role === "user")
    .slice(-6)
    .reverse();

  return (
    <div className="relative flex h-[100dvh] w-full overflow-hidden bg-[#0b1326] text-[#dae2fd]">
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-20">
        <div className="h-[760px] w-[760px] rounded-full bg-indigo-500/40 blur-[120px]" />
      </div>

      <aside className="relative z-20 hidden h-full w-[210px] flex-col gap-2 border-r border-[#464555]/20 bg-[#131b2e]/90 p-3 backdrop-blur-2xl lg:flex">
        <div className="mb-4 px-2 py-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#c3c0ff]">thispedrito AI</h1>
        </div>

        <button
          onClick={clearSession}
          className="w-full rounded-xl px-4 py-2.5 text-left text-xs font-bold text-[#dae2fd] transition hover:bg-[#222a3d]"
        >
          ＋ New Chat
        </button>

        <div className="w-full rounded-xl bg-[#03c6b2] px-4 py-2.5 text-left text-xs font-bold text-[#004d44]">
          ↻ History
        </div>

        <div className="mt-3 flex-1 overflow-y-auto p-2">
          <p className="mono-ui mb-3 text-[9px] uppercase tracking-[0.2em] text-[#c7c4d8]/60">Today</p>
          <div className="space-y-2">
            {historyItems.length === 0 && (
              <div className="rounded-lg px-3 py-2 text-xs text-[#c7c4d8]">
                Aun no hay mensajes
              </div>
            )}
            {historyItems.map((msg, index) => (
              <div key={index} className="truncate rounded-lg px-3 py-2 text-xs text-[#dae2fd] hover:bg-[#222a3d]/60">
                □ {msg.content}
              </div>
            ))}
          </div>

          <p className="mono-ui mb-3 mt-6 text-[9px] uppercase tracking-[0.2em] text-[#c7c4d8]/60">Yesterday</p>
          <div className="rounded-lg px-3 py-2 text-xs text-[#c7c4d8]">□ Explain quantum computing...</div>
        </div>

        <div className="space-y-2 border-t border-[#464555]/20 p-2">
          <div className="rounded-lg px-3 py-2 text-xs text-[#c7c4d8]">⟡ Token Usage</div>
          <div className="rounded-lg px-3 py-2 text-xs text-[#c7c4d8]">⚙ Settings</div>
        </div>

        <div className="mt-auto flex items-center gap-3 border-t border-[#464555]/20 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-[#0b1326]">U</div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-[#dae2fd]">User profile</p>
            <p className="truncate text-[10px] text-[#c7c4d8]">Pro Plan</p>
          </div>
        </div>
      </aside>

      <main className="relative z-10 flex min-w-0 flex-1 flex-col">
        <ChatHeader onOpenStats={() => setShowMobileStats(true)} />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          errorMsj={errorMsj}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          totalTokens={stats.total}
        />
      </main>

      <Sidebar
        stats={stats}
        showMobileStats={showMobileStats}
        onClose={() => setShowMobileStats(false)}
        onClearSession={clearSession}
      />

    </div>
  );
}