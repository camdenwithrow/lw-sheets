export interface Cell {
  value: string
  styles: string[]
}

export type CellProp = keyof Cell

export interface CellRef {
  row: number
  col: number
}
