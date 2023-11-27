import { useState, useCallback } from "react"
import { CellRef } from "./types/types"
import Cell from "./components/Cell"

export const numRows = 25
export const numCols = 10
const rowSize = "30px"
const colSize = "100px"

// const initialGrid = () => {
//   const grid = []
//   for (let i = 0; i < numRows; i++) {
//     const row = []
//     for (let j = 0; j < numCols; j++) {
//       row.push({ row: i, col: j })
//     }
//     grid.push(row)
//   }
//   return grid
// }

function App() {
  // const [grid, setGrid] = useState<CellRef[][]>(initialGrid())
  const grid: string[][] = Array(numRows).fill(Array(numCols).fill(""))
  const [activeCell, setActiveCell] = useState<CellRef>({ row: 0, col: 0 })

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
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th className="border-y border-gray-500 px-1.5">{rowIndex + 1}</th>
              {row.map((_, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  rowSize={rowSize}
                  colSize={colSize}
                  activeCell={activeCell}
                  setActiveCell={setActiveCell}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default App
