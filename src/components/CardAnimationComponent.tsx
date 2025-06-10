import { useEffect, useRef, useState } from "react";
import DraggableCard from "./DraggableCard";
import type { Card } from "../types/card";

interface AnimatedCardDeckProps {
  playersCount: number;
}

const AnimatedCardDeck: React.FC<AnimatedCardDeckProps> = ({
  playersCount,
}) => {
  const [step, setStep] = useState(0);
  const iterationRef = useRef(0);
  const count = playersCount;
  useEffect(() => {
    const interval = setInterval(() => {
      if (iterationRef.current < count * 3 - 1) {
        setStep((prev) => {
          const next = (prev + 1) % count;
          console.log("step :: ", next);
          return next;
        });

        iterationRef.current += 1;
      } else {
        clearInterval(interval);
      }
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const backCard: Card = {
    suit: "Back",
    rank: "B",
    value: 0,
    code: "B",
    img: "/playing-cards/back.svg",
  };

  return (
    <div className="fixed top-1/2 left-1/2 z-[100] flex justify-center items-center py-2 w-[20%] h-[45%] -translate-x-1/2 -translate-y-1/2">
      {step === 0 && (
        <div className={`card card-BC top-[175px] left-[240px]`}>
          <DraggableCard
            card={backCard}
            index={233}
            vertical={false}
            height={180}
            width={130}
          />
        </div>
      )}
      {step === 1 && (
        <div className={`card card-BL top-[175px] left-[240px]`}>
          <DraggableCard
            card={backCard}
            index={233}
            vertical={false}
            height={180}
            width={130}
          />
        </div>
      )}
      {step === 2 && (
        <div className={`card card-TL top-[175px] left-[240px]`}>
          <DraggableCard
            card={backCard}
            index={233}
            vertical={false}
            height={180}
            width={130}
          />
        </div>
      )}
      {step === 3 && (
        <div className={`card card-TR top-[175px] left-[240px]`}>
          <DraggableCard
            card={backCard}
            index={233}
            vertical={false}
            height={180}
            width={130}
          />
        </div>
      )}
      {step === 4 && (
        <div className={`card card-BR top-[175px] left-[240px]`}>
          <DraggableCard
            card={backCard}
            index={233}
            vertical={false}
            height={180}
            width={130}
          />
        </div>
      )}
    </div>
  );
};

export default AnimatedCardDeck;
