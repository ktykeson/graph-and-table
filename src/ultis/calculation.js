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
  let x = 0;

  // Function to check and add points if they meet the criteria
  const checkAndAddPoint = (x) => {
    let y = slope * x + yIntercept;
    // Check for whole number y values with a margin for floating-point issues
    if (Math.abs(Math.round(y) - y) < 0.0001) {
      tableData.push({ x, y: Math.round(y) });
      pointsFound++;
    }
  };

  // First check for x = 0 explicitly to avoid duplication in the loop
  checkAndAddPoint(0);

  // Continue searching outwards from 0 until enough points are found or the range is exceeded
  while (pointsFound < 7 && x <= graphRange) {
    x++;
    // Check positive direction
    if (x <= graphRange) {
      checkAndAddPoint(x);
      if (pointsFound >= 7) break; // Exit early if 7 points are found
    }
    // Check negative direction
    if (-x >= -graphRange) {
      checkAndAddPoint(-x);
    }
  }

  // Sort the tableData array from lowest to highest x values
  tableData.sort((a, b) => a.x - b.x);

  return tableData;
};

// Function to format equation for display
export const formatEquation = ({ slope, yIntercept }) => {
  return `y = ${slope.toFixed(2)}x + ${yIntercept.toFixed(2)}`;
};
