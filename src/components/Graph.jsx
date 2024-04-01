import React, { useEffect, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { calculateLineEquation, formatEquation } from "../ultis/calculation";

const Graph = ({
  graphRange,
  placeDotsActive,
  drawLineActive,
  dots,
  setDots,
  lineDetails,
  setLineDetails,
  selectedDotsForLine,
  setSelectedDotsForLine,
  setChartRef,
}) => {
  const [blinkColor, setBlinkColor] = useState("black");
  // Function to generate random color
  const generateRandomColor = () => {
    let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    // Ensure color is not too light or black
    while (color === "#FFFFFF" || color === "#000000" || color.length < 7) {
      color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
    return color;
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
        backgroundColor: dots.map(
          (dot) =>
            selectedDotsForLine.some(
              (selectedDot) =>
                selectedDot.x === dot.x && selectedDot.y === dot.y
            )
              ? "red" // Always yellow if the dot is part of selectedDotsForLine
              : drawLineActive
              ? blinkColor // Only apply blinking effect if drawLineActive is true and the dot is not part of selectedDotsForLine
              : "black" // Default color when drawLineActive is false
        ),

        pointRadius: 5,
        animation: false,
      },
      ...lineDetails.map((detail, index) => {
        const { slope, yIntercept } = calculateLineEquation(
          detail.line[0],
          detail.line[1]
        );
        const extendedStart = {
          x: -graphRange,
          y: slope * -graphRange + yIntercept,
        };
        const extendedEnd = {
          x: graphRange,
          y: slope * graphRange + yIntercept,
        };
        return {
          label: `Line ${index + 1}: ${formatEquation({
            slope,
            yIntercept,
          })}`,
          data: [extendedStart, extendedEnd],
          type: "line",
          fill: false,
          borderColor: detail.color,
          borderWidth: 2,
          showLine: true,
          lineTension: 0,
          pointRadius: 0, // No need to show points for the line
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
            // Directly access the color from the lineDetails array
            // -1 because the first dataset is dots, so lineDetails[0] corresponds to context.datasetIndex 1
            if (context.datasetIndex === 0) return "black"; // Return black for dots dataset
            const lineDetail = lineDetails[context.datasetIndex - 1];
            return lineDetail ? lineDetail.color : "black"; // Return the line color if exists, otherwise black
          },
          usePointStyle: true,
        },
      },

      tooltip: {
        enabled: false, // Disable tooltips as per your setup
      },
    },
    onClick: (e) => {
      // Modify the onClick logic to update the new `lineDetails` state
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
          // Logic for removing a dot and its connected lines
          const filteredLineDetails = lineDetails.filter(
            (detail) =>
              !(
                detail.line[0].x === dots[existingIndex].x &&
                detail.line[0].y === dots[existingIndex].y
              ) &&
              !(
                detail.line[1].x === dots[existingIndex].x &&
                detail.line[1].y === dots[existingIndex].y
              )
          );
          setLineDetails(filteredLineDetails);
          setDots(dots.filter((_, index) => index !== existingIndex));
        } else {
          setDots([...dots, { x, y }]);
        }
      } else if (drawLineActive) {
        const clickThreshold = 0.5;
        const clickedDotIndex = dots.findIndex(
          (dot) =>
            Math.abs(dot.x - x) <= clickThreshold &&
            Math.abs(dot.y - y) <= clickThreshold
        );

        if (clickedDotIndex >= 0 && selectedDotsForLine.length < 2) {
          const newSelectedDot = dots[clickedDotIndex];
          if (
            !selectedDotsForLine.some(
              (dot) => dot.x === newSelectedDot.x && dot.y === newSelectedDot.y
            )
          ) {
            const newSelectedDots = [...selectedDotsForLine, newSelectedDot];
            setSelectedDotsForLine(newSelectedDots);

            if (newSelectedDots.length === 2) {
              setLineDetails([
                ...lineDetails,
                { line: newSelectedDots, color: generateRandomColor() },
              ]);
              setSelectedDotsForLine([]);
            }
          }
        }
      }
    },
    maintainAspectRatio: true,
  };
  const chartRef = useRef(null);

  useEffect(() => {
    setChartRef(chartRef);
    console.log(chartRef.current);
    return () => {
      setChartRef(null);
    };
  }, [setChartRef]);
  // Blinking effect logic
  useEffect(() => {
    let blinkInterval;
    if (drawLineActive) {
      blinkInterval = setInterval(() => {
        setBlinkColor((prevColor) =>
          prevColor === "yellow" ? "black" : "yellow"
        );
      }, 500); // Adjust the interval as needed
    }

    return () => clearInterval(blinkInterval); // Cleanup on unmount or when drawLineActive changes
  }, [drawLineActive]);

  return (
    <div className="line_graph" style={{ width: "40%" }}>
      <Scatter ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default Graph;
