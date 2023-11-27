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
}

const useKeyNavigation = (props: useKeyNavigationProps) => {
  const { activeCell, setActiveCell, cells, setCellProperty, isEditing, setIsEditing, storeVal } = props

  useEffect(() => {
    const navigateCells = (rowDelta: number, colDelta: number) => {
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

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeCell, setActiveCell, cells, setCellProperty, isEditing, setIsEditing, storeVal])
}

export default useKeyNavigation
