import React from "react";

const Table = ({ tableData, exerciseMode, handleUserInput }) => {
  if (!tableData || !tableData.data || tableData.data.length === 0) {
    return <p>No table data available. Draw lines and click "Make Tables".</p>;
  }

  const xHeaders = tableData.data.map((point) => point.x);
  const yValues = tableData.data.map((point) => point.y);

  return (
    <div className="table-container">
      <table className="table-style">
        <thead>
          <tr>
            {xHeaders.map((x, idx) => (
              <th key={idx}>{`${x}`}</th>
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
                      handleUserInput(
                        tableData.lineIndex - 1,
                        idx,
                        e.target.value
                      )
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

export default Table;