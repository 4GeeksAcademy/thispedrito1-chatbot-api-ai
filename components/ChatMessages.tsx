import { Message } from "../types/chat";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  errorMsj: string;
}

export default function ChatMessages({ messages, isLoading, errorMsj }: ChatMessagesProps) {
  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-20 text-sm font-sans">
          iMessage<br/>Hoy
        </div>
      )}

      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div 
            className={`max-w-[85%] md:max-w-[70%] px-4 md:px-5 py-2 md:py-3 text-[15px] leading-relaxed shadow-sm font-sans
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
  );
}