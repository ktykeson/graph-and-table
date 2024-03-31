import React from "react";
import { Scatter } from "react-chartjs-2";
import { calculateLineEquation, formatEquation } from "../ultis/calculation";

const Graph = ({
  graphRange,
  placeDotsActive,
  drawLineActive,
  dots,
  setDots,
  lines,
  setLines,
  selectedDotsForLine,
  setSelectedDotsForLine,
  lineColors,
  setLineColors,
}) => {
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
          label: `Line ${index + 1}: ${formatEquation({
            slope,
            yIntercept,
          })}`,
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
  return (
    <div className="line_graph" style={{ width: "40%" }}>
      <Scatter data={data} options={options} />
    </div>
  );
};

export default Graph;
