import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomePaciente from "./pages/Paciente/Home";
import HomeTerapeuta from "./pages/Terapeuta/TerapeutaHome";
import HomeRecepcion from "./pages/Recepcion/HomeRecepcion";
import HomeAdmin from "./pages/Admin/Home";

function App() {
  const rol = localStorage.getItem("rol");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/paciente" element={rol === "paciente" ? <HomePaciente /> : <Navigate to="/" />} />
        <Route path="/terapeuta" element={rol === "terapeuta" ? <HomeTerapeuta /> : <Navigate to="/" />} />
        <Route path="/recepcion" element={rol === "recepcion" ? <HomeRecepcion /> : <Navigate to="/" />} />
        <Route path="/admin" element={rol === "admin" ? <HomeAdmin /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
