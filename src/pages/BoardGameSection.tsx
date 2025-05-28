import { useEffect, useState } from "react";
import gameBoard from "../../public/table.png";
import yodaRed from "../../public/profile/yodaRed.png";
import axios from "axios";
import SelectRoomModal from "../components/SelectRoomModal";
import type Room from "../types/Room";
import type Player from "../types/Player";

const BoardGameSection = () => {
  const [closeModal, setCloseModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [mainPlayer, setMainPlayer] = useState<Player | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
  const [time, setTime] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
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
  }, [closeModal]);

  useEffect(() => {
    if (isGameStarted) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isGameStarted]);

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
      <div className="w-full ml-10 flex flex-col">
        <span>
          <span className="text-black text-lg font-bold">Server: </span>
          <span className="text-[#ca0639] text-lg font-bold">
            {selectedRoom.serverName}
          </span>
        </span>
        {isGameStarted && (
          <button
            onClick={() => {
              setIsGameStarted(true);
            }}
            className="px-6 py-3 w-40 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-all"
          >
            Join Room
          </button>
        )}
      </div>
      <span className="font-mono">
        Time:
        {String(Math.floor(time / 3600)).padStart(2, "0")}:
        {String(Math.floor((time % 3600) / 60)).padStart(2, "0")}:
        {String(time % 60).padStart(2, "0")}
      </span>

      {/* Main Player */}
      <div className="absolute -bottom-1 z-10 right-155 flex flex-col items-center justify-center">
        <div className="rounded-full bg-white w-26 h-26 border-4 border-[#00e731]">
          <img
            className="rounded-full bg-white object-cover"
            src={yodaRed}
            alt="yodaProfile"
          />
        </div>
        <div className="border-2 border-[#00e731] h-15 w-26 bg-[#021323] rounded-md flex flex-col justify-center items-center gap-2 px-2">
          <span className="text-white font-bold">{mainPlayer?.name}</span>
        </div>
      </div>

      {/* Other Players */}
      <div className="flex flex-col justify-between h-full w-full px-60 py-8 z-10">
        <div className="grid grid-cols-2 gap-x-180 gap-y-10 w-10 h-fit ">
          {otherPlayers.map((player, index) => (
            <div
              key={index}
              className="flex flex-col w-30 justify-center items-end"
            >
              <div className="rounded-full bg-white w-26 h-26 border-4 border-[#00e731]">
                <img
                  className="rounded-full bg-white object-cover"
                  src={yodaRed}
                  alt="yodaProfile"
                />
              </div>
              <div className="border-2 border-[#00e731] h-15 w-26 bg-[#021323] rounded-md flex flex-col justify-center items-center gap-2 px-2">
                <span className="text-white font-bold">{player.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Background Game Board */}
      <div className="absolute top-6 z-0">
        <img src={gameBoard} alt="gameBoard" className="h-160" />
      </div>
    </div>
  );
};

export default BoardGameSection;
