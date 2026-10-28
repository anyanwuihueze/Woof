import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Info
} from 'lucide-react';
import { Match, Message, OwnerProfile, Dog } from '../types';
import { storageService } from '../services/storageService';

interface ChatModalProps {
  match: Match | null;
  currentUser: OwnerProfile;
  activeDog: Dog;
  onClose: () => void;
  onOpenDogDetail: (dog: Dog) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  match,
  currentUser,
  activeDog,
  onClose,
  onOpenDogDetail,
}) => {
  if (!match) return null;

  const targetDog = match.targetDog;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = () => {
    const list = storageService.getMessages(match.id);
    setMessages(list);
  };

  useEffect(() => {
    loadMessages();

    // Listen for incoming simulated replies
    const handleIncomingMessage = (e: any) => {
      if (e.detail?.matchId === match.id) {
        setIsTyping(false);
        setMessages(prev => [...prev, e.detail.message]);
      }
    };

    window.addEventListener('pawmatch_message_received', handleIncomingMessage);
    return () => window.removeEventListener('pawmatch_message_received', handleIncomingMessage);
  }, [match.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg = storageService.sendMessage(
      match.id,
      currentUser.id,
      targetDog.ownerId,
      text
    );

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);
  };

  const quickIcebreakers = [
    `Hi ${targetDog.ownerName}! ${activeDog.name} would love to meet ${targetDog.name} for a park playdate!`,
    `Are you free for an outdoor walk this Saturday morning?`,
    `How does ${targetDog.name} usually interact with ${activeDog.size.toLowerCase()} dogs?`,
    `Which dog-friendly park in ${targetDog.location.area} do you recommend?`
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#E8F0E9] overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header: Matched Dog & Owner */}
        <div className="p-4 border-b border-[#E8F0E9] bg-[#FAF7F0] flex items-center justify-between gap-3">
          
          <button
            onClick={() => onOpenDogDetail(targetDog)}
            className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity cursor-pointer min-w-0"
            title="View dog details"
          >
            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 border border-[#E8F0E9] shrink-0">
              <img
                src={targetDog.photos[0]}
                alt={targetDog.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base text-[#194B38] truncate">{targetDog.name}</span>
                <span className="text-xs text-[#536B60]">({targetDog.breed})</span>
              </div>
              <p className="text-[11px] text-[#536B60] truncate">
                Owner: {targetDog.ownerName} · {targetDog.location.area}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenDogDetail(targetDog)}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#536B60] hover:text-[#194B38] hover:bg-white rounded-xl transition-colors cursor-pointer"
              title="Dog Details"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-[#536B60] hover:text-[#DC2626] hover:bg-white rounded-xl transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Safety Guidance Reminder Banner */}
        <div className="bg-[#E8F0E9] border-b border-[#D1E0D3] px-4 py-2 text-[11px] text-[#194B38] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#194B38] shrink-0" />
          <span>
            <strong>Safe Meetup Protocol:</strong> Meet in daylight public parks on leash first. Do not exchange banking details or exact residential addresses.
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7F0]">
          
          {/* Conversation Beginning Indicator */}
          <div className="text-center py-4 space-y-1">
            <div className="w-8 h-8 rounded-full bg-white border border-[#E8F0E9] text-[#194B38] flex items-center justify-center mx-auto text-xs font-bold shadow-2xs">
              🐾
            </div>
            <p className="font-serif text-sm font-bold text-[#194B38]">
              You matched with {targetDog.name} & {targetDog.ownerName}
            </p>
            <p className="text-[11px] text-[#536B60]">
              Start with a polite introduction about your dog's temperament and favorite parks.
            </p>
          </div>

          {/* Render Messages */}
          {messages.map(msg => {
            const isMe = msg.senderId === currentUser.id;
            const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isMe
                      ? 'bg-[#194B38] text-white rounded-br-xs'
                      : 'bg-white text-[#24352D] border border-[#E8F0E9] rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-[#536B60] px-1 mt-0.5">
                  {timeStr}
                </span>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 text-xs text-[#536B60] bg-white px-3 py-1.5 rounded-full border border-[#E8F0E9] w-fit animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#194B38] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#194B38] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#194B38] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] ml-1">{targetDog.ownerName} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Icebreakers Carousel */}
        {messages.length <= 2 && (
          <div className="p-2.5 bg-white border-t border-[#E8F0E9] overflow-x-auto whitespace-nowrap flex gap-2">
            {quickIcebreakers.map((icebreaker, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(icebreaker)}
                className="text-[11px] text-[#194B38] bg-[#FAF7F0] hover:bg-[#E8F0E9] border border-[#E8F0E9] rounded-full px-3 py-1.5 transition-colors cursor-pointer shrink-0"
              >
                {icebreaker}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E8F0E9] flex items-center gap-2">
          <input
            type="text"
            placeholder={`Message ${targetDog.ownerName} about ${targetDog.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-[#E8F0E9] text-xs sm:text-sm focus:outline-none focus:border-[#194B38] bg-[#FAF7F0] text-[#24352D]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-2xl bg-[#194B38] hover:bg-[#133A2B] disabled:opacity-40 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
