// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GraphToTable from "./components/pages/GraphToTable";
import TableExercise from "./components/pages/TableExercise";
import TableToGraph from "./components/pages/TableToGraph";
import Home from "./components/pages/Home";
import "./styles/globals.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />{" "}
        {/* Set Home as the default route */}
        <Route path="/graph-to-table" element={<GraphToTable />} />
        <Route path="/table-exercise" element={<TableExercise />} />
        <Route path="/table-to-graph" element={<TableToGraph />} />
      </Routes>
    </Router>
  );
};

export default App;
