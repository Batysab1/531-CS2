"use client";
import { useState, useEffect, useRef } from "react";
import { getPusherClient } from "@/lib/pusher";
import { Send, Loader2, MessageSquare, CheckCheck } from "lucide-react";

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
  fromRank: string;
  toRank: string;
  status: string;
  user: { username: string };
  messages: Message[];
}

export function AdminBoostChat({ chats: initial, adminId, adminUsername }: {
  chats: Chat[];
  adminId: string;
  adminUsername: string;
}) {
  const [chats, setChats] = useState<Chat[]>(initial);
  const [activeChat, setActiveChat] = useState<string | null>(chats[0]?.id || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeChat) return;
    setLoading(true);
    fetch(`/api/boost/messages?chatId=${activeChat}`)
      .then((r) => r.json())
      .then((d) => { setMessages(d.messages || []); setLoading(false); });
  }, [activeChat]);

  useEffect(() => {
    if (!activeChat) return;
    const pusher = getPusherClient();
    const ch = pusher.subscribe(`boost-chat-${activeChat}`);
    ch.bind("new-message", (msg: Message) => setMessages((p) => [...p, msg]));
    return () => pusher.unsubscribe(`boost-chat-${activeChat}`);
  }, [activeChat]);

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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

  async function closeChat(chatId: string) {
    const res = await fetch(`/api/admin/boost/${chatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CLOSED" }),
    });
    if (res.ok) setChats((p) => p.map((c) => c.id === chatId ? { ...c, status: "CLOSED" } : c));
  }

  const STATUS_COLORS: Record<string, string> = {
    OPEN: "text-orange",
    IN_PROGRESS: "text-[#2ebd85]",
    CLOSED: "text-[#5a6475]",
  };
  const STATUS_LABELS: Record<string, string> = {
    OPEN: "Abierto",
    IN_PROGRESS: "En progreso",
    CLOSED: "Cerrado",
  };

  return (
    <div>
      <h1 className="font-rajdhani font-bold text-white text-3xl mb-6">
        Chats de Boost <span className="badge bg-[#2ebd85]/10 text-[#2ebd85] border-[#2ebd85]/30 text-sm align-middle">EN VIVO</span>
      </h1>

      <div className="flex gap-4 h-[600px]">
        {/* Chat list */}
        <div className="w-64 flex flex-col gap-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="card-base p-8 text-center text-[#5a6475] text-sm">
              <MessageSquare size={24} className="mx-auto mb-3" />
              No hay chats activos.
            </div>
          ) : chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`w-full text-left p-3 border transition-all ${
                activeChat === chat.id
                  ? "bg-orange/10 border-orange/30"
                  : "bg-bg2 border-[#1e2330] hover:border-[#3a4050]"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-white text-xs">{chat.user.username}</span>
                <span className={`text-[10px] ${STATUS_COLORS[chat.status]}`}>● {STATUS_LABELS[chat.status]}</span>
              </div>
              <div className="text-[11px] text-[#5a6475] mt-0.5">{chat.fromRank} → {chat.toRank}</div>
              {chat.messages[0] && (
                <div className="text-[10px] text-[#3a4050] mt-1 truncate">{chat.messages[0].content}</div>
              )}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="flex-1 card-base flex flex-col">
          {activeChat ? (() => {
            const chat = chats.find((c) => c.id === activeChat);
            return (
              <>
                <div className="p-3 border-b border-[#1e2330] flex items-center justify-between">
                  <div>
                    <span className="font-rajdhani font-bold text-white">
                      {chat?.user.username} — {chat?.fromRank} → {chat?.toRank}
                    </span>
                  </div>
                  {chat?.status !== "CLOSED" && (
                    <button onClick={() => closeChat(activeChat)} className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1">
                      <CheckCheck size={12} /> Cerrar chat
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <Loader2 size={20} className="animate-spin text-[#5a6475]" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-[#5a6475] text-sm">Sin mensajes aún.</div>
                  ) : messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.isAdmin ? "ml-auto items-end" : "items-start"}`}>
                      <div className="text-[10px] text-[#5a6475] mb-1 px-1">
                        {msg.isAdmin ? `🛡️ ${msg.senderName} (Admin)` : `👤 ${msg.senderName}`}
                      </div>
                      <div className={`p-2.5 text-sm ${
                        msg.isAdmin
                          ? "bg-orange/15 border border-orange/25 text-[#cdd6e0]"
                          : "bg-bg3 border border-[#1e2330] text-[#cdd6e0]"
                      }`}>{msg.content}</div>
                      <div className="text-[10px] text-[#3a4050] mt-0.5 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEnd} />
                </div>

                {chat?.status !== "CLOSED" ? (
                  <form onSubmit={sendMessage} className="p-3 border-t border-[#1e2330] flex gap-2">
                    <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                      className="input-field flex-1 text-sm py-2" placeholder="Responder como admin..." disabled={sending} />
                    <button type="submit" disabled={sending || !newMessage.trim()} className="btn-primary px-3 py-2">
                      {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    </button>
                  </form>
                ) : (
                  <div className="p-3 border-t border-[#1e2330] text-center text-xs text-[#5a6475]">Chat cerrado</div>
                )}
              </>
            );
          })() : (
            <div className="flex-1 flex items-center justify-center text-[#5a6475] text-sm">Selecciona un chat</div>
          )}
        </div>
      </div>
    </div>
  );
}
