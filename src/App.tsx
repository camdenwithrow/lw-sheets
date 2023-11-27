import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react"

interface Cell {
  value: string
}

interface CellRef {
  row: number
  col: number
}

const numRows = 100
const numCols = 26
const rowSize = "30px"
const colSize = "100px"

const initialCells = () => {
  const cells = []
  for (let i = 0; i < numRows; i++) {
    const row = []
    for (let j = 0; j < numCols; j++) {
      row.push({ value: "" })
    }
    cells.push(row)
  }
  return cells
}

function App() {
  const [cells, setCells] = useState<Cell[][]>(initialCells())
  const [activeCell, setActiveCell] = useState<CellRef>({ row: 0, col: 0 })
  const [selectedRange, setSelectedRange] = useState<Array<CellRef> | null>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const { current: colHeaders } = useRef(() => {
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
  })

  const isInRange = () => {
    if (!selectedRange) return false
    const inRow =
      Math.min(...selectedRange.map((x) => x.row)) <= activeCell.row &&
      activeCell.row <= Math.max(...selectedRange.map((x) => x.row))
    const inCol =
      Math.min(...selectedRange.map((x) => x.col)) <= activeCell.col &&
      activeCell.col <= Math.max(...selectedRange.map((x) => x.col))
    return inRow && inCol
  }

  const storeVal = useCallback(
    (val?: string) => {
      if (val !== undefined) {
        setCells((prevCells) => {
          const newCells = [...prevCells]
          newCells[activeCell.row][activeCell.col].value = val
          return newCells
        })
      }
      setIsEditing(false)
    },
    [activeCell.row, activeCell.col]
  )

  const editCell = () => {
    setIsEditing(true)
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  useEffect(() => {
    const navigateCells = (rowDelta: number, colDelta: number, allowRange?: boolean, modifier?: boolean) => {
      const newRow = activeCell.row + rowDelta
      const newCol = activeCell.col + colDelta
      if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
        if (allowRange && modifier) {
          setSelectedRange([{ ...activeCell }, { row: newRow, col: newCol }])
        } else {
          setActiveCell({ row: newRow, col: newCol })
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifierKey = e.metaKey || e.altKey || e.ctrlKey
      if (!isEditing && e.key.length === 1 && !isModifierKey) {
        e.preventDefault()
        setIsEditing(true)
        setCells((prevCells) => {
          const newCells = [...prevCells]
          newCells[activeCell.row][activeCell.col].value = e.key
          return newCells
        })
      } else {
        let colChange = 0
        switch (e.key) {
          case "Enter":
            e.preventDefault()
            if (isEditing) {
              storeVal()
              const rowChange = e.shiftKey ? -1 : 1
              navigateCells(rowChange, 0)
            } else {
              editCell()
            }
            break
          case "Tab":
            e.preventDefault()
            if (isEditing) storeVal()
            colChange = e.shiftKey ? -1 : 1
            navigateCells(0, colChange)
            break
          case "ArrowUp":
            e.preventDefault()
            if (!isEditing) {
              navigateCells(-1, 0, true, e.shiftKey)
            }
            break
          case "ArrowDown":
            e.preventDefault()
            if (!isEditing) {
              navigateCells(1, 0, true, e.shiftKey)
            }
            break
          case "ArrowLeft":
            e.preventDefault()
            if (!isEditing) {
              navigateCells(0, -1, true, e.shiftKey)
            }
            break
          case "ArrowRight":
            e.preventDefault()
            if (!isEditing) {
              navigateCells(0, 1, true, e.shiftKey)
            }
            break
          case "Backspace":
            if (!isEditing) {
              e.preventDefault()
              storeVal("")
            }
            break
          case "Escape":
            if (isEditing) {
              e.preventDefault()
              storeVal("")
            }
            break
          default:
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeCell, setActiveCell, isEditing, storeVal])

  const isActiveCell = (row: number, col: number) => {
    return activeCell.row === row && activeCell.col === col
  }

  const handleCellClick = (row: number, col: number) => {
    if (isActiveCell(row, col)) {
      editCell()
    } else {
      storeVal()
      setActiveCell({ row: row, col: col })
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCells((prevCells) => {
      const newCells = [...prevCells]
      newCells[activeCell.row][activeCell.col].value = e.target.value
      return newCells
    })
  }

  return (
    <main>
      <table className="table-auto border-collapse">
        <tbody>
          <tr>
            <th className="opacity-0">0</th>
            {colHeaders().map((colH, colIndex) => (
              <th key={`colHeader-${colIndex}`}>{colH}</th>
            ))}
          </tr>
          {cells.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th>{rowIndex + 1}</th>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={`border p-0 ${
                    activeCell.row === rowIndex && activeCell.col === colIndex ? "border-2 border-blue-300" : ""
                  }`}
                >
                  <div
                    className="p-0.5 flex items-center"
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
                      <p className={`w-full overflow-hidden cursor-default ${isInRange() ? "bg-blue-100" : ""}`}>
                        {cell.value}
                      </p>
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
