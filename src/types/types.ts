export interface CellData {
  ref: CellRef
  value: string
  styles: string[]
}

export type CellKeys = keyof CellData

export interface CellRef {
  row: number
  col: number
}
