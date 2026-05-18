"use client";

import { useState, useEffect } from "react";
import { Message, SessionStats } from "../types/chat";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsj, setErrorMsj] = useState<string>("");
  const [showMobileStats, setShowMobileStats] = useState<boolean>(false);
  
  const [stats, setStats] = useState<SessionStats>({
    prompt: 0,
    completion: 0,
    total: 0,
    modelName: "Llama 3.1 8B",
    time: 0
  });

  // Cargar historial de localStorage al montar el componente
  useEffect(() => {
    const savedChat = localStorage.getItem("groq_session_chat");
    const savedStats = localStorage.getItem("groq_session_stats");
    if (savedChat) setMessages(JSON.parse(savedChat));
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  // Guardar en localStorage de forma reactiva cuando cambien los estados
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("groq_session_chat", JSON.stringify(messages));
      localStorage.setItem("groq_session_stats", JSON.stringify(stats));
    }
  }, [messages, stats]);

  // Resetear la sesión por completo
  const clearSession = () => {
    setMessages([]);
    setStats({ prompt: 0, completion: 0, total: 0, modelName: "Llama 3.1 8B", time: 0 });
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
      // Consumo de nuestra API interna apuntando a /api/chat
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      const aiMessage: Message = { role: "assistant", content: data.choices[0].message.content };
      setMessages([...updatedMessages, aiMessage]);

      // Mapeo seguro de las métricas de consumo de tokens del Groq Engine
      if (data.usage) {
        setStats((prev) => ({
          prompt: prev.prompt + (data.usage.prompt_tokens || 0),
          completion: prev.completion + (data.usage.completion_tokens || 0),
          total: prev.total + (data.usage.total_tokens || 0),
          modelName: data.model || prev.modelName,
          time: data.usage.total_time || 0 
        }));
      }

    } catch (error: any) {
      console.error(error);
      setErrorMsj(error.message || "Ocurrió un problema de comunicación.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] bg-white text-gray-900 font-sans overflow-hidden">
      
      {/* Orquestación de la Barra Lateral Inyectando Callbacks de Control */}
      <Sidebar 
        stats={stats} 
        showMobileStats={showMobileStats} 
        onClose={() => setShowMobileStats(false)} 
        onClearSession={clearSession} 
      />

      {/* Espacio del Contenedor iMessage Principal */}
      <div className="flex-1 flex flex-col bg-[#F2F2F7] w-full relative">
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
        />
      </div>

    </div>
  );
}