import { Routes, Route, Navigate } from "react-router-dom";
import Admin from "./Admin";
import Cliente from "./Cliente";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/cliente" />} />
      <Route path="/agendamento" element={<Cliente />} />
      <Route path="/painel-nayan" element={<Admin />} />
    </Routes>
  );
}

export default App;