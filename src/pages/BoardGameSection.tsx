import { useEffect, useState } from "react";
import gameBoard from "../../public/table.png";
import yodaRed from "../../public/profile/yodaRed.png";
import axios from "axios";
import SelectRoomModal from "../components/SelectRoomModal";
import type Room from "../types/Room";
import type Player from "../types/Player";
import type { Card } from "../types/card";
import DraggableCard from "../components/DraggableCard";
import AnimatedCardDeck from "../components/CardAnimationComponent";

const LS_KEYS = {
  SELECTED_ROOM: "boardgame_selectedRoom",
  CURRENT_PLAYER: "boardgame_currentPlayer",
  MAIN_PLAYER: "boardgame_mainPlayer",
  TIME: "boardgame_time",
  IS_GAME_STARTED: "boardgame_isGameStarted",
};

const BoardGameSection = () => {
  const [closeModal, setCloseModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [mainPlayer, setMainPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [time, setTime] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [deck, setDeck] = useState<Card[]>([]);
  const [revealCards, setRevealCards] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [bet, setBet] = useState(100);
  const [totalBet, setTotalBet] = useState(0);
  const [betInputValue, setBetInputValue] = useState(bet);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    try {
      const storedRoom = localStorage.getItem(LS_KEYS.SELECTED_ROOM);
      if (storedRoom) setSelectedRoom(JSON.parse(storedRoom));

      const storedCurrentPlayer = localStorage.getItem(LS_KEYS.CURRENT_PLAYER);
      if (storedCurrentPlayer)
        setCurrentPlayer(JSON.parse(storedCurrentPlayer));

      const storedMainPlayer = localStorage.getItem(LS_KEYS.MAIN_PLAYER);
      if (storedMainPlayer) setMainPlayer(JSON.parse(storedMainPlayer));

      const storedTime = localStorage.getItem(LS_KEYS.TIME);
      if (storedTime) setTime(Number(storedTime));

      const storedIsGameStarted = localStorage.getItem(LS_KEYS.IS_GAME_STARTED);
      if (storedIsGameStarted) setIsGameStarted(storedIsGameStarted === "true");
    } catch (error) {
      console.error("Error loading from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (!isGameStarted) return;
    const timeout = setTimeout(() => {
      // Use a flag to avoid multiple updates in the same cycle
      let playerUpdated = false;

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) {
            playerUpdated = false; // Flag to prevent the index from being updated again
          }
          if (prev === 1 && !playerUpdated) {
            // Update the player index exactly once when timeLeft hits 1
            setPlayerIndex((prevIndex) => (prevIndex + 1) % allPlayers.length);
            setRevealCards(() => {
              if (allPlayers[playerIndex + 1]) {
                return allPlayers[playerIndex + 1]._id === mainPlayer?._id;
              }
              return false;
            });
            playerUpdated = true; // Flag to prevent the index from being updated again
          }

          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);

      // After 5 seconds, we start the game and reset the timer

      setTimeLeft(20); // Reset the time

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }, 5000);
  }, [isGameStarted, allPlayers.length]);

  useEffect(() => {
    if (isGameStarted && timeLeft <= 0) {
      setTimeLeft(20);
    }
  }, [playerIndex, isGameStarted]);
  console.log(
    "Before :: ",
    playerIndex,
    "After :: ",
    (playerIndex + 1) % (allPlayers.length + 5)
  );
  const backCard: Card = {
    suit: "Back",
    rank: "B",
    value: 0,
    code: "B",
    img: "/playing-cards/back.svg",
  };

  useEffect(() => {
    if (selectedRoom) {
      localStorage.setItem(LS_KEYS.SELECTED_ROOM, JSON.stringify(selectedRoom));
    } else {
      localStorage.removeItem(LS_KEYS.SELECTED_ROOM);
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (currentPlayer) {
      localStorage.setItem(
        LS_KEYS.CURRENT_PLAYER,
        JSON.stringify(currentPlayer)
      );
    } else {
      localStorage.removeItem(LS_KEYS.CURRENT_PLAYER);
    }
  }, [currentPlayer]);

  useEffect(() => {
    if (mainPlayer) {
      localStorage.setItem(LS_KEYS.MAIN_PLAYER, JSON.stringify(mainPlayer));
    } else {
      localStorage.removeItem(LS_KEYS.MAIN_PLAYER);
    }
  }, [mainPlayer]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.TIME, time.toString());
  }, [time]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.IS_GAME_STARTED, isGameStarted.toString());
  }, [isGameStarted]);

  const handleCloseChooseModal = (close: boolean) => {
    setCloseModal(close);
  };

  const handleRoomSelected = (room: Room) => {
    setSelectedRoom(room);
    console.log("Selected Room:", room);
  };

  const handleSetPlayer = (player: Player) => {
    setCurrentPlayer(player);
  };

  const handleFold = () => {
    setPlayerIndex((prevIndex) => (prevIndex + 1) % allPlayers.length);
    setRevealCards(false);
    setTimeLeft(20);
    setTime(20);
  };

  const handleBet = () => {
    if (mainPlayer) {
      setTotalBet((prev) => prev + bet);
      setMainPlayer((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          points: prev.points - bet,
          bet: bet,
        };
      });
    }
  };
  console.log("sdkvjbsdk :: ", time);
  const handleGetPlayers = async () => {
    if (!selectedRoom?._id || !currentPlayer?._id) return;

    try {
      const response = await axios.get<{ players: Player[] }>(
        `http://localhost:5000/api/player/${selectedRoom._id}`
      );

      const players = response.data.players;
      setAllPlayers(players);
      const main = players.find((p) => p._id === currentPlayer._id) || null;
      const others = players.filter((p) => p._id !== currentPlayer._id);
      console.log("others :: ", others);
      setMainPlayer(main);
      setOtherPlayers(others);
      const cards: any[] = [];
      const tempDeck = [...deck];

      for (let i = 0; i < 3; i++) {
        const index = Math.floor(Math.random() * tempDeck.length);
        const [card] = tempDeck.splice(index, 1);
        cards.push(card);
      }

      setMainPlayer((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          cards,
        };
      });

      console.log("Main Player:", mainPlayer);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  useEffect(() => {
    handleGetPlayers();
  }, [closeModal, selectedRoom?._id, currentPlayer?._id]);

  // useEffect(() => {
  //   if (isGameStarted) {
  //     if (mainPlayer?._id === allPlayers[playerIndex]?._id) {
  //       setRevealCards(true);
  //     } else {
  //       setRevealCards(false);
  //     }
  //   }
  // }, [playerIndex]);

  useEffect(() => {
    debugger;
    if (revealCards) {
      console.log("Reveal Cards :: ", revealCards);
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [revealCards]);

  useEffect(() => {
    if (selectedRoom) {
      setTime(0);
      console.log("Selected Room Changed:", selectedRoom);
      handleRoom();
      setTimeout(() => {
        setRevealCards(true);
      }, 5000);
    }
  }, [selectedRoom]);

  const handleRoom = async () => {
    try {
      if (!selectedRoom?._id || !currentPlayer?._id) return;
      const response = await axios.get<{ room: Room }>(
        `http://localhost:5000/api/rooms/${selectedRoom._id}`
      );
      console.log(
        "isGame Started ::::::::::::",
        response.data.room.isGameStarted
      );
      setIsGameStarted(response.data.room.isGameStarted);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleStartGame = () => {
    setIsGameStarted(true);
    handleUpdateRoom();
    setTimeout(() => {
      setRevealCards(true);
    }, 5000);
  };

  const handleUpdateRoom = async () => {
    try {
      if (!selectedRoom?._id || !currentPlayer?._id) return;
      const updatedRoom = {
        isGameStarted: true,
      };
      const response = await axios.put<{ room: Room }>(
        `http://localhost:5000/api/rooms/${selectedRoom._id}`,
        updatedRoom
      );
      console.log("Updated Room:", response.data.room);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

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
  //Create deck
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
  }, []);

  if (!selectedRoom) {
    return (
      <SelectRoomModal
        closeModal={handleCloseChooseModal}
        updateRoom={handleRoomSelected}
        updatePlayer={handleSetPlayer}
      />
    );
  }

  return (
    <div className="w-200 h-130 flex flex-col items-center">
      {/* Server Name */}
      <div className=" fixed top-5 w-full ml-10 flex flex-col gap-4 z-500">
        <span>
          <span className="text-black text-lg font-bold">Server: </span>
          <span className="text-[#ca0639] text-lg font-bold">
            {selectedRoom.serverName}
          </span>
        </span>

        {!isGameStarted && otherPlayers.length == 4 && mainPlayer?.isOwner && (
          <button
            onClick={handleStartGame}
            className=" absolute top-15 px-6 py-3 w-30 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-all"
          >
            start
          </button>
        )}
      </div>
      {allPlayers.length > 0 && (
        <div className="text-center flex flex-col items-center text-lg font-bold  my-2 z-50">
          {/* <div className="text-green-600">
            🎯 It's{" "}
            <span className="text-blue-500">
              {allPlayers[playerIndex]?.name}'s
            </span>{" "}
            turn!
          </div> */}
          <div className="flex items-center text-center gap-2 bg-gray-100 px-4 py-2 rounded-xl shadow-sm w-fit mt-2 text-sm ">
            <span className="text-gray-600">💵 Bet Amount:</span>
            <span className="font-semibold text-[#ca0639]">${bet}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 text-center px-4 py-2 rounded-xl shadow-sm w-fit mt-2 text-sm ">
            <span className="text-gray-600">💰 Total Amount:</span>
            <span className="font-semibold text-[#ca0639]">${totalBet}</span>
          </div>
        </div>
      )}
      {/* Cards */}

      {isGameStarted && (
        <div className=" fixed top-45 left-168 z-100 flex py-2 w-[20%] h-[45%] m-auto">
          <div className={`absolute top-[140px] left-[69px]`}>
            <DraggableCard
              card={backCard}
              index={233}
              vertical={false}
              height={180}
              width={130}
            />
          </div>
          <AnimatedCardDeck
            playersCount={otherPlayers.length > 0 ? otherPlayers.length + 1 : 0}
          />
        </div>
      )}
      {!isGameStarted && (
        <div className="fixed top-70 left-130 z-100 flex py-2 w-[20%] h-[45%] m-auto">
          Waiting For Other Players!!
        </div>
      )}

      {/* Main Player Points */}
      <div className="fixed top-3 z-10 right-155 flex flex-row items-center justify-center">
        <div className=" h-10 w-fit px-2 rounded-md flex flex-row justify-center items-center gap-2">
          {/* <span className="text-black font-bold"> Points :</span>
          <span className="text-[#ca0639] font-bold">{mainPlayer?.points}</span> */}
        </div>
      </div>

      {/* Main Player */}
      <div className="fixed bottom-0 z-501 right-150 flex flex-col items-center justify-center ">
        <div className="mr-5">
          <div className="relative w-20 h-20">
            {mainPlayer?._id === allPlayers[playerIndex]?._id && (
              <svg
                className="w-full h-full -rotate-90  drop-shadow-xl drop-shadow-green-100"
                viewBox="0 0 36 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="18"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="currentColor"
                  className="text-gray-200 dark:text-neutral-700 shadow-lg shadow-green-500"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="currentColor"
                  className="text-green-600 dark:text-green-500"
                  strokeWidth="4"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference - ((20 - timeLeft) / 20) * circumference
                  }
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
            )}

            {/* Avatar Image */}
            <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-500 bg-white overflow-hidden">
              <img
                src={yodaRed}
                alt="yodaProfile"
                className="object-cover w-full h-full rounded-full "
              />
            </div>
          </div>
          <div className="flex flex-col text-center">
            <span className="text-white font-bold">{mainPlayer?.name}</span>
          </div>
        </div>
        <div className="h-10 w-fit px-2 rounded-md flex flex-row justify-center items-center gap-2 mt-2">
          {isGameStarted && (
            <div className="flex gap-4 justify-center">
              {revealCards ? (
                mainPlayer?.cards.map((card, index) => (
                  <div key={index} className="relative left-30 bottom-20">
                    <DraggableCard
                      card={card}
                      index={index}
                      vertical={false}
                      height={180}
                      width={130}
                    />
                  </div>
                ))
              ) : (
                <div className="relative left-40 bottom-5">
                  <DraggableCard
                    card={backCard}
                    index={212}
                    vertical={false}
                    height={180}
                    width={130}
                  />
                </div>
              )}
            </div>
          )}

          {isGameStarted &&
            mainPlayer?._id === allPlayers[playerIndex]?._id && (
              <div className="absolute bottom-3 left-16 w-50 gap-1 rounded-2xl shadow-2xl p-2 flex flex-row items-center  z-50">
                <button
                  className={`${
                    mainPlayer?.bet > 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#ca0639] hover:bg-[#a1052e]"
                  } text-sm text-white py-1 rounded-lg transition-all w-full`}
                  onClick={handleBet}
                  disabled={mainPlayer?.bet > 0}
                >
                  Bet
                </button>

                <button
                  className="bg-[#ca0639] hover:bg-[#a1052e]  text-sm text-white py-1 rounded-lg transition-all w-full"
                  onClick={handleFold}
                >
                  Fold
                </button>
                {/* <button className="bg-[#ca0639] hover:bg-[#a1052e] text-white py-1 rounded-xl transition-all w-full">
                  Raise
                </button> */}
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-[#ca0639] hover:bg-[#a1052e]  text-sm text-white py-1 px-1 rounded-lg transition-all w-full"
                    onClick={() => setBet(betInputValue)}
                  >
                    Raise
                  </button>
                  <input
                    type="number"
                    value={betInputValue}
                    onChange={(e) => setBetInputValue(Number(e.target.value))}
                    className="w-15 py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ca0639]"
                  />
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Other Players */}
      <div className="z-500 h-3/4 w-full flex flex-col justify-between">
        <div className="flex flex-row justify-between">
          <div className={`relative `}>
            <div className="relative w-20 h-20">
              {otherPlayers[1]?._id === allPlayers[playerIndex]?._id && (
                <svg
                  className="w-full h-full -rotate-90  drop-shadow-xl drop-shadow-green-100"
                  viewBox="0 0 36 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="18"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-neutral-700 shadow-lg shadow-green-500"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="currentColor"
                    className="text-green-600 dark:text-green-500"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - ((20 - timeLeft) / 20) * circumference
                    }
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
              )}

              {/* Avatar Image */}
              <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-500 bg-white overflow-hidden">
                <img
                  src={yodaRed}
                  alt="yodaProfile"
                  className="object-cover w-full h-full rounded-full "
                />
              </div>
            </div>
            <div
              className={`h-10 w-20 px-2 rounded-md flex flex-row-reverse justify-center items-center`}
            >
              <div className="flex flex-col">
                <span className="text-white font-bold">
                  {otherPlayers[1]?.name}
                </span>
              </div>
              {isGameStarted && (
                <div className={`relative left-50 top-3`}>
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
          </div>
          <div className={`relative `}>
            <div className="relative w-20 h-20">
              {otherPlayers[2]?._id === allPlayers[playerIndex]?._id && (
                <svg
                  className="w-full h-full -rotate-90  drop-shadow-xl drop-shadow-green-100"
                  viewBox="0 0 36 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="18"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-neutral-700 shadow-lg shadow-green-500"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="currentColor"
                    className="text-green-600 dark:text-green-500"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - ((20 - timeLeft) / 20) * circumference
                    }
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
              )}

              {/* Avatar Image */}
              <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-500 bg-white overflow-hidden">
                <img
                  src={yodaRed}
                  alt="yodaProfile"
                  className="object-cover w-full h-full rounded-full "
                />
              </div>
            </div>
            <div
              className={`h-10 w-20 px-2 rounded-md flex flex-row-reverse justify-center items-center`}
            >
              <div className="flex flex-col">
                <span className="text-white font-bold">
                  {otherPlayers[2]?.name}
                </span>
              </div>
              {isGameStarted && (
                <div className={`relative left-15 top-3`}>
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
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className={`relative `}>
            <div className="relative w-20 h-20">
              {otherPlayers[0]?._id === allPlayers[playerIndex]?._id && (
                <svg
                  className="w-full h-full -rotate-90  drop-shadow-xl drop-shadow-green-100"
                  viewBox="0 0 36 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="18"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-neutral-700 shadow-lg shadow-green-500"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="currentColor"
                    className="text-green-600 dark:text-green-500"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - ((20 - timeLeft) / 20) * circumference
                    }
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
              )}

              {/* Avatar Image */}
              <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-500 bg-white overflow-hidden">
                <img
                  src={yodaRed}
                  alt="yodaProfile"
                  className="object-cover w-full h-full rounded-full "
                />
              </div>
            </div>
            <div
              className={`h-10 w-20 px-2 rounded-md flex flex-row-reverse justify-center items-center`}
            >
              <div className="flex flex-col">
                <span className="text-white font-bold">
                  {otherPlayers[0]?.name}
                </span>
              </div>
              {isGameStarted && (
                <div className={`relative left-50 top-3`}>
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
          </div>
          <div className={`relative `}>
            <div className="relative w-20 h-20">
              {otherPlayers[3]?._id === allPlayers[playerIndex]?._id && (
                <svg
                  className="w-full h-full -rotate-90  drop-shadow-xl drop-shadow-green-100"
                  viewBox="0 0 36 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="18"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-200 dark:text-neutral-700 shadow-lg shadow-green-500"
                    strokeWidth="4"
                  />
                  <circle
                    cx="18"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="currentColor"
                    className="text-green-600 dark:text-green-500"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference - ((20 - timeLeft) / 20) * circumference
                    }
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
              )}

              {/* Avatar Image */}
              <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gray-500 bg-white overflow-hidden">
                <img
                  src={yodaRed}
                  alt="yodaProfile"
                  className="object-cover w-full h-full rounded-full "
                />
              </div>
            </div>
            <div
              className={`h-10 w-20 px-2 rounded-md flex flex-row-reverse justify-center items-center`}
            >
              <div className="flex flex-col">
                <span className="text-white font-bold">
                  {otherPlayers[3]?.name}
                </span>
              </div>
              {isGameStarted && (
                <div className={`relative left-15 top-3`}>
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
          </div>
        </div>
      </div>

      {/* Background Game Board */}
      <div className="fixed top-13 z-0 ">
        <img src={gameBoard} alt="gameBoard" className="h-120" />
      </div>
    </div>
  );
};

export default BoardGameSection;
