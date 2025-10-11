/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

type Props = {
  columns: {
    header: string
    accessor: string
    className?: string
  }[]
  renderRow: (item: any) => React.ReactNode
  data: any[]
}

const Table: React.FC<Props> = ({ columns, renderRow, data }) => {
  if (data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center min-h-[50dvh]">
        <h1>There is nothing found</h1>
      </div>
    )
  }
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((item) => renderRow(item))}</tbody>
    </table>
  )
}

export default Table
