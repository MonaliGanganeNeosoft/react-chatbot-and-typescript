import { PaginationDTO } from "@model"

export const Paginate = (dta: PaginationDTO): PaginationDTO => {
  return {
    currentPage: +dta.currentPage,
    limit: +dta.limit,
    totalRecordCount: null
  }
}
export interface LimitOffset {
  limit: number
  offset: number
}
export const LimitOffset = (dta: PaginationDTO): LimitOffset => {
  return {
    limit: dta.limit,
    offset: ((dta.currentPage - 1) * dta.limit)
  }
}