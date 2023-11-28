import React, { SetStateAction, useEffect } from "react"
import { Cell, CellProp, CellRef } from "../types/types"
import { numRows, numCols } from "../App"

interface useKeyNavigationProps {
  activeCell: CellRef
  setActiveCell: React.Dispatch<SetStateAction<CellRef>>
  cells: Cell[][]
  setCellProperty: (property: CellProp, newPropVal: string | string[]) => void
  isEditing: boolean
  setIsEditing: React.Dispatch<SetStateAction<boolean>>
  storeVal: (val?: string) => void
  selectedRange: CellRef[]
  setSelectedRange: React.Dispatch<SetStateAction<CellRef[]>>
}

const useKeyNavigation = (props: useKeyNavigationProps) => {
  const {
    activeCell,
    setActiveCell,
    cells,
    setCellProperty,
    isEditing,
    setIsEditing,
    storeVal,
    selectedRange,
    setSelectedRange,
  } = props

  useEffect(() => {
    const navigateCells = (rowDelta: number, colDelta: number) => {
      if (selectedRange.length !== 0) setSelectedRange([])
      const newRow = activeCell.row + rowDelta
      const newCol = activeCell.col + colDelta
      if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
        setActiveCell({ row: newRow, col: newCol })
      }
    }

    const toggleStyle = (style: string) => {
      const styles = cells[activeCell.row][activeCell.col].styles
      if (styles.includes(style)) {
        setCellProperty(
          "styles",
          styles.filter((x) => x !== style)
        )
      } else {
        setCellProperty("styles", [...styles, style])
      }
    }

    const isOffset = (vals: CellRef[], offset: number[]) => {
      // offset receives array [row, col] offset vals
      const rowsOffset = vals[1].row - vals[0].row === offset[0]
      const colsOffset = vals[1].col - vals[0].col === offset[1]
      return rowsOffset && colsOffset
    }

    const handleKeyDown = (e: KeyboardEvent) => {
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
        let colChange = 0
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
              if (e.shiftKey) {
                if (selectedRange.length === 0) {
                  setSelectedRange([activeCell, { row: activeCell.row - 1, col: activeCell.col }])
                } else if (isOffset(selectedRange, [1, 0])) {
                  setSelectedRange([])
                } else {
                  const newSecondRef = { ...selectedRange[1] }
                  newSecondRef.row = selectedRange[1].row - 1
                  setSelectedRange([activeCell, newSecondRef])
                }
              } else {
                navigateCells(-1, 0)
              }
            }
            break
          case "ArrowDown":
            e.preventDefault()
            if (!isEditing) {
              if (e.shiftKey) {
                if (selectedRange.length === 0) {
                  setSelectedRange([activeCell, { row: activeCell.row + 1, col: activeCell.col }])
                } else if (isOffset(selectedRange, [-1, 0])) {
                  setSelectedRange([])
                } else {
                  const newSecondRef = { ...selectedRange[1] }
                  newSecondRef.row = selectedRange[1].row + 1
                  setSelectedRange([activeCell, newSecondRef])
                }
              } else {
                navigateCells(1, 0)
              }
            }
            break
          case "ArrowLeft":
            e.preventDefault()
            if (!isEditing) {
              if (e.shiftKey) {
                if (selectedRange.length === 0) {
                  setSelectedRange([activeCell, { row: activeCell.row, col: activeCell.col - 1 }])
                } else if (isOffset(selectedRange, [0, 1])) {
                  setSelectedRange([])
                } else {
                  const newSecondRef = { ...selectedRange[1] }
                  newSecondRef.col = selectedRange[1].col - 1
                  setSelectedRange([activeCell, newSecondRef])
                }
              } else {
                navigateCells(0, -1)
              }
            }
            break
          case "ArrowRight":
            e.preventDefault()
            if (!isEditing) {
              if (e.shiftKey) {
                if (selectedRange.length === 0) {
                  setSelectedRange([activeCell, { row: activeCell.row, col: activeCell.col + 1 }])
                } else if (isOffset(selectedRange, [0, -1])) {
                  setSelectedRange([])
                } else {
                  const newSecondRef = { ...selectedRange[1] }
                  newSecondRef.col = selectedRange[1].col + 1
                  setSelectedRange([activeCell, newSecondRef])
                }
              } else {
                navigateCells(0, 1)
              }
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

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [
    activeCell,
    setActiveCell,
    cells,
    setCellProperty,
    isEditing,
    setIsEditing,
    storeVal,
    selectedRange,
    setSelectedRange,
  ])
}

export default useKeyNavigation
