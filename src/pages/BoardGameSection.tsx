import { useEffect, useState } from "react";
import gameBoard from "../../public/table.png";
import yodaRed from "../../public/profile/yodaRed.png";
import axios from "axios";
import SelectRoomModal from "../components/SelectRoomModal";
import type Room from "../types/Room";
import type Player from "../types/Player";

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
  const [time, setTime] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Load from localStorage once on mount
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

  // Save selectedRoom to localStorage whenever it changes
  useEffect(() => {
    if (selectedRoom) {
      localStorage.setItem(LS_KEYS.SELECTED_ROOM, JSON.stringify(selectedRoom));
    } else {
      localStorage.removeItem(LS_KEYS.SELECTED_ROOM);
    }
  }, [selectedRoom]);

  // Save currentPlayer to localStorage whenever it changes
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

  // Save mainPlayer to localStorage whenever it changes
  useEffect(() => {
    if (mainPlayer) {
      localStorage.setItem(LS_KEYS.MAIN_PLAYER, JSON.stringify(mainPlayer));
    } else {
      localStorage.removeItem(LS_KEYS.MAIN_PLAYER);
    }
  }, [mainPlayer]);

  // Save time to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LS_KEYS.TIME, time.toString());
  }, [time]);

  // Save isGameStarted to localStorage whenever it changes
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

  const handleGetPlayers = async () => {
    if (!selectedRoom?._id || !currentPlayer?._id) return;

    try {
      const response = await axios.get<{ players: Player[] }>(
        `http://localhost:5000/api/player/${selectedRoom._id}`
      );

      const players = response.data.players;
      const main = players.find((p) => p._id === currentPlayer._id) || null;
      const others = players.filter((p) => p._id !== currentPlayer._id);

      setMainPlayer(main);
      setOtherPlayers(others);

      console.log("Main Player:", main);
      console.log("Other Players:", others);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  useEffect(() => {
    handleGetPlayers();
  }, [closeModal, selectedRoom, currentPlayer]);

  useEffect(() => {
    if (isGameStarted) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isGameStarted]);

  useEffect(() => {
    if (selectedRoom) {
      setIsGameStarted(false);
      setTime(0);
    }
  }, [selectedRoom]);

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
    <div className="w-full h-full flex flex-col items-center">
      {/* Server Name */}
      <div className="w-full ml-10 flex flex-col gap-4">
        <span>
          <span className="text-black text-lg font-bold">Server: </span>
          <span className="text-[#ca0639] text-lg font-bold">
            {selectedRoom.serverName}
          </span>
        </span>

        {!isGameStarted && (
          <button
            onClick={() => setIsGameStarted(true)}
            className=" absolute top-25 px-6 py-3 w-30 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-all"
          >
            start
          </button>
        )}
      </div>

      {/* Timer */}

      {/* Main Player */}
      <div className="absolute bottom-3 z-10 right-155 flex flex-row items-center justify-center">
        <div className="rounded-full bg-white w-10 h-10 border-2 border-[#00e731] ">
          <img
            className="rounded-full bg-white object-cover"
            src={yodaRed}
            alt="yodaProfile"
          />
        </div>
        <div className=" h-10 w-fit px-2 rounded-md flex flex-col justify-center items-center gap-2">
          <span className="text-white font-bold">{mainPlayer?.name}</span>
        </div>
      </div>

      {/* Other Players */}
      <div className="flex flex-col justify-between h-full w-full px-70 py-18 z-10">
        <div className="grid grid-cols-2 gap-x-170 gap-y-75 w-10 h-fit ">
          {otherPlayers.map((player, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 == 0 ? "flex-row" : "flex-row-reverse"
              } w-30 justify-center items-end`}
            >
              <div className="rounded-full bg-white w-10 h-10 border-2 border-[#00e731] ">
                <img
                  className="rounded-full bg-white object-cover"
                  src={yodaRed}
                  alt="yodaProfile"
                />
              </div>
              <div className="h-10 w-20 px-2 rounded-md flex flex-col justify-center items-center gap-2">
                <span className="text-white font-bold">{player.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Game Board */}
      <div className="absolute top-6 z-0 ">
        <img src={gameBoard} alt="gameBoard" className="h-160" />
      </div>
    </div>
  );
};

export default BoardGameSection;
