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
    // First, update the specific value in the data based on axis, index, and value
    const updatedData = { ...data };
    updatedData[axis][index] = value; // Update the value in the respective axis array at the specified index
    console.log(updatedData);
    setData(updatedData);
    // Now, construct the newData array of objects
    const newData = updatedData.x.map((xValue, idx) => ({
      x: xValue, // Value from the x array
      y: updatedData.y[idx], // Corresponding value from the y array
    }));

    console.log(newData); // Use console.log for debugging to print the tableData
    onTableDataChange(newData); // Call the callback with the updated tableData
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.btnIcon}
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            ></path>
          </svg>
          Add Column
        </button>
        <button
          onClick={removeColumn}
          disabled={exerciseBoolean}
          className={`${exerciseBoolean ? styles.disabled : ""} ${
            styles.removeButton
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.btnIcon}
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z"
            ></path>
          </svg>
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
