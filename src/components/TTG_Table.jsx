import React, { useState } from "react";
import styles from "../styles/TTG_Table.module.css";

const TTG_Table = ({ exerciseBoolean, onTableDataChange }) => {
  const [columns, setColumns] = useState(7); // Number of columns dynamic
  const [data, setData] = useState({
    x: Array(7).fill(""),
    y: Array(7).fill(""),
  });
  const [exerciseMode, setExerciseMode] = useState(false);
  const [hiddenIndices, setHiddenIndices] = useState([]);

  const handleInputChange = (axis, index, value) => {
    const newData = { ...data, [axis]: [...data[axis]] };
    newData[axis][index] = value;
    setData(newData);

    // Call the callback prop, converting data to the expected format
    const tableData = newData.x.map((x, i) => ({ x: x, y: newData.y[i] }));
    if (typeof onTableDataChange === "function") {
      onTableDataChange(tableData);
    }
  };

  const handleMakeExercise = () => {
    let indices = new Set();
    while (indices.size < columns / 2) {
      indices.add(Math.floor(Math.random() * columns));
    }

    setData((prevData) => {
      const newData = { ...prevData };
      indices.forEach((index) => {
        if (newData.y[index] !== "") {
          newData.y[index] = "";
        }
      });
      return newData;
    });

    setHiddenIndices([...indices]);
    setExerciseMode(true);
  };

  const addColumn = () => {
    setData((prevData) => ({
      x: [...prevData.x, ""],
      y: [...prevData.y, ""],
    }));
    setColumns(columns + 1);
  };

  const removeColumn = () => {
    setData((prevData) => ({
      x: prevData.x.slice(0, -1),
      y: prevData.y.slice(0, -1),
    }));
    setColumns(columns - 1);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.columnModificationButtons}>
        <button
          onClick={addColumn}
          disabled={exerciseBoolean}
          className={`${exerciseBoolean ? styles.disabled : ""} ${
            styles.addButton
          }`}
        >
          Add Column
        </button>
        <button
          onClick={removeColumn}
          disabled={exerciseBoolean}
          className={`${exerciseBoolean ? styles.disabled : ""} ${
            styles.removeButton
          }`}
        >
          Remove Column
        </button>
      </div>
      <table className={styles.tableStyle}>
        <thead>
          <tr>
            {data.x.map((value, index) => (
              <th key={`x-header-${index}`}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleInputChange("x", index, e.target.value)
                  }
                  disabled={exerciseBoolean}
                  className={styles.inputStyle}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {data.y.map((value, index) => (
              <td key={`y-${index}`}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleInputChange("y", index, e.target.value)
                  }
                  disabled={exerciseBoolean}
                  className={styles.inputStyle}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TTG_Table;
