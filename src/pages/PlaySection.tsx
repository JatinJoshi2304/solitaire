// src/components/PlaySection.tsx
import { useEffect, useState, type FC } from "react";
import {
  RiPokerHeartsFill,
  RiPokerSpadesFill,
  RiPokerDiamondsFill,
  RiPokerClubsFill,
} from "react-icons/ri";
import DraggableCard from "../components/DraggableCard";
import SuitDropZone from "../components/SuitDropZone";
import type { Card } from "../types/card";
import RuleBookComponent from "../components/RuleBookComponent";

const PlaySection = () => {
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
  const [highestScore, setHighestScore] = useState(1000000);
  const [showRuleBook, setShowRuleBook] = useState(false);
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
      debugger;
      console.log();
      const newScore = time < highestScore ? time : highestScore;
      console.log("Time", time);
      console.log("Highest Score", highestScore);
      console.log("New Score", newScore);
      setHighestScore(newScore);
      console.log("Highest Score", highestScore);
    }
  }, [deck, isGameStarted, isGameOver]);

  const handleClose = (close: boolean) => {
    setShowRuleBook(close);
  };

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
        {isGameStarted && (
          <>
            <button
              className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? "Resume Game" : "Pause Game"}
            </button>
            <span className="text-[#ca0639] text-lg font-bold">{" | "}</span>
          </>
        )}
        <button
          className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer"
          onClick={() => setShowRuleBook(!showRuleBook)}
        >
          Rules
        </button>
      </div>

      <div
        className={`bg-green-700 w-full h-fit [@media(min-width:1100px)]:h-[80vh] border-2 border-gray-500 rounded-lg flex flex-col items-center pb-5 ${
          !isGameStarted || isPaused ? "relative" : ""
        }`}
      >
        <div className="flex w-full justify-between items-center text-white p-2">
          <span className="font-mono">
            Highest :{" "}
            {highestScore === 1000000
              ? "--:--:--"
              : `${String(Math.floor(highestScore / 3600)).padStart(
                  2,
                  "0"
                )}:${String(Math.floor((highestScore % 3600) / 60)).padStart(
                  2,
                  "0"
                )}:${String(highestScore % 60).padStart(2, "0")}`}
          </span>
          <span className="font-mono">
            Time:
            {String(Math.floor(time / 3600)).padStart(2, "0")}:
            {String(Math.floor((time % 3600) / 60)).padStart(2, "0")}:
            {String(time % 60).padStart(2, "0")}
          </span>

          <span className="font-mono">Moves : {moves} </span>
        </div>

        <div className="flex flex-row-reverse justify-center w-full">
          <div
            className="
              grid grid-cols-2 gap-4
              justify-between items-center mx-5 py-2 w-[70%]
              [@media(min-width:1100px)]:flex
              [@media(min-width:1100px)]:grid-cols-1
              [@media(min-width:1100px)]:gap-2
            "
          >
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
              {/* {isGameStarted && (
                <DraggableCard
                  key="back-card"
                  card={backCard}
                  index={deck.length + 1}
                  vertical={false}
                />
              )} */}
              {isGameOver && (
                <div className="mt-15">
                  <div className="px-5 text-red-700 text-2xl font-semibold ">
                    Game Over!!
                  </div>
                  <div className="px-5 text-red-700 text-2xl font-semibold ">
                    Start New Game
                  </div>
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
      {showRuleBook && <RuleBookComponent closeModal={handleClose} />}
    </div>
  );
};

export default PlaySection;
