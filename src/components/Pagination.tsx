'use client'
import { ITEM_PER_PAGE } from '@/lib/variables'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  currentPage: number
  totalItems: number
}
const Pagination: React.FC<Props> = ({ currentPage, totalItems }) => {
  const router = useRouter()

  const hasPrev = currentPage > 1
  const hasNext = ITEM_PER_PAGE * currentPage < totalItems

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set('page', newPage.toString())
    router.push(`${window.location.pathname}?${params}`)
  }
  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={!hasPrev}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        onClick={() => changePage(currentPage - 1)}
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from(
          { length: Math.ceil(totalItems / ITEM_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1
            return (
              <button
                key={pageIndex}
                className={`px-2 rounded-sm cursor-pointer ${currentPage === pageIndex ? 'bg-mySky' : ''}`}
                onClick={() => changePage(pageIndex)}
              >
                {pageIndex}
              </button>
            )
          },
        )}
      </div>
      <button
        disabled={!hasNext}
        onClick={() => changePage(currentPage + 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
