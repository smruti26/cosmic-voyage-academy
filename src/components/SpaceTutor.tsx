import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { answerQuestion } from "@/lib/ai-brain";

interface Msg { role: "kid" | "ai"; text: string }

const SUGGESTIONS = [
  "What is a black hole?",
  "Why is Venus so hot?",
  "Tell me about ISRO",
  "How big is the Sun?",
];

export function SpaceTutor() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi explorer! I'm Cosmo, your space tutor. Ask me anything about planets, galaxies, black holes, or ISRO missions!" },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { role: "kid", text: q }, { role: "ai", text: answerQuestion(q) }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[55] inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-105 transition"
        aria-label="Open space tutor"
      >
        <Sparkles className="h-4 w-4" /> Ask Cosmo
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6" onClick={() => setOpen(false)}>
          <div
            className="glass w-full max-w-md rounded-3xl shadow-nebula animate-fade-in flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-nebula shadow-glow">
                  <MessageCircle className="h-4 w-4 text-primary-foreground" />
                </span>
                <div>
                  <div className="text-sm font-semibold">Cosmo — Space Tutor</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-accent">AI-powered</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-white/10" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "kid" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "kid"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/5 text-foreground border border-white/10"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-[11px] rounded-full bg-white/5 hover:bg-white/10 px-2.5 py-1 text-muted-foreground">
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-white/10 flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about space…"
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60"
              />
              <button type="submit" className="rounded-xl bg-primary px-3 py-2 text-primary-foreground shadow-glow">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
