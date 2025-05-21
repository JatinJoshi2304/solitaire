// src/components/PlaySection.tsx
import { useEffect, useState, type FC } from "react";
import {
  RiPokerHeartsFill,
  RiPokerSpadesFill,
  RiPokerDiamondsFill,
  RiPokerClubsFill,
} from "react-icons/ri";
import DraggableCard from "./DraggableCard";
import DropZone from "./DropZone";
import type { Card } from "../types/card";

const SuitDropZone: FC<{
  cards: Card[];
  onDrop: (item: { card: Card }) => void;
  Icon: FC;
  color?: string;
}> = ({ cards, onDrop, Icon, color }) => (
  <div
    className={`h-full border border-gray-600 rounded-lg shadow-inner shadow-black/30 flex flex-col items-center justify-center ${
      cards.length >= 13 ? "pointer-events-none opacity-50" : ""
    }`}
  >
    <DropZone onDrop={onDrop} Icon={Icon} color={color} cards={cards} />
  </div>
);

const PlaySection: FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [heartCards, setHeartCards] = useState<Card[]>([]);
  const [diamondCards, setDiamondCards] = useState<Card[]>([]);
  const [clubCards, setClubCards] = useState<Card[]>([]);
  const [spadeCards, setSpadeCards] = useState<Card[]>([]);
  const [randomCard, setRandomCard] = useState<Card | null>(null);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameRestarted, setIsGameRestarted] = useState(false);
  const [createDeck, setCreateDeck] = useState(false);
  const [highestScore, setHighestScore] = useState(0);
  const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const ranks = [
    { rank: "A", value: 1 },
    { rank: "2", value: 2 },
    { rank: "3", value: 3 },
    { rank: "4", value: 4 },
    { rank: "5", value: 5 },
    { rank: "6", value: 6 },
    { rank: "7", value: 7 },
    { rank: "8", value: 8 },
    { rank: "9", value: 9 },
    { rank: "10", value: 10 },
    { rank: "J", value: 11 },
    { rank: "Q", value: 12 },
    { rank: "K", value: 13 },
  ];

  useEffect(() => {
    const newDeck: Card[] = [];

    for (const suit of suits) {
      for (const { rank, value } of ranks) {
        newDeck.push({
          suit,
          rank,
          value,
          code: `${rank}${suit[0].toUpperCase()}`,
          img: `/playing-cards/${rank}${suit[0]}.svg`,
        });
      }
    }

    setDeck(newDeck);
  }, [createDeck]);

  useEffect(() => {
    if (isGameStarted && !isPaused && !isGameOver) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isGameStarted, isPaused, isGameOver]);

  useEffect(() => {
    if (deck.length === 0 && isGameStarted && !isGameOver) {
      setIsGameOver(true);
      setHighestScore((prev) => (prev > time ? time : prev));
    }
  }, [deck, isGameStarted, isGameOver]);

  useEffect(() => {
    if (
      heartCards.length === 13 &&
      diamondCards.length === 13 &&
      clubCards.length === 13 &&
      spadeCards.length === 13 &&
      isGameStarted &&
      !isGameWon
    ) {
      setIsGameWon(true);
      setIsGameOver(true);
    }
  }, [
    heartCards,
    diamondCards,
    clubCards,
    spadeCards,
    isGameStarted,
    isGameWon,
  ]);

  useEffect(() => {
    if (deck.length > 0) {
      const random = deck[Math.floor(Math.random() * deck.length)];
      setRandomCard(random);
    } else {
      setRandomCard(null);
    }
  }, [deck]);

  useEffect(() => {
    if (isGameRestarted) {
      setDeck([]);
      setCreateDeck(false);
      setHeartCards([]);
      setDiamondCards([]);
      setClubCards([]);
      setSpadeCards([]);
      setRandomCard(null);
      setMoves(0);
      setTime(0);
      setIsPaused(false);
      setIsGameOver(false);
      setIsGameWon(false);
      setIsGameStarted(false);
      setIsGameRestarted(false);
    }
  }, [isGameRestarted]);

  const backCard: Card = {
    suit: "Back",
    rank: "B",
    value: 0,
    code: "B",
    img: "/playing-cards/back.svg",
  };

  const handleDrop = (suit: string) => (item: { card: Card }) => {
    const { card } = item;

    switch (suit) {
      case "hearts":
        if (card.suit !== "Hearts") return;
        setHeartCards((prev) => [...prev, card]);
        setMoves((prev) => prev + 1);
        break;
      case "diamonds":
        if (card.suit !== "Diamonds") return;
        setDiamondCards((prev) => [...prev, card]);
        setMoves((prev) => prev + 1);
        break;
      case "clubs":
        if (card.suit !== "Clubs") return;
        setClubCards((prev) => [...prev, card]);
        setMoves((prev) => prev + 1);
        break;
      case "spades":
        if (card.suit !== "Spades") return;
        setSpadeCards((prev) => [...prev, card]);
        setMoves((prev) => prev + 1);
        break;
    }

    setDeck((prevDeck) => prevDeck.filter((c) => c.code !== card.code));
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="px-[10%] flex gap-2 my-2">
        <button
          className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer "
          onClick={() => {
            setIsGameRestarted(true);
            setCreateDeck(!createDeck);
          }}
        >
          New Game
        </button>
        <span className="text-[#ca0639] text-lg font-bold">{" | "}</span>
        <button
          className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? "Resume Game" : "Pause Game"}
        </button>
      </div>

      <div
        className={`bg-green-700 w-full h-screen border-2 border-gray-500 rounded-lg flex flex-col items-center pb-5 ${
          !isGameStarted || isPaused ? "relative" : ""
        }`}
      >
        <div className="flex w-full justify-between items-center text-white p-2">
          <span className="font-mono">
            Highest :{String(Math.floor(highestScore / 3600)).padStart(2, "0")}:
            {String(Math.floor((highestScore % 3600) / 60)).padStart(2, "0")}:
            {String(highestScore % 60).padStart(2, "0")}
          </span>
          <span className="font-mono">
            Time:
            {String(Math.floor(time / 3600)).padStart(2, "0")}:
            {String(Math.floor((time % 3600) / 60)).padStart(2, "0")}:
            {String(time % 60).padStart(2, "0")}
          </span>

          <span className="font-mono">Moves : {moves} </span>
        </div>

        <div className="flex flex-row-reverse justify-center w-full h-full">
          <div className="flex justify-between items-center mx-5 py-2 w-[70%] h-[45%]">
            <SuitDropZone
              cards={heartCards}
              onDrop={handleDrop("hearts")}
              Icon={RiPokerHeartsFill}
              color="#ca0639"
            />
            <SuitDropZone
              cards={spadeCards}
              onDrop={handleDrop("spades")}
              Icon={RiPokerSpadesFill}
            />
            <SuitDropZone
              cards={diamondCards}
              onDrop={handleDrop("diamonds")}
              Icon={RiPokerDiamondsFill}
              color="#ca0639"
            />
            <SuitDropZone
              cards={clubCards}
              onDrop={handleDrop("clubs")}
              Icon={RiPokerClubsFill}
            />
          </div>

          <div className="flex py-2 w-[20%] h-[45%] m-auto">
            <div className="flex justify-center h-full">
              {deck.map((card, i) => (
                <DraggableCard key={i} card={card} index={i} vertical={false} />
              ))}
              {deck.length > 1 && (
                <DraggableCard
                  key="back-card"
                  card={backCard}
                  index={deck.length}
                  vertical={false}
                />
              )}
              {randomCard && (
                <DraggableCard
                  key="front-card"
                  card={randomCard}
                  index={deck.length + 1}
                  vertical={false}
                />
              )}
              {isGameOver && (
                <div className="px-5 py-2 mt-5 text-red-700 text-2xl font-semibold ">
                  Game Over
                </div>
              )}
            </div>
          </div>
        </div>

        {!isGameStarted && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-100">
            <button
              onClick={() => setIsGameStarted(true)}
              className="px-6 py-3 bg-white text-green-700 font-semibold rounded-lg shadow-md hover:bg-green-100 transition-all"
            >
              Start Game
            </button>
          </div>
        )}

        {isPaused && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-100">
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-3 bg-white text-green-700 font-semibold rounded-lg shadow-md hover:bg-green-100 transition-all"
            >
              Resume Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaySection;
