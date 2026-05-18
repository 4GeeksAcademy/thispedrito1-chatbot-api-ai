import { Message } from "../types/chat";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  errorMsj: string;
}

export default function ChatMessages({ messages, isLoading, errorMsj }: ChatMessagesProps) {
  return (
    <div className="chat-scroll flex-1 overflow-y-auto px-4 pb-6 pt-4 md:px-8">
      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-6">
      {messages.length === 0 && (
        <div className="rounded-2xl px-6 py-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2d3449]">
            <span className="text-2xl text-[#c3c0ff]">✦</span>
          </div>
          <p className="text-4xl font-semibold text-[#dae2fd]">Architectural Patterns</p>
          <p className="mt-2 text-2xl text-[#c7c4d8]/85">Resuming conversation. Context loaded successfully.</p>
        </div>
      )}

      {messages.map((msg, index) => (
        <div key={index} className={`pop-in flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div 
            className={`max-w-[88%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed md:max-w-[70%]
              ${msg.role === 'user' 
                ? 'rounded-tr-sm border border-[#464555]/20 bg-[#343d57] text-[#e5e9ff]' 
                : 'rounded-tl-sm border border-[#4f46e5]/20 bg-[#1d2540]/90 text-[#dae2fd]'}`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="rounded-2xl rounded-tl-sm border border-[#4f46e5]/15 bg-[#171f33]/85 px-5 py-4 text-sm text-[#c7c4d8]">
            Escribiendo respuesta...
          </div>
        </div>
      )}

      {errorMsj && (
        <div className="rounded-xl border border-[#93000a]/60 bg-[#93000a]/20 p-3 text-center text-sm text-[#ffdad6]">
          {errorMsj}
        </div>
      )}
      </div>
    </div>
  );
}