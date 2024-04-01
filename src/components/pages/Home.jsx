// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  let navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the App</h1>
      <div>
        <button onClick={() => navigate("/graph-to-table")}>
          Graph to Table
        </button>
        <button onClick={() => navigate("/table-exercise")}>
          Table Exercise
        </button>
        <button onClick={() => navigate("/table-to-graph")}>
          Table to Graph
        </button>
      </div>
    </div>
  );
};

export default Home;
