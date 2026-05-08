import { Routes, Route, Navigate } from "react-router-dom";
import Admin from "./Admin";
import Cliente from "./Cliente";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cliente" />} />
      <Route path="/" element={<Cliente />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
