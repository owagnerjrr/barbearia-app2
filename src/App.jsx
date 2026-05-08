import { Routes, Route } from "react-router-dom";
import Admin from "./Admin";
import Cliente from "./Cliente";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Cliente />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
