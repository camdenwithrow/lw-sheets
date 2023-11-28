import React, { SetStateAction, useCallback } from "react"
import { Cell, CellProp, CellRef } from "../types/types"

interface useStoreCellProps {
  setCells: React.Dispatch<SetStateAction<Cell[][]>>
  activeCell: CellRef
  setIsEditing: React.Dispatch<SetStateAction<boolean>>
}

function useStoreCell(props: useStoreCellProps) {
  const { setCells, activeCell, setIsEditing } = props

  const setCellProperty = useCallback(
    (property: CellProp, newPropVal: string | string[]) => {
      setCells((prevCells) => {
        const newCells = [...prevCells]
        const cell = newCells[activeCell.row][activeCell.col]
        if (property === "value" && typeof newPropVal === "string") {
          cell.value = newPropVal
        } else if (property === "styles" && Array.isArray(newPropVal)) {
          cell.styles = newPropVal
        }
        return newCells
      })
    },
    [activeCell.col, activeCell.row, setCells]
  )

  const storeVal = useCallback(
    (val?: string) => {
      if (val !== undefined) {
        setCellProperty("value", val)
      }
      setIsEditing(false)
    },
    [setCellProperty, setIsEditing]
  )

  return { setCellProperty, storeVal }
}

export default useStoreCell
