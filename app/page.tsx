"use client";

import { useState, useEffect } from "react";

export default function GroqChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsj, setErrorMsj] = useState("");
  
  const [stats, setStats] = useState({
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setErrorMsj("");
    const userMessage = { role: "user", content: input };
    
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
        // Leemos el JSON del error para saber EXACTAMENTE qué falló
        const errorData = await response.json();
        console.error("Detalles del servidor Groq:", errorData);
        throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Revisa la consola'}`);
      }

      const data = await response.json();
      
      const aiMessage = data.choices[0].message;
      setMessages([...updatedMessages, aiMessage]);

      setStats((prev) => ({
        prompt: prev.prompt + data.usage.prompt_tokens,
        completion: prev.completion + data.usage.completion_tokens,
        total: prev.total + data.usage.total_tokens,
        modelName: data.model,
        time: data.usage.total_time || 0 
      }));

    } catch (error) {
      console.error(error);
      setErrorMsj("Ocurrió un problema de comunicación con el modelo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">
      
      {/* Sidebar de Métricas (Mantenemos un tono oscuro elegante para contrastar) */}
      <div className="w-1/4 bg-[#1C1C1E] p-6 border-r border-gray-800 flex flex-col justify-between text-white">
        <div>
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

            <div className="bg-[#2C2C2E] p-4 rounded-xl mt-6">
              <span className="text-gray-400 block text-xs uppercase font-semibold mb-1">Modelo Activo</span>
              <span className="font-medium text-purple-400">{stats.modelName}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={clearSession}
          className="mt-8 text-[#FF453A] bg-[#FF453A]/10 hover:bg-[#FF453A]/20 py-3 px-4 rounded-xl w-full transition font-semibold"
        >
          Borrar Conversación
        </button>
      </div>

      {/* Área Principal de Chat (Estilo iOS) */}
      <div className="w-3/4 flex flex-col bg-[#F2F2F7]">
        {/* Cabecera del chat */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 text-center z-10 sticky top-0">
          <h1 className="font-semibold text-lg">Asistente Llama 3</h1>
          <p className="text-xs text-gray-500">Groq Engine</p>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20 text-sm">
              iMessage<br/>Hoy
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[70%] px-5 py-3 text-[15px] leading-relaxed shadow-sm
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
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm border border-red-200">
              {errorMsj}
            </div>
          )}
        </div>

        {/* Formulario de Input (Estilo iMessage) */}
        <div className="p-4 bg-[#F2F2F7]">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1 bg-white border border-gray-300 rounded-full flex items-center px-4 py-2 shadow-sm focus-within:border-[#007AFF] transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Mensaje de iMessage"
                className="w-full bg-transparent focus:outline-none text-[15px] py-1"
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
      </div>

    </div>
  );
}