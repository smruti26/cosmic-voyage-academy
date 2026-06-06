import { useState } from "react";
import { HOTSPOT_QUIZZES } from "@/data/quizzes";
import { useProfile } from "@/lib/profile";
import { CheckCircle2, XCircle, Sparkles } from "lucide-react";

interface Props {
  hotspotId: string;
  planetKey: string;
}

export function HotspotQuiz({ hotspotId, planetKey }: Props) {
  const quizzes = HOTSPOT_QUIZZES[hotspotId];
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const { recordQuiz, addBadge } = useProfile();

  if (!quizzes || quizzes.length === 0) return null;
  const q = quizzes[0];

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === q.answer;
    recordQuiz(correct);
    if (correct) addBadge(`quiz:${planetKey}:${hotspotId}`);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/25"
      >
        <Sparkles className="h-3 w-3" /> Quick quiz
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-lg bg-white/5 p-2">
      <div className="text-[11px] font-semibold text-foreground">{q.q}</div>
      <div className="mt-1.5 space-y-1">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === q.answer;
          const show = picked !== null;
          return (
            <button
              key={i}
              onClick={() => onPick(i)}
              disabled={picked !== null}
              className={`w-full text-left text-[11px] rounded-md px-2 py-1.5 transition flex items-center gap-1.5
                ${show && isCorrect ? "bg-green-500/20 text-green-200"
                  : show && isPicked ? "bg-red-500/20 text-red-200"
                  : "bg-white/5 hover:bg-white/10 text-muted-foreground"}`}
            >
              {show && isCorrect && <CheckCircle2 className="h-3 w-3" />}
              {show && isPicked && !isCorrect && <XCircle className="h-3 w-3" />}
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-1.5 text-[11px] text-accent">
          {picked === q.answer ? q.reward : `Almost! The answer was: ${q.options[q.answer]}`}
        </div>
      )}
    </div>
  );
}
