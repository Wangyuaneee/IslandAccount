import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import AlgorithmDetails from "@/pages/AlgorithmDetails";
import History from "@/pages/History";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/algorithms" element={<AlgorithmDetails />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}
