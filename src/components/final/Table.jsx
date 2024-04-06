import React from "react";

const Table = ({ data, handleInputChange, disabled, hiddenIndices = [] }) => {
  return (
    <table>
      <tbody>
        {["x", "y"].map((axis) => (
          <tr key={axis}>
            <td>{axis}</td>
            {Array.isArray(data) &&
              data.map((item, index) => (
                <td key={`${axis}-${index}`}>
                  <input
                    type="text"
                    value={item[axis]}
                    onChange={(e) =>
                      handleInputChange(axis, index, e.target.value)
                    }
                    disabled={disabled}
                  />
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
