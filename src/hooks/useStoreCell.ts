import { Dispatch, SetStateAction, useCallback } from "react"
import { CellData, CellKeys } from "../types/types"

function useStoreCell(setCell: Dispatch<SetStateAction<CellData>>, setIsEditing: Dispatch<SetStateAction<boolean>>) {
  const setCellProperty = useCallback(
    (property: CellKeys, newPropVal: string | string[]) => {
      setCell((prevCell) => {
        const newCell = { ...prevCell }
        if (property === "value" && typeof newPropVal === "string") {
          newCell.value = newPropVal
        } else if (property === "styles" && Array.isArray(newPropVal)) {
          newCell.styles = newPropVal
        }
        return newCell
      })
    },
    [setCell]
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
