import { useState } from "react"

interface Cell {
  value: string
  isEditing: boolean
}

interface CellRef {
  row: number
  col: number
}

const numRows = 100
const numCols = 26
const rowSize = "25px"
const colSize = "100px"

function App() {
  const [cells, setCells] = useState<Cell[][]>(
    Array(numRows).fill(Array(numCols).fill({ value: "", isEditing: false }))
  )
  const [activeCell, setActiveCell] = useState<CellRef>({ row: 0, col: 0 })

  const genColHeaders = (index: number) => {
    let columnName = ""
    while (index >= 0) {
      columnName = String.fromCharCode(65 + (index % 26)) + columnName
      index = Math.floor(index / 26) - 1
    }
    return columnName
  }

  return (
    <main>
      <table className="table-auto border-collapse">
        <tbody>
          <th className="opacity-0">0</th>
          {Array.from({ length: numCols }, (_, colIndex) => (
            <th>{genColHeaders(colIndex)}</th>
          ))}
          {cells.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th>{rowIndex + 1}</th>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={`border p-1 ${
                    activeCell.row === rowIndex && activeCell.col === colIndex
                      ? "bg-blue-200"
                      : ""
                  }`}
                >
                  <div
                    style={{
                      minWidth: colSize,
                      minHeight: rowSize,
                      width: colSize,
                      height: rowSize,
                    }}
                  >
                    <p>{cell.value}</p>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default App
