import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PlaySection from "../pages/PlaySection";

const CanfieldSolitaire = () => {
  return (
    <div className=" h-screen bg-gradient-to-b from-[#afcffe] to-white px-[15%] py-5 flex flex-col items-center ">
      <h1 className="text-4xl text-bold inline">CANFIELD SOLITAIRE</h1>
      <DndProvider backend={HTML5Backend}>
        <PlaySection />
      </DndProvider>
    </div>
  );
};

export default CanfieldSolitaire;
