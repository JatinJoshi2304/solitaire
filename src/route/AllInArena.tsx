import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardGameSection from "../pages/BoardGameSection";
const AllInArena = () => {
  return (
    <div className=" h-screen bg-gradient-to-b from-[#afcffe] to-white py-5 flex flex-col items-center ">
      <h1 className="text-4xl font-semibold text-gray-700 ">ALL - IN ARENA </h1>
      <DndProvider backend={HTML5Backend}>
        <BoardGameSection />
      </DndProvider>
    </div>
  );
};

export default AllInArena;
// text-2xl font-bolddark:text-white
