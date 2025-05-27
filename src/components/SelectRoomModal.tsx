import { useEffect, useState } from "react";
import type Room from "../types/Room";
import { FaLock, FaLockOpen } from "react-icons/fa";
import gameBoard from "../../public/table.png";
import axios from "axios";

interface SelectRoomModalProps {
  closeModal: (value: boolean) => void;
  updateRoom: (value: Room) => void;
}

const SelectRoomModal = ({ closeModal, updateRoom }: SelectRoomModalProps) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [serverName, setServerName] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [createRoomSelected, setCreateRoomSelected] = useState(false);
  const [joinRoomSelected, setJoinRoomSelected] = useState(true);
  const [joinRoom, setJoinRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/rooms");
      setRooms(response.data.room);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleClose = () => closeModal(false);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setJoinRoom(true);
    setJoinRoomSelected(false);
    setPassword(""); // clear password on room select
  };

  const handleJoinRoom = async () => {
    if (!selectedRoom || !userName.trim()) {
      alert("Please select a room and enter a username.");
      return;
    }

    try {
      const roomId = selectedRoom._id;
      debugger;
      const res = await axios.post(
        `http://localhost:5000/api/rooms/${roomId}/join`,
        {
          name: userName,
          code: password,
        }
      );
      updateRoom(res.data);
      closeModal(true);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to join room");
    }
  };

  const handleCreateRoom = async () => {
    if (!serverName.trim() || !userName.trim()) {
      alert("Please enter both server name and username.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/rooms", {
        serverName,
        code: password,
        name: userName,
      });
      const createdRoom = res.data;
      setSelectedRoom(createdRoom);
      updateRoom(createdRoom);
      closeModal(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error creating room");
    }
  };

  return (
    <div
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50"
      onClick={handleClose}
    >
      <div className="absolute top-6 z-0">
        <img src={gameBoard} alt="" className="h-160" />
      </div>
      <div
        className="bg-white dark:bg-gray-900 w-100 max-w-3xl mx-4 h-4/5 rounded-lg overflow-y-scroll shadow-lg p-6 relative top-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Multiplayer Rooms
          </h2>
        </div>

        {/* Top Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={() => {
              setJoinRoomSelected(true);
              setCreateRoomSelected(false);
              setJoinRoom(false);
              setSelectedRoom(null);
              setPassword("");
            }}
            className={`px-6 py-3 ${
              joinRoomSelected ? "bg-green-800" : "bg-green-600"
            } text-white font-semibold rounded-lg shadow-md hover:bg-green-800 transition-all`}
          >
            Join Room
          </button>
          <button
            onClick={() => {
              setCreateRoomSelected(true);
              setJoinRoomSelected(false);
              setJoinRoom(false);
              setSelectedRoom(null);
              setServerName("");
              setPassword("");
            }}
            className={`px-6 py-3 ${
              createRoomSelected ? "bg-blue-800" : "bg-blue-600"
            } text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition-all`}
          >
            Create Room
          </button>
        </div>

        {/* Create Room Form */}
        {createRoomSelected && (
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Server Name
              </label>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Enter server name"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Password (optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Enter Username"
              />
            </div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
          </div>
        )}

        {/* Room List */}
        {joinRoomSelected && (
          <div className="overflow-x-auto rounded-sm">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3">Server Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr
                    key={room._id}
                    className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{room.serverName}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      {room.isPasswordProtected ? (
                        <>
                          <FaLock className="text-red-500" /> Protected
                        </>
                      ) : (
                        <>
                          <FaLockOpen className="text-green-500" /> Open
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-600 hover:underline dark:text-blue-400"
                        onClick={() => handleSelectRoom(room)}
                      >
                        Join
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Join Room Form */}
        {joinRoom && selectedRoom && (
          <div className="mt-6 space-y-4">
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              Joining{" "}
              <span className="text-blue-600">{selectedRoom.serverName}</span>
            </p>
            {selectedRoom.isPasswordProtected && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                  placeholder="Enter password"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Username
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Enter username"
              />
            </div>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
              onClick={handleJoinRoom}
            >
              Join Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectRoomModal;
