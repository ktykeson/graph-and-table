import React, { useState } from "react";
import { Scatter } from "react-chartjs-2";
import "chart.js/auto";
import "chartjs-plugin-datalabels";
import "./App.css";
import { useEffect } from "react";

// Constants for graph range
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
  const [tablesData, setTablesData] = useState([]);
  const [xyArrays, setXyArrays] = useState([]);
  const [exerciseMode, setExerciseMode] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  // Function to generate random color
  const generateRandomColor = () => {
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    // Ensure color is not too light or black
    while (color === "#FFFFFF" || color === "#000000" || color.length < 7) {
      color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
    return color;
  };

  // Function to calculate line equation
  const calculateLineEquation = (dot1, dot2) => {
    const slope = (dot2.y - dot1.y) / (dot2.x - dot1.x);
    const yIntercept = dot1.y - slope * dot1.x;
    return { slope, yIntercept };
  };

  // Function to format equation for display
  const formatEquation = ({ slope, yIntercept }) => {
    return `y = ${slope.toFixed(2)}x + ${yIntercept.toFixed(2)}`;
  };

  // Function to generate table data for a line
  const generateTableDataForLine = (line) => {
    const { slope, yIntercept } = calculateLineEquation(line[0], line[1]);
    let tableData = [];
    let pointsFound = 0;
    // Start searching from x = -graphRange to x = graphRange
    for (let x = -graphRange; pointsFound < 7 && x <= graphRange; x++) {
      let y = slope * x + yIntercept;
      // Adjust the condition to try to include more points
      if (Math.round(y) === y) {
        // Check if y is an integer
        tableData.push({ x, y });
        pointsFound++;
      }
    }
    // If not enough whole number points are found, consider extending the search or altering criteria
    return tableData;
  };

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

  // Handle user input in exercise mode
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

  // Check if user's answers match the correct answers
  const checkAnswers = () => {
    return tablesData.every((table, tableIndex) => {
      console.log(table);
      return table.data.every((point, pointIndex) => {
        console.log(table.data);
        console.log(userAnswers);
        console.log(userAnswers[tableIndex]);
        console.log(userAnswers[tableIndex].y[pointIndex]);
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
    const newXYArrays = lines.map((line, index) => {
      const tableData = generateTableDataForLine(line);
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

  const data = {
    labels: Array.from(
      { length: graphRange * 2 + 1 },
      (_, i) => i - graphRange
    ),
    datasets: [
      {
        label: "Dots",
        data: dots,
        backgroundColor: "black",
        pointRadius: 5,
      },
      ...lines.map((line, index) => {
        const { slope, yIntercept } = calculateLineEquation(line[0], line[1]);
        const extendedStart = {
          x: -graphRange,
          y: slope * -graphRange + yIntercept,
        };
        const extendedEnd = {
          x: graphRange,
          y: slope * graphRange + yIntercept,
        };
        return {
          label: `Line ${index + 1}: ${formatEquation({ slope, yIntercept })}`,
          data: [extendedStart, extendedEnd],
          type: "line",
          fill: false,
          borderColor: lineColors[index],
          borderWidth: 2,
          showLine: true,
          lineTension: 0,
          pointRadius: 5,
        };
      }),
    ],
  };

  // Options remain unchanged
  const options = {
    scales: {
      y: {
        type: "linear",
        position: "center",
        min: -graphRange,
        max: graphRange,
        grid: {
          color: "rgba(0, 60, 150, 0.3)",
          borderColor: "rgba(255, 255, 255, 0.25)",
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        type: "linear",
        position: "center",
        min: -graphRange,
        max: graphRange,
        grid: {
          color: "rgba(0, 60, 150, 0.3)",
          borderColor: "rgba(0, 60, 150, 0.25)",
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      datalabels: {
        color: "black",
        align: "top",
        anchor: "end",
        formatter: (value, context) => {
          const dot = context.chart.data.datasets[0].data[context.dataIndex];
          return `(${dot.x}, ${dot.y})`;
        },
        font: {
          weight: "bold",
          size: 10,
        },
        offset: 5,
      },
      legend: {
        display: true, // Ensure legends are displayed to show equations
        position: "bottom",
        labels: {
          // This function ensures that the color of the text in the legend matches the line color
          color: (context) => {
            // Assuming lineColors is an array of colors corresponding to each line
            return lineColors[context.datasetIndex - 1] || "black"; // -1 because the first dataset is dots
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: false, // Disable tooltips as per your setup
      },
    },
    onClick: (e) => {
      if (!placeDotsActive && !drawLineActive) return;

      const canvasPosition = e.chart.canvas.getBoundingClientRect();
      const x = Math.round(
        e.chart.scales.x.getValueForPixel(e.native.x - canvasPosition.x)
      );
      const y = Math.round(
        e.chart.scales.y.getValueForPixel(e.native.y - canvasPosition.y)
      );

      if (placeDotsActive) {
        // Existing logic for placing dots remains unchanged
        const clickThreshold = 0.5;
        const existingIndex = dots.findIndex(
          (dot) =>
            Math.abs(dot.x - x) <= clickThreshold &&
            Math.abs(dot.y - y) <= clickThreshold
        );

        if (existingIndex >= 0) {
          // Logic for removing a dot and its connected lines remains unchanged
          const filteredLines = lines.filter(
            (line) =>
              !(
                line[0].x === dots[existingIndex].x &&
                line[0].y === dots[existingIndex].y
              ) &&
              !(
                line[1].x === dots[existingIndex].x &&
                line[1].y === dots[existingIndex].y
              )
          );
          setLines(filteredLines);
          setDots(dots.filter((_, index) => index !== existingIndex));
        } else {
          setDots([...dots, { x, y }]);
        }
      } else if (drawLineActive) {
        // Logic for drawing lines is updated to create separate datasets for each line
        const clickThreshold = 0.5;
        const clickedDotIndex = dots.findIndex(
          (dot) =>
            Math.abs(dot.x - x) <= clickThreshold &&
            Math.abs(dot.y - y) <= clickThreshold
        );

        if (clickedDotIndex >= 0 && selectedDotsForLine.length < 2) {
          const newSelectedDot = dots[clickedDotIndex];
          if (selectedDotsForLine.some((dot) => dot === newSelectedDot)) {
            return;
          }

          const newSelectedDots = [...selectedDotsForLine, newSelectedDot];
          setSelectedDotsForLine(newSelectedDots);

          if (newSelectedDots.length === 2) {
            if (
              !lines.find(
                (line) =>
                  (line[0] === newSelectedDots[0] &&
                    line[1] === newSelectedDots[1]) ||
                  (line[0] === newSelectedDots[1] &&
                    line[1] === newSelectedDots[0])
              )
            ) {
              setLines([...lines, newSelectedDots]);
              // Generate a new random color and add it to the lineColors array
              const newColor = generateRandomColor();
              setLineColors([...lineColors, newColor]);
            }
            setSelectedDotsForLine([]);
          }
        }
      }
    },
    maintainAspectRatio: true,
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

  // Function to render the table for each line
  const renderTable = (tableData, index) => {
    if (!tableData || !tableData.data || tableData.data.length === 0) {
      return null; // or some fallback UI
    }
    const xHeaders = tableData.data.map((point) => point.x);
    const yValues = tableData.data.map((point) => point.y);
    return (
      <div key={`table-${index}`} className="table-container">
        {" "}
        {/* Ensure key is unique and consistent */}
        <table className="table-style">
          <thead>
            <tr>
              {xHeaders.map((x, idx) => (
                <th key={idx}>{`${x}`}</th> // Simplified for clarity
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {yValues.map((y, idx) =>
                exerciseMode ? (
                  <td key={idx}>
                    <input
                      type="number"
                      defaultValue={y}
                      onChange={(e) =>
                        handleUserInput(index, idx, e.target.value)
                      }
                      style={{
                        width: "100%",
                        border: "none",
                        textAlign: "center",
                      }}
                    />
                  </td>
                ) : (
                  <td key={idx}>{y}</td>
                )
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
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
        <div className="line_graph" style={{ width: "40%" }}>
          <Scatter data={data} options={options} />
        </div>
        <div style={{ width: "20%" }}>
          {lines.map((line, index) => (
            <div key={index} style={{ color: lineColors[index] }}>
              {`Line ${index + 1}: ${formatEquation(
                calculateLineEquation(line[0], line[1])
              )}`}
            </div>
          ))}
          <div className="arrow_box">
            <button onClick={togglePlaceDots} type="button">
              {placeDotsActive ? "Placing Dots..." : "Place Dots"}
            </button>
            <br />
            <button
              onClick={toggleDrawLine}
              type="button"
              style={{ marginTop: "10px" }}
            >
              {drawLineActive ? "Drawing Line..." : "Draw Line"}
            </button>
            <br />
            <button
              onClick={handleMakeTables}
              type="button"
              style={{ marginTop: "10px" }}
            >
              Make Tables
            </button>
            <button
              onClick={handleExerciseModeToggle}
              type="button"
              style={{ marginTop: "10px" }}
            >
              {exerciseMode ? "Submit" : "Make Exercise"}
            </button>
          </div>
        </div>
      </div>
      {/* Use the renderTable function to render tables for all lines */}
      <div>
        {tablesData.length > 0 ? (
          tablesData.map((table, index) => renderTable(table, index))
        ) : (
          <p>No table data available. Draw lines and click "Make Tables".</p>
        )}
      </div>
    </div>
  );
}

export default App;
