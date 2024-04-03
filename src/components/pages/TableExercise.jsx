import React, { useState } from "react";
import styles from "../../styles/TableExercise.module.css";
import Popup from "../../Popup";

// Define the number of columns

function TableExercise() {
  const [data, setData] = useState({
    x: Array(7).fill(""),
    y: Array(7).fill(""),
  });
  const [hiddenIndices, setHiddenIndices] = useState([]);
  const [exerciseMode, setExerciseMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState(true);

  const handleInputChange = (axis, index, value) => {
    const newData = { ...data, [axis]: [...data[axis]] };
    newData[axis][index] = value;
    setData(newData);

    console.log(`Updating ${axis}[${index}] to ${value}`);
  };

  const handleMakeExercise = () => {
    let totalClearCount = Math.floor(Math.random() * 3) + 3; // Random number between 3 and 5
    let clearedIndices = new Set();

    // Ensure unique indices are selected until the desired totalClearCount is met
    while (clearedIndices.size < totalClearCount) {
      // Randomly decide to clear from x or y
      const axis = Math.random() < 0.5 ? "x" : "y";
      const index = Math.floor(Math.random() * data.x.length);

      // Construct a unique identifier for the index and axis to avoid duplicates
      clearedIndices.add(`${axis}-${index}`);
    }

    // Adjust data to reflect cleared inputs for both x and y
    setData((prevData) => {
      let newData = { ...prevData };
      clearedIndices.forEach((clearedIndex) => {
        const [axis, index] = clearedIndex.split("-");
        newData[axis][Number(index)] = ""; // Clear the value
      });
      return newData;
    });

    // Store cleared indices in a way that's compatible with the checking function
    setHiddenIndices(
      [...clearedIndices].map((ci) => {
        const [, index] = ci.split("-");
        return Number(index);
      })
    );
    setExerciseMode(true);
  };

  const handleCheck = () => {
    let isCorrect = true;
    hiddenIndices.forEach((index) => {
      if (data.y[index] !== data.x[index]) {
        isCorrect = false;
      }
    });

    if (isCorrect) {
      setPopupMessage("Correct, try again?");
    } else {
      setPopupMessage("Incorrect, try again.");
    }
    setShowPopup(true);
  };

  const confirmAnswer = () => {
    setShowPopup(false);
    window.location.reload();
  };

  const tryAgain = () => {
    setShowPopup(false);
  };

  const addColumn = () => {
    setData((prevData) => ({
      x: [...prevData.x, ""], // Add empty string to simulate new column
      y: [...prevData.y, ""],
    }));
  };

  const removeColumn = () => {
    setData((prevData) => ({
      x: prevData.x.slice(0, -1), // Remove last element
      y: prevData.y.slice(0, -1),
    }));
  };

  return (
    <div className={styles.exerciseTable}>
      {showPopup && (
        <Popup
          message={popupMessage}
          confirm={confirmAnswer}
          tryagain={tryAgain}
        />
      )}
      {!exerciseMode && (
        <div className={styles.columnModificationButtons}>
          <button className={styles.addButton} onClick={addColumn}>
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
          <button className={styles.addButton} onClick={removeColumn}>
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
            </svg>{" "}
            Remove Column
          </button>
        </div>
      )}
      <table>
        <tbody>
          <tr>
            <td>x</td>
            {data.x.map((value, index) => (
              <td key={`x-${index}`}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleInputChange("x", index, e.target.value)
                  }
                  disabled={exerciseMode && !hiddenIndices.includes(index)}
                />
              </td>
            ))}
          </tr>
          <tr>
            <td>y</td>
            {data.y.map((value, index) => (
              <td key={`y-${index}`}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    handleInputChange("y", index, e.target.value)
                  }
                  disabled={exerciseMode && !hiddenIndices.includes(index)}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {!exerciseMode ? (
        <button className={styles.addButton} onClick={handleMakeExercise}>
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.btnIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          Make Exercise
        </button>
      ) : (
        <button className={styles.addButton} onClick={handleCheck}>
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
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            ></path>
          </svg>
          Check
        </button>
      )}
    </div>
  );
}

export default TableExercise;
