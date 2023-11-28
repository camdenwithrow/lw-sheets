import { useCallback, useState } from "react"
import { CellRef } from "../types/types"
import Cell from "./Cell"

const num = { rows: 25, cols: 10 }
const sizes = { rows: "30px", cols: "100px" }

const Grid = () => {
  const grid: string[][] = Array(num.rows).fill(Array(num.cols).fill(""))
  const [activeCell, setActiveCell] = useState<CellRef>({ row: 0, col: 0 })
  const [gridDimensions] = useState(num)
  const [gridSizes] = useState(sizes)

  const colHeaders = useCallback(() => {
    const headers = []
    for (let index = 0; index < num.cols; index++) {
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
                gridSizes={gridSizes}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                gridDimensions={gridDimensions}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
export default Grid
