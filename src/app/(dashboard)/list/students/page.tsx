import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Class, Prisma, Student } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { role } from '@/lib/utils'
import { ITEM_PER_PAGE } from '@/lib/variables'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type StudentList = Student & { class: Class }

const columns = [
  {
    header: 'Info',
    accessor: 'info',
  },
  {
    header: 'Student ID',
    accessor: 'studentId',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Grade',
    accessor: 'grade',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Phone',
    accessor: 'phone',
    className: 'hidden lg:table-cell',
  },
  {
    header: 'Address',
    accessor: 'address',
    className: 'hidden lg:table-cell',
  },
  ...(role === 'admin'
    ? [
      {
        header: 'Actions',
        accessor: 'action',
      },
    ]
    : []),
]
const renderRow = (item: StudentList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-myPurple"
  >
    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.img || '/noAvatar.png'}
        alt="photo"
        width={48}
        height={48}
        className="md: hidden xl:block w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item?.class.name}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.username}</td>
    <td className="hidden md:table-cell">{item.class.name[0]}</td>
    <td className="hidden lg:table-cell">{item.phone}</td>
    <td className="hidden lg:table-cell">{item.address}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/students/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-mySky">
            <Image
              src="/view.png"
              alt="view button"
              height={16}
              width={16}
            ></Image>
          </button>
        </Link>
        {role === 'admin' && (
          <FormModal table="student" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
)

const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) => {
  const { page, ...queryParams } = await searchParams

  const currentPage = page ? parseInt(page) : 1

  const query: Prisma.StudentWhereInput = {}

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case 'teacherId':
          query.class = {
            lessons: {
              some: {
                teacherId: value,
              },
            },
          }
          break
        case 'search':
          query.name = { contains: value, mode: 'insensitive' }
          break
        default:
          break
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        class: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.student.count({
      where: query,
    }),
  ])
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-myYellow cursor-pointer">
              <Image
                src="/filter.png"
                alt="fliter button"
                width={14}
                height={14}
              ></Image>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-myYellow cursor-pointer">
              <Image
                src="/sort.png"
                alt="sort button"
                width={14}
                height={14}
              ></Image>
            </button>
            {role === 'admin' && <FormModal table="student" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination currentPage={currentPage} totalItems={count} />
    </div>
  )
}

export default StudentListPage
