<<<<<<< HEAD
﻿import { Routes, Route, Navigate } from "react-router-dom";
=======
﻿import { Routes, Route } from "react-router-dom";
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
import Admin from "./Admin";
import Cliente from "./Cliente";

function App() {
  return (
    <Routes>
<<<<<<< HEAD
      <Route path="/" element={<Navigate to="/cliente" />} />
      <Route path="/cliente" element={<Cliente />} />
=======
      <Route path="/" element={<Cliente />} />
>>>>>>> a8a6166363017e8bcd834d6622dbbfc83f647cbd
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
