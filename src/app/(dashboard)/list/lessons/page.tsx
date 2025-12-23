import FormContainer from '@/components/FormContainer'
import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { Class, Lesson, Prisma, Subject, Teacher } from '@/generated/prisma'
import prisma from '@/lib/prisma'
import { dateToString } from '@/lib/utils'
import { ITEM_PER_PAGE } from '@/lib/variables'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import React from 'react'

type LessonList = Lesson & { subject: Subject } & { class: Class } & {
  teacher: Teacher
}

const { sessionClaims } = await auth()
const role = (sessionClaims?.metadata as { role?: string }).role

const columns = [
  {
    header: 'Name',
    accessor: 'name',
  },
  {
    header: 'Day',
    accessor: 'day',
  },
  {
    header: 'Start Time',
    accessor: 'startTime',
    className: 'hidden md:table-cell',
  },
  {
    header: 'End Time',
    accessor: 'endTime',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Subject Name',
    accessor: 'name',
  },
  {
    header: 'Class',
    accessor: 'class',
  },
  {
    header: 'Teacher',
    accessor: 'teacher',
    className: 'hidden md:table-cell',
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
const renderRow = (item: LessonList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-myPurple"
  >
    <td className="flex items-center gap-4 p-4">{item.name}</td>
    <td>{item.day}</td>
    <td className="hidden md:table-cell">
      {item.startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}
    </td>
    <td className="hidden md:table-cell">
      {item.endTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })}
    </td>
    <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
    <td>{item.class.name}</td>
    <td className="hidden md:table-cell">
      {item.teacher.name + ' ' + item.teacher.surname}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {role === 'admin' && (
          <>
            <FormContainer table="lesson" type="update" data={item} />
            <FormModal table="lesson" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>
)

const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) => {
  const { page, ...queryParams } = await searchParams

  const currentPage = page ? parseInt(page) : 1

  const query: Prisma.LessonWhereInput = {}

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case 'classId':
          query.classId = parseInt(value)
          break
        case 'teacherId':
          query.teacherId = value
          break
        case 'search':
          query.OR = [
            { subject: { name: { contains: value, mode: 'insensitive' } } },
            { teacher: { name: { contains: value, mode: 'insensitive' } } },
          ]
          break
        default:
          break
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        subject: { select: { name: true } },
        class: { select: { name: true } },
        teacher: { select: { name: true, surname: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.lesson.count({
      where: query,
    }),
  ])
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-myYellow">
              <Image
                src="/filter.png"
                alt="fliter button"
                width={14}
                height={14}
              ></Image>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-myYellow">
              <Image
                src="/sort.png"
                alt="sort button"
                width={14}
                height={14}
              ></Image>
            </button>
            {role === 'admin' && <FormContainer table="lesson" type="create" />}
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

export default LessonListPage
