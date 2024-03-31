import React from "react";
import { calculateLineEquation, formatEquation } from "../ultis/calculation";

const LineLegend = ({ lines, lineColors }) => {
  return (
    <>
      {lines.map((line, index) => (
        <div key={index} style={{ color: lineColors[index] }}>
          {`Line ${index + 1}: ${formatEquation(
            calculateLineEquation(line[0], line[1])
          )}`}
        </div>
      ))}
    </>
  );
};

export default LineLegend;
