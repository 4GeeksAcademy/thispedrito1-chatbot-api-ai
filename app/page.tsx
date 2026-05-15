"use client";

import { useState, useEffect } from "react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface SessionStats {
  prompt: number;
  completion: number;
  total: number;
  modelName: string;
  time: number;
}

export default function GroqChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsj, setErrorMsj] = useState<string>("");
  
  // Nuevo estado para controlar el menú lateral en móviles
  const [showMobileStats, setShowMobileStats] = useState<boolean>(false);
  
  const [stats, setStats] = useState<SessionStats>({
    prompt: 0,
    completion: 0,
    total: 0,
    modelName: "-",
    time: 0
  });

  useEffect(() => {
    const savedChat = localStorage.getItem("groq_session_chat");
    const savedStats = localStorage.getItem("groq_session_stats");
    
    if (savedChat) setMessages(JSON.parse(savedChat));
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("groq_session_chat", JSON.stringify(messages));
      localStorage.setItem("groq_session_stats", JSON.stringify(stats));
    }
  }, [messages, stats]);

  const clearSession = () => {
    setMessages([]);
    setStats({ prompt: 0, completion: 0, total: 0, modelName: "-", time: 0 });
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

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", 
          messages: updatedMessages, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Error de conexión'}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content
      };
      
      setMessages([...updatedMessages, aiMessage]);

      setStats((prev) => ({
        prompt: prev.prompt + data.usage.prompt_tokens,
        completion: prev.completion + data.usage.completion_tokens,
        total: prev.total + data.usage.total_tokens,
        modelName: data.model,
        time: data.usage.total_time || 0 
      }));

    } catch (error: any) {
      console.error(error);
      setErrorMsj(error.message || "Ocurrió un problema de comunicación.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Usamos h-[100dvh] para que Safari/Chrome en móvil no tapen el input con la barra de navegación
    <div className="flex h-[100dvh] bg-white text-gray-900 font-sans overflow-hidden">
      
      {/* Overlay oscuro para móvil cuando el menú está abierto */}
      {showMobileStats && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={() => setShowMobileStats(false)}
        />
      )}

      {/* Sidebar de Métricas (Responsive: Drawer en móvil, Fijo en PC) */}
      <div className={`${showMobileStats ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 fixed md:relative z-50 w-4/5 md:w-1/4 lg:w-80 h-full bg-[#1C1C1E] p-6 border-r border-gray-800 flex flex-col justify-between text-white shadow-2xl md:shadow-none overflow-y-auto`}>
        <div>
          {/* Botón de cerrar solo visible en móvil */}
          <button 
            onClick={() => setShowMobileStats(false)}
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
                <span className="text-gray-400 block text-xs uppercase font-semibold mb-1">Tiempo de Inferencia</span>
                <span className="font-medium text-yellow-400">{stats.time.toFixed(3)} s</span>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={clearSession}
          className="mt-8 text-[#FF453A] bg-[#FF453A]/10 hover:bg-[#FF453A]/20 py-3 px-4 rounded-xl w-full transition font-semibold"
        >
          Borrar Conversación
        </button>
      </div>

      {/* Área Principal de Chat */}
      <div className="flex-1 flex flex-col bg-[#F2F2F7] w-full relative">
        
        {/* Cabecera del chat (Con botón de menú en móvil) */}
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 p-3 flex justify-between items-center z-10 sticky top-0 shrink-0">
          <button 
            onClick={() => setShowMobileStats(true)} 
            className="md:hidden text-[#007AFF] font-medium text-sm p-2 -ml-2"
          >
            📊 Stats
          </button>
          
          <div className="text-center flex-1">
            <h1 className="font-semibold text-[16px] leading-tight text-black">Asistente Llama 3.1</h1>
            <p className="text-[11px] text-gray-500">Groq Engine</p>
          </div>
          
          {/* Espaciador invisible para centrar el título en móvil */}
          <div className="w-16 md:hidden"></div>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20 text-sm">
              iMessage<br/>Hoy
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] md:max-w-[70%] px-4 md:px-5 py-2 md:py-3 text-[15px] leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-[#007AFF] text-white rounded-2xl rounded-br-sm' 
                    : 'bg-[#E5E5EA] text-black rounded-2xl rounded-bl-sm'}`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#E5E5EA] px-5 py-4 rounded-2xl rounded-bl-sm flex gap-1 items-center shadow-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}

          {errorMsj && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm border border-red-200 mx-4">
              {errorMsj}
            </div>
          )}
        </div>

        {/* Formulario de Input */}
        <div className="p-3 bg-[#F2F2F7] pb-safe shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <div className="flex-1 bg-white border border-gray-300 rounded-full flex items-center px-4 py-2 shadow-sm focus-within:border-[#007AFF] transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Mensaje de iMessage"
                className="w-full bg-transparent focus:outline-none text-[15px] py-1 text-black"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-[#007AFF] disabled:bg-gray-300 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0
