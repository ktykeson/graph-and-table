import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import "chart.js/auto";
import "./App.css";
import Table from "./components/Table";
import LineLegend from "./components/LineLegend";
import Graph from "./components/Graph";
import { calculateLineEquation, formatEquation } from "./ultis/calculation";

const graphRange = 10;

function App() {
  const [dots, setDots] = useState([]);
  const [lines, setLines] = useState([]);
  const [lineColors, setLineColors] = useState([]);
  const [placeDotsActive, setPlaceDotsActive] = useState(false);
  const [drawLineActive, setDrawLineActive] = useState(false);
  const [selectedDotsForLine, setSelectedDotsForLine] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [tablesData, setTablesData] = useState([{
    lineIndex: 0, // Assuming default table data for initial display
    data: [{ x: 0, y: 0 }, { x: 1, y: 1 }] // Example default data, adjust as needed
  }]);
  const [xyArrays, setXyArrays] = useState([]);
  const [exerciseMode, setExerciseMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [lineAnswer, setLineAnswer] = useState({slope: 0, yIntercept: 0});

  // Toggle exercise mode, making "place dots" and "draw lines" usable
  const handleExerciseModeToggle = () => {
    if (exerciseMode) { // This means we're about to disable exercise mode, i.e., submit exercise
      handleSubmitExercise();
    }
    else {
      const xArray = tablesData[0].data.map(point => point.x);
      const yArray = tablesData[0].data.map(point => point.y);
      setXyArrays({ xArray, yArray });
      console.log("Saved X Array:", xArray);
      console.log("Saved Y Array:", yArray);

      if (xArray.length >= 2 && yArray.length >= 2) {
        const dot1 = { x: xArray[0], y: yArray[0] };
        const dot2 = { x: xArray[1], y: yArray[1] };
      
        console.log("Calculating line equation with Dot1:", dot1, "Dot2:", dot2);
        const equation = calculateLineEquation(dot1, dot2);
        console.log("Calculated equation:", equation);
        setLineAnswer(equation);
      }
      else {
        alert("ERROR Saving Answer");
      }
    }
    setExerciseMode(!exerciseMode);
  };

  const handleTableDataChange = (newData, tableIndex) => {
    // Create a new array to avoid mutating state directly
    const updatedTablesData = [...tablesData];
    
    // Check if the table exists and update its data
    if (updatedTablesData[tableIndex]) {
      updatedTablesData[tableIndex].data = newData.map((x, i) => ({
        x: x,
        y: newData.y[i]
      }));
    }
  
    setTablesData(updatedTablesData);
  };

  const handleSubmitExercise = () => {
    let lineMatch = false;
  let pointsMatch = true; // Default to true, check each point to possibly set to false

  // Check if there's at least one line drawn by the user
  if (lines.length > 0) {
    const userLine = lines[0]; // Assuming the first drawn line is what we want to check
    const { slope, yIntercept } = calculateLineEquation(userLine[0], userLine[1]);

    console.log("User Line Slope:", slope, "User Line Y-Intercept:", yIntercept);
    console.log("Correct Line Slope:", lineAnswer.slope, "Correct Line Y-Intercept:", lineAnswer.yIntercept);

    // Comparing the slope and y-intercept within a small tolerance could be needed due to floating-point arithmetic
    const slopeMatch = Math.abs(slope - lineAnswer.slope) < 0.01;
    const interceptMatch = Math.abs(yIntercept - lineAnswer.yIntercept) < 0.01;
    lineMatch = slopeMatch && interceptMatch;
    
    console.log("Slope Match:", slopeMatch, "Intercept Match:", interceptMatch, "Line Match:", lineMatch);
  }

  // Assuming 'dots' contains all dots placed by the user and 'xyArrays' contains the correct dots
  if (dots.length < xyArrays.xArray.length) {
    pointsMatch = false; // There are less dots placed than needed
    console.log("Not enough dots placed.");
  } else {
    for (let i = 0; i < xyArrays.xArray.length; i++) {
      const pointMatch = dots.find(dot => dot.x === xyArrays.xArray[i] && dot.y === xyArrays.yArray[i]);
      if (!pointMatch) {
        pointsMatch = false;
        console.log(`Point mismatch at index ${i}: Expected (${xyArrays.xArray[i]}, ${xyArrays.yArray[i]})`);
        break; // Stop checking if any point doesn't match
      }
    }
  }

  console.log("Points Match:", pointsMatch);

  
    if (lineMatch && pointsMatch) {
      alert("Correct");
    } else if (lineMatch) {
      alert("Line was correct, but the points are incorrect");
    } else {
      alert("Incorrect");
    }
    //setShowPopup(true); // Assuming you have a mechanism to show popups
  };

  useEffect(() => {
    if (!exerciseMode) {
      setPlaceDotsActive(false);
      setDrawLineActive(false);
    }
  }, [exerciseMode]);

  return (
    <div className="App">
      <div className="graph_box">
        <Graph
          graphRange={graphRange}
          placeDotsActive={placeDotsActive}
          drawLineActive={drawLineActive}
          dots={dots}
          setDots={setDots}
          lines={lines}
          setLines={setLines}
          selectedDotsForLine={selectedDotsForLine}
          setSelectedDotsForLine={setSelectedDotsForLine}
          lineColors={lineColors}
          setLineColors={setLineColors}
        />
        <div style={{ width: "20%" }}>
          <LineLegend lines={lines} lineColors={lineColors} />
          <div className="arrow_box">
            <button onClick={() => {
                setPlaceDotsActive(!placeDotsActive);
                setDrawLineActive(false);
              }} 
            disabled={!exerciseMode}
            type="button"
            style={{ 
              backgroundColor: exerciseMode ? 'rgb(29, 119, 255)' : '#ccc',
              cursor: exerciseMode ? 'pointer' : 'default'
            }}
            >
              {placeDotsActive ? "Placing Dots..." : "Place Dots"}
            </button>
            <br />
            <button onClick={() => {
                setDrawLineActive(!drawLineActive);
                setPlaceDotsActive(false);
              }} 
            type="button"
            disabled={!exerciseMode}
            style={{ 
              backgroundColor: exerciseMode ? 'rgb(29, 119, 255)' : '#ccc',
              cursor: exerciseMode ? 'pointer' : 'default'
            }}
            >
              {drawLineActive ? "Drawing Line..." : "Draw Line"}
            </button>
            <br />
              <button onClick={handleExerciseModeToggle}>
                {exerciseMode ? "Submit Exercise" : "Make Exercise"}
              </button>
            <br />
          </div>
        </div>
      </div>
      <div>
        {tablesData.length > 0 && tablesData.map((table, index) => (
          <Table 
          exerciseBoolean={exerciseMode} 
          key={index} 
          tableData={tablesData[0].data}
          onTableDataChange={(newData) => handleTableDataChange(newData, 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
