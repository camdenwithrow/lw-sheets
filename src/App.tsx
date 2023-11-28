import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react"
import { Cell, CellRef } from "./types/types"
import useKeyNavigation from "./hooks/useKeyNavigation"
import useStoreCell from "./hooks/useStoreCell"

export const numRows = 25
export const numCols = 10
const rowSize = "30px"
const colSize = "100px"

const initialCells = () => {
  const cells = []
  for (let i = 0; i < numRows; i++) {
    const row = []
    for (let j = 0; j < numCols; j++) {
      row.push({ value: "", styles: [] })
    }
    cells.push(row)
  }
  return cells
}

function App() {
  const [cells, setCells] = useState<Cell[][]>(initialCells())
  const [activeCell, setActiveCell] = useState<CellRef>({ row: 0, col: 0 })
  const [selectedRange, setSelectedRange] = useState<Array<CellRef>>([])
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const { setCellProperty, storeVal } = useStoreCell({ setCells, activeCell, setIsEditing })

  useKeyNavigation({
    activeCell,
    setActiveCell,
    cells,
    setCellProperty,
    isEditing,
    setIsEditing,
    storeVal,
    selectedRange,
    setSelectedRange,
  })

  useEffect(() => {
    console.log(selectedRange)
  }, [selectedRange])

  const colHeaders = useCallback(() => {
    const headers = []
    for (let index = 0; index < numCols; index++) {
      let columnName = ""
      let i = index
      while (i >= 0) {
        columnName = String.fromCharCode(65 + (i % 26)) + columnName
        i = Math.floor(i / 26) - 1
      }
      headers.push(columnName)
    }
    return headers
  }, [])

  const isInRange = (rowI: number, colI: number) => {
    if (selectedRange.length === 0) return false

    const [start, end] = selectedRange
    const inRow = rowI <= Math.max(start.row, end.row) && rowI >= Math.min(start.row, end.row)
    const inCol = colI <= Math.max(start.col, end.col) && colI >= Math.min(start.col, end.col)
    return inRow && inCol
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const isActiveCell = (row: number, col: number) => {
    return activeCell.row === row && activeCell.col === col
  }

  const handleCellClick = (row: number, col: number) => {
    if (selectedRange.length !== 0) setSelectedRange([])
    if (isActiveCell(row, col)) {
      setIsEditing(true)
    } else {
      storeVal()
      setActiveCell({ row: row, col: col })
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCellProperty("value", e.target.value)
  }

  return (
    <main>
      <table className="table-auto border-collapse">
        <tbody>
          <tr>
            <th className="opacity-0">0</th>
            {colHeaders().map((colH, colIndex) => (
              <th key={`colHeader-${colIndex}`} className="font-bold border-x border-gray-500">
                {colH}
              </th>
            ))}
          </tr>
          {cells.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th className="border-y border-gray-500 px-1.5">{rowIndex + 1}</th>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border  p-0 relative border-gray-500">
                  <div
                    className={`p-0.5 flex justify-center items-center relative ${cell.styles} ${
                      activeCell.row === rowIndex && activeCell.col === colIndex
                        ? "after:absolute after:-inset-px  after:content-[''] after:border-2 after:border-blue-500"
                        : ""
                    }
                    ${isInRange(rowIndex, colIndex) ? "bg-blue-100" : ""}`}
                    style={{
                      minWidth: colSize,
                      minHeight: rowSize,
                      width: colSize,
                      height: rowSize,
                    }}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {isEditing && activeCell.row === rowIndex && activeCell.col === colIndex ? (
                      <input
                        value={cells[activeCell.row][activeCell.col].value}
                        ref={inputRef}
                        onChange={handleInputChange}
                        onBlur={() => storeVal()}
                        className="w-full h-full border-0 outline-none"
                      />
                    ) : (
                      <p className={`w-full overflow-hidden cursor-default `}>{cell.value}</p>
                    )}
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
