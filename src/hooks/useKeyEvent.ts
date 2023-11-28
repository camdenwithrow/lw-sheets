import { Dispatch, SetStateAction, useEffect } from "react"
import { CellData, CellKeys, CellRef } from "../types/types"

const useKeyEvent = (
  activeCell: CellRef,
  setActiveCell: Dispatch<SetStateAction<CellRef>>,
  numRows: number,
  numCols: number,
  isEditing: boolean,
  setIsEditing: Dispatch<SetStateAction<boolean>>,
  storeVal: (val?: string) => void,
  cell: CellData,
  setCellProperty: (property: CellKeys, newPropVal: string | string[]) => void
) => {
  useEffect(() => {
    const navigateCells = (rowDelta: number, colDelta: number) => {
      const newRow = activeCell.row + rowDelta
      const newCol = activeCell.col + colDelta
      if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
        setActiveCell({ row: newRow, col: newCol })
      }
    }
    const toggleStyle = (style: string) => {
      const styles = cell.styles
      if (styles.includes(style)) {
        setCellProperty(
          "styles",
          styles.filter((x) => x !== style)
        )
      } else {
        setCellProperty("styles", [...styles, style])
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      let colChange = 0
      if (cell.ref.row === activeCell.row && cell.ref.col === activeCell.col) {
        const isModifierKey = e.metaKey || e.altKey || e.ctrlKey
        if (!isEditing && e.key.length === 1) {
          e.preventDefault()
          if (!isModifierKey) {
            setIsEditing(true)
            setCellProperty("value", e.key)
          } else if (e.metaKey) {
            const styleKey = e.key.toLowerCase()
            switch (styleKey) {
              case "b":
                toggleStyle("font-extrabold")
                break
              case "u":
                toggleStyle("underline")
                break
              case "i":
                toggleStyle("italic")
                break
            }
          }
        } else {
          switch (e.key) {
            case "Enter":
              e.preventDefault()
              if (isEditing) {
                storeVal()
                const rowChange = e.shiftKey ? -1 : 1
                navigateCells(rowChange, 0)
              } else {
                setIsEditing(true)
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
                navigateCells(-1, 0)
              }
              break
            case "ArrowDown":
              e.preventDefault()
              if (!isEditing) {
                navigateCells(1, 0)
              }
              break
            case "ArrowLeft":
              e.preventDefault()
              if (!isEditing) {
                navigateCells(0, -1)
              }
              break
            case "ArrowRight":
              e.preventDefault()
              if (!isEditing) {
                navigateCells(0, 1)
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
                storeVal()
              }
              break
            default:
              break
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    activeCell.col,
    activeCell.row,
    cell.ref.col,
    cell.ref.row,
    cell.styles,
    isEditing,
    numCols,
    numRows,
    setActiveCell,
    setCellProperty,
    setIsEditing,
    storeVal,
  ])
}

export default useKeyEvent
