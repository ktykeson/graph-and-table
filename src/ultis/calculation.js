// Function to calculate line equation
export const calculateLineEquation = (dot1, dot2) => {
  const slope = (dot2.y - dot1.y) / (dot2.x - dot1.x);
  const yIntercept = dot1.y - slope * dot1.x;
  return { slope, yIntercept };
};

// Function to generate table data for a line
export const generateTableDataForLine = (line, graphRange) => {
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

// Function to format equation for display
export const formatEquation = ({ slope, yIntercept }) => {
  return `y = ${slope.toFixed(2)}x + ${yIntercept.toFixed(2)}`;
};
