import React, { useState } from "react";
import "chart.js/auto";
import "chartjs-plugin-datalabels";
import styles from "../../styles/GraphToTable.module.css";
import { useEffect } from "react";
import Table from "../Table";
import LineLegend from "../LineLegend";
import Graph from "../Graph";
import { generateTableDataForLine } from "../../ultis/calculation";

// Constants for graph range
const graphRange = 10;

function GraphToTable() {
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
    if (chartRef)
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
  }, [tablesData]); // Re-run this effect only if tablesData changes

  return (
    <div className={styles.graphToTable}>
      <div className={styles.graphBox}>
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
        <div className={styles.centerContent}>
          {tablesData.length > 0 ? (
            tablesData.map((table, index) => (
              <Table
                key={index}
                tableData={table}
                exerciseMode={exerciseMode}
                handleUserInput={handleUserInput}
                styles={styles}
              />
            ))
          ) : (
            <p>No table data available. Draw lines and click "Make Tables".</p>
          )}
        </div>
      </div>
      {/* Use the renderTable function to render tables for all lines */}
      <div className={styles.flexCenter}>
        <div className={styles.legendBox}>
          <LineLegend lineDetails={lineDetails} />
        </div>

        <div className={styles.arrowBox}>
          <button onClick={togglePlaceDots} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.btnIcon}
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM15.375 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
              ></path>
            </svg>

            {placeDotsActive ? "Placing Dots..." : "Place Dots"}
          </button>

          <button
            onClick={toggleDrawLine}
            type="button"
            style={{
              display: `${dots.length > 1 ? "block" : "none"}`,
              marginTop: "10px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.btnIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
              />
            </svg>

            {drawLineActive ? "Drawing Line..." : "Draw Line"}
          </button>
        </div>
        <div className={styles.arrowBox}>
          <button
            onClick={handleMakeTables}
            type="button"
            style={{
              display: `${lineDetails.length > 0 ? "block" : "none"}`,
              marginTop: "10px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.btnIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
              />
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.btnIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>

            {exerciseMode ? "Submit" : "Make Exercise"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GraphToTable;
