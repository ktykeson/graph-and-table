import React from "react";

const Table = ({ tableData, exerciseMode, handleUserInput, styles }) => {
  if (!tableData || !tableData.data || tableData.data.length === 0) {
    return <p>No table data available. Draw lines and click "Make Tables".</p>;
  }

  const xHeaders = tableData.data.map((point) => point.x);
  const yValues = tableData.data.map((point) => point.y);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.tableStyle}>
        <thead>
          <tr className={styles.centerText}>
            {xHeaders.map((x, idx) => (
              <th key={idx} className={styles.centerText}>
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className={styles.centerText}>
            {yValues.map((y, idx) =>
              exerciseMode ? (
                <td
                  key={idx}
                  style={{
                    maxWidth: "20%",
                    border: "none",
                  }}
                  className={styles.centerText}
                >
                  <input
                    type="number"
                    defaultValue={''}
                    onChange={(e) =>
                      handleUserInput(
                        tableData.lineIndex - 1,
                        idx,
                        e.target.value
                      )
                    }
                    className={styles.inputStyle}
                  />
                </td>
              ) : (
                <td key={idx} className={styles.centerText}>
                  {y}
                </td>
              )
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
