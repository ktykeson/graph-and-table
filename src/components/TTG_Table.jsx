import React, { useState } from 'react';
import './Table.css';

const Table = ({ exerciseBoolean, onTableDataChange }) => {
  const [columns, setColumns] = useState(7); // Number of columns dynamic
  const [data, setData] = useState({
    x: Array(7).fill(''),
    y: Array(7).fill('')
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

    setData(prevData => {
      const newData = { ...prevData };
      indices.forEach(index => {
        if (newData.y[index] !== '') {
          newData.y[index] = '';
        }
      });
      return newData;
    });

    setHiddenIndices([...indices]);
    setExerciseMode(true);
  };

  const addColumn = () => {
    setData(prevData => ({
      x: [...prevData.x, ''],
      y: [...prevData.y, '']
    }));
    setColumns(columns + 1);
  };

  const removeColumn = () => {
    setData(prevData => ({
      x: prevData.x.slice(0, -1),
      y: prevData.y.slice(0, -1)
    }));
    setColumns(columns - 1);
  };

  return (
    <div className="table-container">
      <div className="column-modification-buttons">
        <button onClick={addColumn} 
        disabled={exerciseBoolean}
        style={{ 
          backgroundColor: exerciseBoolean ? '#ccc' : 'default',
          cursor: exerciseBoolean ? 'default' : 'pointer'
        }}
        >Add Column</button>
        <button onClick={removeColumn} 
        disabled={exerciseBoolean}
        style={{ 
          backgroundColor: exerciseBoolean ? '#ccc' : 'default',
          cursor: exerciseBoolean ? 'default' : 'pointer'
        }}
        >Remove Column</button>
      </div>
      <table className="table-style">
        <thead>
          <tr>
            {data.x.map((value, index) => (
              <th key={`x-header-${index}`}>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange('x', index, e.target.value)}
                  disabled={exerciseBoolean}
                  style={{ width: "100%", textAlign: "center" }}
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
                  onChange={(e) => handleInputChange('y', index, e.target.value)}
                  disabled={exerciseBoolean}
                  style={{ width: "100%", textAlign: "center" }}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;