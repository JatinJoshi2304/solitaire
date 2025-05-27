import { useState } from "react";
import { Link } from "react-router-dom";
import gameBoard from "../../public/table.png";
import yodaRed from "../../public/profile/yodaRed.png";
import ChooseGameModal from "../components/ChooseGameModal";
import SelectRoomModal from "../components/SelectRoomModal";

import type Room from "../types/Room";
const BoardGameSection = () => {
  const [showGames, setShowGames] = useState(false);
  const [chooseGame, setChooseGame] = useState(false);
  const [SelectedRoom, setselectedRoom] = useState<Room | null>(null);
  const handleCloseChooseModal = (close: boolean) => {
    setChooseGame(close);
  };

  const handleRoomSelected = (selected: Room) => {
    setselectedRoom(selected);
    console.log("Selecetd Room:", selected);
  };

  if (!SelectedRoom) {
    return (
      <SelectRoomModal
        closeModal={handleCloseChooseModal}
        updateRoom={handleRoomSelected}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center ">
      <div className=" w-full ml-10">
        <span className="text-black text-lg font-bold hover:text-black cursor-pointer">
          Server :{" "}
        </span>
        <span className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer ">
          {SelectedRoom.serverName}
        </span>
        <button className="">dr</button>
      </div>

      <div className="px-[10%] flex gap-2 my-2 z-10">
        {/* <button
          className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer"
          onClick={() => setChooseGame(!chooseGame)}
        >
          Start game
        </button>
        <span className="text-[#ca0639] text-lg font-bold">{" | "}</span>
        <button className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer ">
          New Game
        </button>
        <span className="text-[#ca0639] text-lg font-bold">{" | "}</span>
        <button className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer">
          Rules
        </button>
        <span className="text-[#ca0639] text-lg font-bold">{" | "}</span>
        <button
          className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer"
          onClick={() => setShowGames(!showGames)}
        >
          Games
        </button> */}
        {showGames && (
          <div className="bg-white p-2 absolute z-500 top-25 ml-35 rounded shadow-md mb-2">
            <ul className=" list-none ">
              <li className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer">
                {/* <Link to={{"/canfieldsolitaire"}}> Canfield Solitaire</Link> */}
                <Link to="/canfieldsolitaire">Canfield Solitaire</Link>
              </li>
              <li className="text-[#ca0639] text-lg font-bold hover:text-black cursor-pointer">
                <Link to="/allInArena">All-In Arena</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-col items-around justify-between h-full w-full px-60 py-8 z-10">
        <div className="absolute -bottom-1 z-0 right-155 flex flex-col items-center justify-center">
          <div className="rounded-full bg-white w-26 h-26 border-4 border-[#00e731]">
            <img
              className="rounded-full bg-white object-cover"
              src={yodaRed}
              alt="yodaProfile"
            />
          </div>
          <div className="border-2 border-[#00e731] h-20 w-40 bg-[#021323] rounded-md flex flex-col justify-center items-center gap-2 px-2">
            <span className="text-white font-bold">Jatin</span>
            {/* <span className="bg-gray-700 h-6 w-px"></span> */}
            {/* Optional: You can add more info after the separator */}
            <span className="text-white text-sm">3000</span>
          </div>
        </div>
        <div className="w-full h-fit flex flex-row ">
          {/* <div className=" flex flex-col justify-center items-center">
            <div className="rounded-full bg-white w-26 h-26 border-4 border-[#00e731]">
              <img
                className="rounded-full bg-white object-cover"
                src={yodaRed}
                alt="yodaProfile"
              />
            </div>
            <div className="border-2 border-[#00e731] h-15 w-30 bg-[#021323] rounded-md">
              <span className="text-white font-bold">Jatin</span>
            </div>
          </div> */}
          {/* <div>
            <div className="rounded-full bg-white w-full h-full border-5 border-green-600">
              <img
                className="rounded-full bg-white object-cover"
                src={YodaGreen}
                alt="yodaProfile"
              />
            </div>
          </div> */}
        </div>
        <div className="w-full flex flex-row justify-between">
          {/* <div>
            <div className="rounded-full bg-white w-full h-full border-5 border-blue-900">
              <img
                className="rounded-full bg-white object-cover"
                src={yodaBlue}
                alt="yodaProfile"
              />
            </div>
          </div> */}
          {/* <div>
            <div className="rounded-full bg-white w-full h-full border-5 border-black-600">
              <img
                className="rounded-full bg-white object-cover"
                src={yodaBlack}
                alt="yodaProfile"
              />
            </div>
          </div> */}
        </div>
      </div>
      <div className="absolute top-6 z-0">
        <img src={gameBoard} alt="" className="h-160" />
      </div>
      {/* {chooseGame && <ChooseGameModal closeModal={handleCloseChooseModal} />} */}
    </div>
  );
};

export default BoardGameSection;
