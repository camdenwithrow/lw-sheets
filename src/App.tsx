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
  const [isEditing, setIsEditing] = useState<boolean>(true)
  const [shiftKey, setShiftKey] = useState(false)

  useEffect(() => {
    const navigateCells = (e: KeyboardEvent, rowDelta: number, colDelta: number) => {
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
          e.preventDefault()
          if (isEditing) {
            setIsEditing(false)
            const rowChange = shiftKey ? -1 : 1
            navigateCells(e, rowChange, 0)
          } else {
            setIsEditing(true)
          }
          break
        case "Tab":
          e.preventDefault()
          const colChange = shiftKey ? -1 : 1
          navigateCells(e, 0, colChange)
          break
        case "ArrowUp":
          e.preventDefault()
          if (!isEditing) {
            navigateCells(e, -1, 0)
          }
          break
        case "ArrowDown":
          e.preventDefault()
          if (!isEditing) {
            navigateCells(e, 1, 0)
          }
          break
        case "ArrowLeft":
          e.preventDefault()
          if (!isEditing) {
            navigateCells(e, 0, -1)
          }
          break
        case "ArrowRight":
          e.preventDefault()
          if (!isEditing) {
            navigateCells(e, 0, 1)
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [activeCell, setActiveCell, shiftKey, setShiftKey, isEditing])

  const genColHeaders = (index: number) => {
    let columnName = ""
    while (index >= 0) {
      columnName = String.fromCharCode(65 + (index % 26)) + columnName
      index = Math.floor(index / 26) - 1
    }
    return columnName
  }

  const isActiveCell = (row: number, col: number) => {
    return activeCell.row === row && activeCell.col === col
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
                    {isEditing && isActiveCell(rowIndex, colIndex) ? <div>Editing</div> : <p>{cell.value}</p>}
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
