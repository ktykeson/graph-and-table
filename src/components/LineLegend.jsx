import React from "react";
import { calculateLineEquation, formatEquation } from "../ultis/calculation";

const LineLegend = ({ lineDetails }) => {
  return (
    <>
      {lineDetails.map((details, index) => (
        <div key={index} style={{ color: details.color }}>
          {`Line ${index + 1}: ${formatEquation(
            calculateLineEquation(details.line[0], details.line[1])
          )}`}
        </div>
      ))}
    </>
  );
};

export default LineLegend;
