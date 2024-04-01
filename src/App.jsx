import React, { useState } from "react";
import { Scatter } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-plugin-datalabels";
import "./App.css";
import { useEffect } from "react";
import Table from "./components/Table";
import LineLegend from "./components/LineLegend";
import Graph from "./components/Graph";
import { generateTableDataForLine } from "./ultis/calculation";

// Constants for graph range
const graphRange = 10;

function App() {
  const [dots, setDots] = useState([]);
  const [lineDetails, setLineDetails] = useState([]);
  const [placeDotsActive, setPlaceDotsActive] = useState(false);
  const [drawLineActive, setDrawLineActive] = useState(false);
  const [selectedDotsForLine, setSelectedDotsForLine] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [tablesData, setTablesData] = useState([]);
  const [xyArrays, setXyArrays] = useState([]);
  const [exerciseMode, setExerciseMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [chartRef, setChartRef] = useState(null);

  // Toggle exercise mode and handle submission
  const handleExerciseModeToggle = async () => {
    if (exerciseMode) {
      // Submit mode: Check answers
      const correct = checkAnswers();
      await resetUserAnswers();
      alert(correct ? "Correct!" : "Incorrect, try again.");
    }
    setExerciseMode(!exerciseMode);
  };

  //test/ test
  // Handle user input in exercise mode testetsest
  const handleUserInput = (tableIndex, valueIndex, value) => {
    // Make a deep copy of the current userAnswers state to avoid direct mutation
    const updatedAnswers = userAnswers.map((answer, index) => {
      if (index === tableIndex) {
        // If it's the correct table, update the y value at valueIndex
        const newY = [...answer.y]; // Copy the existing y array
        newY[valueIndex] = parseInt(value, 10); // Update the value at the index
        return { ...answer, y: newY }; // Return a new object with the updated y array
      }
      return answer; // For other items, return them as they are
    });

    setUserAnswers(updatedAnswers);
  };

  useEffect(() => {
    const hideDots = () => {
      const chart = chartRef.current;
      console.log(chart);
      if (!chart) return;
      console.log("hiding");

      // Assuming the dots dataset is the first dataset (index 0)
      const datasetIndex = 0;
      chart.getDatasetMeta(datasetIndex).hidden = true; // Toggle visibility
      chart.update(); // Step 3: Update the chart
    };
    const displayDots = () => {
      const chart = chartRef.current;
      console.log(chart);
      if (!chart) return;
      console.log("hiding");

      // Assuming the dots dataset is the first dataset (index 0)
      const datasetIndex = 0;
      chart.getDatasetMeta(datasetIndex).hidden = false; // Toggle visibility
      chart.update(); // Step 3: Update the chart
    };
    console.log(chartRef.current);
    if (exerciseMode) hideDots();
    else displayDots();
  }, [chartRef, exerciseMode]);

  // Check if user's answers match the correct answers
  const checkAnswers = () => {
    return tablesData.every((table, tableIndex) => {
      console.log(table);
      return table.data.every((point, pointIndex) => {
        return (
          userAnswers[tableIndex] &&
          userAnswers[tableIndex].y[pointIndex] == point.y
        );
      });
    });
  };

  // Function to handle "Make Tables" button click
  const handleMakeTables = () => {
    const newTablesData = [];
    const newXYArrays = lineDetails.map((details, index) => {
      const tableData = generateTableDataForLine(details.line, graphRange);
      newTablesData.push({ lineIndex: index + 1, data: tableData });

      // Extracting X and Y arrays
      const xArray = tableData.map((point) => point.x);
      const yArray = tableData.map((point) => point.y);

      console.log(`Line ${index + 1} X Array:`, xArray);
      console.log(`Line ${index + 1} Y Array:`, yArray);

      // Return structure for saving in state
      return { lineIndex: index + 1, xArray, yArray };
    });

    console.log("New tables data:", newTablesData);
    setTablesData(newTablesData);
    setXyArrays(newXYArrays); // Saving the XY arrays for future access
  };

  // Functions for toggling modes remain unchanged
  const togglePlaceDots = () => {
    setPlaceDotsActive(!placeDotsActive);
    setDrawLineActive(false);
    setSelectedDotsForLine([]);
  };

  const toggleDrawLine = () => {
    setDrawLineActive(!drawLineActive);
    setPlaceDotsActive(false);
    setSelectedDotsForLine([]);
  };

  const resetUserAnswers = async () => {
    const answers = tablesData.map((tableData) => {
      const xHeaders = tableData.data.map((point) => point.x);
      const yValues = tableData.data.map((point) => point.y);
      return { x: xHeaders, y: yValues };
    });
    setUserAnswers(answers);
  };
  useEffect(() => {
    // This presumes you have a way to generate answers based on tablesData
    const answers = tablesData.map((tableData) => {
      const xHeaders = tableData.data.map((point) => point.x);
      const yValues = tableData.data.map((point) => point.y);
      return { x: xHeaders, y: yValues };
    });
    setUserAnswers(answers);
  }, [tablesData]); // Re-run this effect only if tablesData changes

  return (
    <div className="App">
      <div className="graph_box">
        <Graph
          graphRange={graphRange}
          placeDotsActive={placeDotsActive}
          drawLineActive={drawLineActive}
          dots={dots}
          setDots={setDots}
          selectedDotsForLine={selectedDotsForLine}
          setSelectedDotsForLine={setSelectedDotsForLine}
          lineDetails={lineDetails}
          setLineDetails={setLineDetails}
          setChartRef={setChartRef}
        />

        <div style={{ width: "20%" }}>
          <LineLegend lineDetails={lineDetails} />
          <div className="arrow_box">
            <button onClick={togglePlaceDots} type="button">
              {placeDotsActive ? "Placing Dots..." : "Place Dots"}
            </button>
            <br />
            <button
              onClick={toggleDrawLine}
              type="button"
              style={{
                display: `${dots.length > 1 ? "block" : "none"}`,
                marginTop: "10px",
              }}
            >
              {drawLineActive ? "Drawing Line..." : "Draw Line"}
            </button>
            <br />
            <button
              onClick={handleMakeTables}
              type="button"
              style={{
                display: `${lineDetails.length > 0 ? "block" : "none"}`,
                marginTop: "10px",
              }}
            >
              Make Tables
            </button>
            <button
              onClick={handleExerciseModeToggle}
              type="button"
              style={{
                display: `${tablesData.length > 0 ? "block" : "none"}`,
                marginTop: "10px",
              }}
            >
              {exerciseMode ? "Submit" : "Make Exercise"}
            </button>
          </div>
        </div>
      </div>
      {/* Use the renderTable function to render tables for all lines */}
      <div>
        {tablesData.length > 0 ? (
          tablesData.map((table, index) => (
            <Table
              key={index}
              tableData={table}
              exerciseMode={exerciseMode}
              handleUserInput={handleUserInput}
            />
          ))
        ) : (
          <p>No table data available. Draw lines and click "Make Tables".</p>
        )}
      </div>
    </div>
  );
}

export default App;
