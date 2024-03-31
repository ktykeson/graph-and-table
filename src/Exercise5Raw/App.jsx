import React, { useState } from 'react';
import './App.css';

// Define the number of columns
const columns = 7;

function ExerciseTable() {
  const [data, setData] = useState({
    x: Array(columns).fill(''),
    y: Array(columns).fill('')
  });
  const [hiddenIndices, setHiddenIndices] = useState([]);
  const [exerciseMode, setExerciseMode] = useState(false);

  const handleInputChange = (axis, index, value) => {
    const newData = { ...data, [axis]: [...data[axis]] };
    newData[axis][index] = value;
    setData(newData);

    console.log(`Updating ${axis}[${index}] to ${value}`);

  };

  const handleMakeExercise = () => {
    let indices = new Set();
    while (indices.size < columns / 2) {
      indices.add(Math.floor(Math.random() * columns));
    }
  
    // Adjust data for y axis directly to reflect cleared inputs
    setData(prevData => {
      let newData = { ...prevData };
      indices.forEach(index => {
        if (newData.y[index] !== '') {
          newData.y[index] = ''; // Clear the value
        }
      });
      return newData;
    });
  
    setHiddenIndices([...indices]);
    setExerciseMode(true);
  };

  const handleCheck = () => {
    let isCorrect = true;
    hiddenIndices.forEach(index => {
      if (data.y[index] !== data.x[index]) {
        isCorrect = false;
      }
    });
    alert(isCorrect ? 'Correct!' : 'Try again!');
    setHiddenIndices([]);
    setExerciseMode(false);
  };

  const addColumn = () => {
    setData(prevData => ({
      x: [...prevData.x, ''], // Add empty string to simulate new column
      y: [...prevData.y, '']
    }));
  };
  
  const removeColumn = () => {
  setData(prevData => ({
    x: prevData.x.slice(0, -1), // Remove last element
    y: prevData.y.slice(0, -1)
  }));
};

  return (
    <div className="exercise-table">
      {!exerciseMode && (
      <div className="column-modification-buttons">
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
                  onChange={(e) => handleInputChange('x', index, e.target.value)}
                  disabled={exerciseMode}
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
                  onChange={(e) => handleInputChange('y', index, e.target.value)}
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

export default ExerciseTable;
