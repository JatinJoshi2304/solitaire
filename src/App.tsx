import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import CanfieldSolitaire from "./route/CanfieldSolitaire";
import AllInArena from "./route/AllInArena";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CanfieldSolitaire />} />
        <Route path="/allInArena" element={<AllInArena />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
