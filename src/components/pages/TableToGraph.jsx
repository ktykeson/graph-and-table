import React, { useState, useEffect } from "react";
import "chart.js/auto";
import styles from "../../styles/TableToGraph.module.css";
import LineLegend from "../LineLegend";
import Graph from "../Graph";
import { calculateLineEquation, formatEquation } from "../../ultis/calculation";
import TTG_Table from "../TTG_Table";

const graphRange = 10;

function TableToGraph() {
  const [dots, setDots] = useState([]);
  const [lines, setLines] = useState([]);
  const [lineDetails, setLineDetails] = useState([]);
  const [placeDotsActive, setPlaceDotsActive] = useState(false);
  const [drawLineActive, setDrawLineActive] = useState(false);
  const [selectedDotsForLine, setSelectedDotsForLine] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [tablesData, setTablesData] = useState([
    {
      lineIndex: 0, // Assuming default table data for initial display
      data: [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ], // Example default data, adjust as needed
    },
  ]);
  const [xyArrays, setXyArrays] = useState([]);
  const [exerciseMode, setExerciseMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [lineAnswer, setLineAnswer] = useState({ slope: 0, yIntercept: 0 });
  const [chartRef, setChartRef] = useState(null);

  // Toggle exercise mode, making "place dots" and "draw lines" usable
  const handleExerciseModeToggle = () => {
    if (exerciseMode) {
      // This means we're about to disable exercise mode, i.e., submit exercise
      handleSubmitExercise();
    } else {
      const xArray = tablesData[0].data.map((point) => point.x);
      const yArray = tablesData[0].data.map((point) => point.y);
      setXyArrays({ xArray, yArray });
      console.log("Saved X Array:", xArray);
      console.log("Saved Y Array:", yArray);

      if (xArray.length >= 2 && yArray.length >= 2) {
        const dot1 = { x: xArray[0], y: yArray[0] };
        const dot2 = { x: xArray[1], y: yArray[1] };

        console.log(
          "Calculating line equation with Dot1:",
          dot1,
          "Dot2:",
          dot2
        );
        const equation = calculateLineEquation(dot1, dot2);
        console.log("Calculated equation:", equation);
        setLineAnswer(equation);
      } else {
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
        y: newData.y[i],
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
      const { slope, yIntercept } = calculateLineEquation(
        userLine[0],
        userLine[1]
      );

      console.log(
        "User Line Slope:",
        slope,
        "User Line Y-Intercept:",
        yIntercept
      );
      console.log(
        "Correct Line Slope:",
        lineAnswer.slope,
        "Correct Line Y-Intercept:",
        lineAnswer.yIntercept
      );

      // Comparing the slope and y-intercept within a small tolerance could be needed due to floating-point arithmetic
      const slopeMatch = Math.abs(slope - lineAnswer.slope) < 0.01;
      const interceptMatch =
        Math.abs(yIntercept - lineAnswer.yIntercept) < 0.01;
      lineMatch = slopeMatch && interceptMatch;

      console.log(
        "Slope Match:",
        slopeMatch,
        "Intercept Match:",
        interceptMatch,
        "Line Match:",
        lineMatch
      );
    }

    // Assuming 'dots' contains all dots placed by the user and 'xyArrays' contains the correct dots
    if (dots.length < xyArrays.xArray.length) {
      pointsMatch = false; // There are less dots placed than needed
      console.log("Not enough dots placed.");
    } else {
      for (let i = 0; i < xyArrays.xArray.length; i++) {
        const pointMatch = dots.find(
          (dot) => dot.x === xyArrays.xArray[i] && dot.y === xyArrays.yArray[i]
        );
        if (!pointMatch) {
          pointsMatch = false;
          console.log(
            `Point mismatch at index ${i}: Expected (${xyArrays.xArray[i]}, ${xyArrays.yArray[i]})`
          );
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
    <div className={styles.tableToGraph}>
      <div>
        {tablesData.length > 0 &&
          tablesData.map((table, index) => (
            <TTG_Table
              exerciseBoolean={exerciseMode}
              key={index}
              tableData={tablesData[0].data}
              onTableDataChange={(newData) => handleTableDataChange(newData, 1)}
            />
          ))}
      </div>
      <div className={styles.graph_box}>
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
          lineDetails={lineDetails}
          setLineDetails={setLineDetails}
          setChartRef={setChartRef}
        />
        <div className={styles.flexCenter}>
          <LineLegend lineDetails={lineDetails} />
          <div className={styles.arrowBox}>
            <button
              onClick={handleExerciseModeToggle}
              className={styles.activeButton}
            >
              {" "}
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
              {exerciseMode ? "Submit Exercise" : "Make Exercise"}
            </button>
            <br />
            <button
              onClick={() => {
                setPlaceDotsActive(!placeDotsActive);
                setDrawLineActive(false);
              }}
              disabled={!exerciseMode}
              className={
                exerciseMode ? styles.activeButton : styles.inactiveButton
              }
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
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM15.375 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                ></path>
              </svg>
              {placeDotsActive ? "Placing Dots..." : "Place Dots"}
            </button>
            <br />
            <button
              onClick={() => {
                setDrawLineActive(!drawLineActive);
                setPlaceDotsActive(false);
              }}
              type="button"
              disabled={!exerciseMode}
              className={
                exerciseMode ? styles.activeButton : styles.inactiveButton
              }
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
            <br />

            <br />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableToGraph;
