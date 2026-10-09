"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { FeedbackBar } from "@/components/lesson/FeedbackBar";
import { MultipleChoice } from "@/components/exercises/MultipleChoice";
import { TranslateWordBank } from "@/components/exercises/TranslateWordBank";
import { MatchPairs } from "@/components/exercises/MatchPairs";
import { FillInBlank } from "@/components/exercises/FillInBlank";
import { TypeAnswer } from "@/components/exercises/TypeAnswer";
import { Speak } from "@/components/exercises/Speak";
import { Listen } from "@/components/exercises/Listen";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/mascot/Mascot";
import confetti from "canvas-confetti";
import { Flame } from "lucide-react";

function LessonContent() {
  const params = useParams();
  const router = useRouter();
  const { user, fetchData } = useAppStore();
  
  const [lesson, setLesson] = useState<unknown>(null);
  const [exercises, setExercises] = useState<unknown[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [heartsLost, setHeartsLost] = useState(0);
  
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect" | "completed" | "streak">("idle");
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswerStr, setCorrectAnswerStr] = useState("");
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showHeartsModal, setShowHeartsModal] = useState(false);
  
  const [summary, setSummary] = useState<any>(null);
  
  useEffect(() => {
    // Initial fetch user if not present to check hearts
    if (!user) {
      fetchData().then(() => {
        const h = useAppStore.getState().user?.stats?.hearts;
        if (h !== undefined) {
          setHearts(h);
          if (h === 0) setShowHeartsModal(true);
        }
      });
    } else {
      setHearts(user.stats.hearts);
      if (user.stats.hearts === 0) setShowHeartsModal(true);
    }
    
    api.get(`/skills/${params.lessonId}/lesson`).then((res) => {
      setLesson(res.data);
      setExercises(res.data.exercises);
    }).catch(console.error);
  }, [params.lessonId, user, fetchData]);

  useEffect(() => {
    if (status === "completed") {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#58CC02", "#1CB0F6", "#FFC800", "#FF4B4B"]
      });
    }
  }, [status]);

  if (!lesson || exercises.length === 0) return <div className="h-screen flex items-center justify-center font-bold text-duo-grey text-xl">Loading...</div>;

  if (status === "streak") {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 gap-8 bg-white">
        <Flame size={120} className="text-duo-orange animate-pulse drop-shadow-xl" fill="#FF9600" />
        <h1 className="text-4xl font-bold text-duo-orange text-center">{summary?.new_streak} Day Streak!</h1>
        <p className="text-xl text-duo-textLight font-medium text-center">You're on fire! Keep it up tomorrow.</p>
        <Button size="lg" variant="primary" className="mt-8 w-full max-w-sm" onClick={() => router.push("/learn")}>CONTINUE</Button>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 gap-8 bg-white">
        <Mascot state="happy" className="w-40 h-40" />
        <h1 className="text-4xl font-bold text-duo-yellow text-center">Lesson Complete!</h1>
        
        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mt-4">
          <div className="border-2 border-duo-yellow bg-yellow-50 rounded-xl p-6 flex flex-col items-center justify-center">
            <h3 className="font-bold text-duo-yellow uppercase mb-2 text-sm text-center">Total XP</h3>
            <p className="text-3xl font-black text-duo-yellow">{summary?.xp_earned || 10}</p>
          </div>
          <div className="border-2 border-duo-greenShadow bg-green-50 rounded-xl p-6 flex flex-col items-center justify-center">
            <h3 className="font-bold text-duo-green uppercase mb-2 text-sm text-center">Accuracy</h3>
            <p className="text-3xl font-black text-duo-green">
              {Math.max(0, 100 - (heartsLost * 20))}%
            </p>
          </div>
          <div className="border-2 border-duo-blue bg-blue-50 rounded-xl p-6 flex flex-col items-center justify-center">
            <h3 className="font-bold text-duo-blue uppercase mb-2 text-sm text-center">Time</h3>
            <p className="text-3xl font-black text-duo-blue">1:45</p>
          </div>
        </div>
        
        <Button size="lg" variant="primary" className="mt-8 w-full max-w-2xl" onClick={() => {
          if (summary?.streak_incremented) {
            setStatus("streak");
          } else {
            router.push("/learn");
          }
        }}>CONTINUE</Button>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex] as { id: number, type: string, prompt: string, payload: unknown };
  const percentage = (currentIndex / exercises.length) * 100;

  const handleCheck = async () => {
    if (status === "idle") {
      if (!userAnswer) return;

      try {
        const res = await api.post(`/exercises/${currentExercise.id}/check`, { user_answer: userAnswer });
        if (res.data.correct) {
          setStatus("correct");
        } else {
          setStatus("incorrect");
          setCorrectAnswerStr(res.data.correct_answer);
          
          const newHearts = Math.max(0, hearts - 1);
          setHearts(newHearts);
          setHeartsLost((hl) => hl + 1);
          
          if (newHearts === 0) {
            setShowHeartsModal(true);
          } else {
            // Re-queue mistake
            setExercises((prev) => [...prev, currentExercise]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // Continue
      setStatus("idle");
      setUserAnswer("");
      
      if (currentIndex + 1 >= exercises.length && status !== "incorrect") {
        // Finished
        api.post(`/lessons/${(lesson as {id: number}).id}/complete`, {
          xp_earned: 10,
          accuracy: 1.0 - (heartsLost * 0.2),
          hearts_lost: heartsLost,
          skill_id: parseInt(params.lessonId as string, 10)
        }).then((res) => {
          setSummary(res.data);
          setStatus("completed");
        });
      } else {
        setCurrentIndex(c => c + 1);
      }
    }
  };

  const handleSkip = () => {
    if (currentIndex + 1 >= exercises.length && status !== "incorrect") {
      api.post(`/lessons/${(lesson as {id: number}).id}/complete`, {
        xp_earned: 10,
        accuracy: 1.0 - (heartsLost * 0.2),
        hearts_lost: heartsLost,
        skill_id: parseInt(params.lessonId as string, 10)
      }).then((res) => {
        setSummary(res.data);
        setStatus("completed");
      });
    } else {
      setCurrentIndex(c => c + 1);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#131F24] transition-colors duration-300 relative">
      <LessonHeader 
        hearts={hearts} 
        percentage={percentage} 
        onQuit={() => setShowQuitModal(true)} 
      />

      <main className="flex-1 overflow-y-auto px-4 lg:px-0">
        <div className="h-full flex items-center justify-center pb-20 pt-8">
          {currentExercise.type === "multiple_choice" && (
            <MultipleChoice 
              prompt={currentExercise.prompt} 
              options={(currentExercise.payload as {options: unknown[]}).options as { text: string; image?: string }[]} 
              onSelect={setUserAnswer} 
            />
          )}
          {currentExercise.type === "translate_word_bank" && (
            <TranslateWordBank 
              prompt={currentExercise.prompt} 
              bank={(currentExercise.payload as {bank: string[]}).bank} 
              onSelect={setUserAnswer} 
            />
          )}
          {currentExercise.type === "match_pairs" && (
            <MatchPairs 
              prompt={currentExercise.prompt} 
              pairs={(currentExercise.payload as {pairs: Record<string, string>}).pairs || {}} 
              onSelect={setUserAnswer} 
            />
          )}
          {currentExercise.type === "fill_blank" && (
            <FillInBlank 
              prompt={currentExercise.prompt} 
              payload={currentExercise.payload as {sentence: string, blankIndex: number, options: string[]}} 
              onSelect={setUserAnswer} 
            />
          )}
          {currentExercise.type === "type_answer" && (
            <TypeAnswer 
              prompt={currentExercise.prompt} 
              onSelect={setUserAnswer} 
            />
          )}
          {currentExercise.type === "speak" && (
            <Speak 
              prompt={currentExercise.prompt} 
              textToSpeak={(currentExercise.payload as {text: string}).text} 
              onSkip={handleSkip} 
            />
          )}
          {currentExercise.type === "listen" && (
            <Listen 
              prompt={currentExercise.prompt} 
              textToSpeak={(currentExercise.payload as {text: string}).text} 
              onSelect={setUserAnswer} 
            />
          )}
        </div>
      </main>

      {currentExercise.type !== "speak" && (
        <FeedbackBar 
          status={status} 
          onCheck={handleCheck} 
          disabled={status === "idle" && !userAnswer} 
          correctAnswer={correctAnswerStr}
        />
      )}

      {/* Quit Modal */}
      <Modal isOpen={showQuitModal}>
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold text-duo-textDark">Are you sure you want to quit?</h2>
          <p className="text-duo-textLight font-medium">All progress for this lesson will be lost.</p>
          <div className="flex flex-col w-full gap-3 mt-4">
            <Button variant="primary" onClick={() => setShowQuitModal(false)}>KEEP LEARNING</Button>
            <Button variant="danger" onClick={() => router.push("/learn")}>END SESSION</Button>
          </div>
        </div>
      </Modal>

      {/* Out of Hearts Modal */}
      <Modal isOpen={showHeartsModal}>
        <div className="flex flex-col items-center gap-4 text-center">
          <Mascot state="sad" />
          <h2 className="text-2xl font-bold text-duo-textDark">You ran out of hearts!</h2>
          <p className="text-duo-textLight font-medium">You need hearts to start a lesson.</p>
          <div className="flex flex-col w-full gap-3 mt-4">
            <Button variant="primary" onClick={() => { 
              api.post('/dev/simulate-day', {days: 0}); // Hack to trigger something, but ideally we refill directly
              setHearts(5); 
              setShowHeartsModal(false); 
            }}>REFILL HEARTS (MOCK)</Button>
            <Button variant="ghost" onClick={() => router.push("/learn")}>NO THANKS</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold text-duo-grey text-xl">Loading...</div>}>
      <LessonContent />
    </Suspense>
  );
}
