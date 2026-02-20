"use client";
import { useState, useEffect, useRef } from "react";
import { Session } from "next-auth";
import { getPusherClient } from "@/lib/pusher";
import { Send, Plus, MessageCircle, Loader2 } from "lucide-react";
import { RANKS } from "@/lib/utils";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Chat {
  id: string;
  title: string;
  fromRank: string;
  toRank: string;
  status: string;
  messages: any[];
}

interface Props {
  session: Session | null;
  userChats: Chat[];
}

export function BoostChatSection({ session, userChats }: Props) {
  const [chats, setChats] = useState<Chat[]>(userChats);
  const [activeChat, setActiveChat] = useState<string | null>(chats[0]?.id || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatForm, setNewChatForm] = useState({ fromRank: "", toRank: "" });
  const messagesEnd = useRef<HTMLDivElement>(null);

  const userId = (session?.user as any)?.id;

  // Load messages when chat changes
  useEffect(() => {
    if (!activeChat) return;
    setLoadingChat(true);
    fetch(`/api/boost/messages?chatId=${activeChat}`)
      .then((r) => r.json())
      .then((data) => { setMessages(data.messages || []); setLoadingChat(false); })
      .catch(() => setLoadingChat(false));
  }, [activeChat]);

  // Subscribe to Pusher
  useEffect(() => {
    if (!activeChat) return;
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`boost-chat-${activeChat}`);
    channel.bind("new-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => { pusher.unsubscribe(`boost-chat-${activeChat}`); };
  }, [activeChat]);

  // Scroll to bottom
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || sending) return;
    setSending(true);
    await fetch("/api/boost/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: activeChat, content: newMessage.trim() }),
    });
    setNewMessage("");
    setSending(false);
  }

  async function createChat() {
    if (!newChatForm.fromRank || !newChatForm.toRank) return;
    const res = await fetch("/api/boost/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromRank: newChatForm.fromRank,
        toRank: newChatForm.toRank,
        title: `Boost: ${newChatForm.fromRank} → ${newChatForm.toRank}`,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setChats((prev) => [data.chat, ...prev]);
      setActiveChat(data.chat.id);
      setShowNewChat(false);
      setNewChatForm({ fromRank: "", toRank: "" });
    }
  }

  if (!session) {
    return (
      <div className="card-base p-12 text-center">
        <MessageCircle size={40} className="text-[#5a6475] mx-auto mb-4" />
        <h3 className="font-rajdhani font-bold text-white text-xl mb-2">Chat en Tiempo Real</h3>
        <p className="text-[#5a6475] text-sm mb-6">Inicia sesión para hablar con nuestros boosters profesionales.</p>
        <Link href="/login" className="btn-primary px-8 py-2.5">Iniciar Sesión</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-rajdhani font-bold text-white text-xl uppercase tracking-wide mb-4">
        Chat de <span className="text-orange">Boost</span>
        <span className="ml-3 badge bg-[#2ebd85]/10 text-[#2ebd85] border-[#2ebd85]/30 text-xs align-middle">EN VIVO</span>
      </h2>

      <div className="flex gap-4 h-[500px]">
        {/* Chats list */}
        <div className="w-56 shrink-0 flex flex-col gap-1">
          <button
            onClick={() => setShowNewChat(true)}
            className="btn-primary w-full flex items-center justify-center gap-2 text-xs py-2 mb-2"
          >
            <Plus size={13} /> Nuevo Chat
          </button>

          {showNewChat && (
            <div className="card-base p-3 mb-2">
              <div className="text-xs text-[#5a6475] mb-2 uppercase tracking-widest">Nuevo boost</div>
              <select className="input-field text-xs mb-2" value={newChatForm.fromRank}
                onChange={(e) => setNewChatForm((p) => ({ ...p, fromRank: e.target.value }))}>
                <option value="">Desde rank...</option>
                {RANKS.map((r) => <option key={r}>{r}</option>)}
              </select>
              <select className="input-field text-xs mb-2" value={newChatForm.toRank}
                onChange={(e) => setNewChatForm((p) => ({ ...p, toRank: e.target.value }))}>
                <option value="">Hasta rank...</option>
                {RANKS.map((r) => <option key={r}>{r}</option>)}
              </select>
              <div className="flex gap-1">
                <button onClick={createChat} className="btn-primary flex-1 text-[10px] py-1.5">Crear</button>
                <button onClick={() => setShowNewChat(false)} className="btn-ghost flex-1 text-[10px] py-1.5">Cancelar</button>
              </div>
            </div>
          )}

          {chats.length === 0 ? (
            <div className="text-[#5a6475] text-xs p-3 text-center">
              No tienes chats aún. ¡Crea uno!
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full text-left p-3 border text-xs transition-all ${
                  activeChat === chat.id
                    ? "bg-orange/10 border-orange/30 text-white"
                    : "bg-bg2 border-[#1e2330] text-[#8a95a3] hover:border-[#3a4050]"
                }`}
              >
                <div className="font-semibold truncate">{chat.fromRank} → {chat.toRank}</div>
                <div className={`text-[10px] mt-0.5 ${chat.status === "OPEN" ? "text-[#2ebd85]" : "text-[#5a6475]"}`}>
                  {chat.status === "OPEN" ? "● Abierto" : chat.status === "IN_PROGRESS" ? "● En progreso" : "● Cerrado"}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat window */}
        <div className="flex-1 card-base flex flex-col">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-3 border-b border-[#1e2330] flex items-center justify-between">
                <div>
                  <span className="font-rajdhani font-bold text-white text-sm">
                    {chats.find((c) => c.id === activeChat)?.fromRank} → {chats.find((c) => c.id === activeChat)?.toRank}
                  </span>
                  <span className="ml-2 text-[10px] text-[#2ebd85]">● Booster conectado</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {loadingChat ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin text-[#5a6475]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <MessageCircle size={32} className="text-[#5a6475] mb-3" />
                    <p className="text-[#5a6475] text-sm">Un booster se conectará pronto.</p>
                    <p className="text-xs text-[#3a4050] mt-1">Tiempo de respuesta promedio: 5 minutos</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.senderId === userId ? "ml-auto items-end" : "items-start"}`}>
                      <div className="text-[10px] text-[#5a6475] mb-1 px-1">
                        {msg.isAdmin ? "🛡️ Admin" : msg.senderName}
                      </div>
                      <div className={`p-2.5 text-sm ${
                        msg.senderId === userId
                          ? "bg-orange/15 border border-orange/25 text-[#cdd6e0]"
                          : "bg-bg3 border border-[#1e2330] text-[#cdd6e0]"
                      }`}>
                        {msg.content}
                      </div>
                      <div className="text-[10px] text-[#3a4050] mt-0.5 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEnd} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="p-3 border-t border-[#1e2330] flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="input-field flex-1 text-sm py-2"
                  placeholder="Escribe un mensaje..."
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !newMessage.trim()} className="btn-primary px-3 py-2">
                  {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#5a6475] text-sm">
              Selecciona un chat o crea uno nuevo
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
