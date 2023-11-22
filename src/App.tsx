import { useState, useEffect } from "react"

interface Cell {
  value: string
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
  const [cells, setCells] = useState<Cell[][]>(Array(numRows).fill(Array(numCols).fill({ value: "" })))
  const [activeCell, setActiveCell] = useState<CellRef>({ row: 0, col: 0 })
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [shiftKey, setShiftKey] = useState(false)

  useEffect(() => {
    const navigateCells = (e: KeyboardEvent, rowDelta: number, colDelta: number) => {
      e.preventDefault()
      let newRow = activeCell.row + rowDelta
      let newCol = activeCell.col + colDelta
      if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
        setActiveCell({ row: newRow, col: newCol })
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShiftKey(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Shift":
          e.preventDefault()
          setShiftKey(true)
          break
        case "Enter":
          const rowChange = shiftKey ? -1 : 1
          navigateCells(e, rowChange, 0)
          break
        case "Tab":
          const colChange = shiftKey ? -1 : 1
          navigateCells(e, 0, colChange)
          break
        case "ArrowUp":
          navigateCells(e, -1, 0)
          break
        case "ArrowDown":
          navigateCells(e, 1, 0)
          break
        case "ArrowLeft":
          navigateCells(e, 0, -1)
          break
        case "ArrowRight":
          navigateCells(e, 0, 1)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [activeCell, setActiveCell, shiftKey, setShiftKey])

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
          <tr>
            <th className="opacity-0">0</th>
            {Array.from({ length: numCols }, (_, colIndex) => (
              <th key={`colHeader-${colIndex}`}>{genColHeaders(colIndex)}</th>
            ))}
          </tr>
          {cells.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th>{rowIndex + 1}</th>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={`border p-1 ${
                    activeCell.row === rowIndex && activeCell.col === colIndex ? "bg-blue-200" : ""
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
