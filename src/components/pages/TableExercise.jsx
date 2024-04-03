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
          <button onClick={addColumn}>Add Column</button>
          <button onClick={removeColumn}>Remove Column</button>
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
        <button onClick={handleMakeExercise}>Make Exercise</button>
      ) : (
        <button onClick={handleCheck}>Check</button>
      )}
    </div>
  );
}

export default TableExercise;
