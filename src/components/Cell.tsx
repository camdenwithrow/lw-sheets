import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import useStoreCell from "../hooks/useStoreCell"
import { CellData, CellRef } from "../types/types"
import useKeyEvent from "../hooks/useKeyEvent"

interface CellProps {
  activeCell: CellRef
  setActiveCell: Dispatch<SetStateAction<CellRef>>
  rowIndex: number
  colIndex: number
  gridSizes: { rows: string; cols: string }
  gridDimensions: { rows: number; cols: number }
}

const Cell = (props: CellProps) => {
  const { activeCell, setActiveCell, rowIndex, colIndex, gridSizes, gridDimensions } = props

  const [cell, setCell] = useState<CellData>({ ref: { row: rowIndex, col: colIndex }, value: "", styles: [] })
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const { storeVal, setCellProperty } = useStoreCell(setCell, setIsEditing)

  useKeyEvent(
    activeCell,
    setActiveCell,
    gridDimensions.rows,
    gridDimensions.cols,
    isEditing,
    setIsEditing,
    storeVal,
    cell,
    setCellProperty
  )

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const isActiveCell = (row: number, col: number) => {
    return activeCell.row === row && activeCell.col === col
  }

  const handleCellClick = (row: number, col: number) => {
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
    <td key={colIndex} className="border  p-0 relative border-gray-500">
      <div
        className={`p-0.5 flex justify-center items-center relative ${cell.styles} ${
          activeCell.row === rowIndex && activeCell.col === colIndex
            ? "after:absolute after:-inset-px  after:content-[''] after:border-2 after:border-blue-500"
            : ""
        }`}
        style={{
          minWidth: gridSizes.cols,
          minHeight: gridSizes.rows,
          width: gridSizes.cols,
          height: gridSizes.rows,
        }}
        onClick={() => handleCellClick(rowIndex, colIndex)}
      >
        {isEditing && activeCell.row === rowIndex && activeCell.col === colIndex ? (
          <input
            value={cell.value}
            ref={inputRef}
            onChange={handleInputChange}
            onBlur={() => storeVal()}
            className="w-full h-full border-0 outline-none"
          />
        ) : (
          <p className={`w-full overflow-hidden`}>{cell.value}</p>
        )}
      </div>
    </td>
  )
}

export default Cell
