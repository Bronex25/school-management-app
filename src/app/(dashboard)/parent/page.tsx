import Announcements from '@/components/Announcements'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const ParentPage = async () => {
  const { userId } = await auth()
  const currentUserId = userId

  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!,
    },
    include: {
      class: true,
    },
  })

  if (students.length === 0) {
    return (
      <div className="p-4 flex gap-4 flex-col xl:flex-row flex-1">
        <div className="w-full xl:w-2/3">
          <div className="h-full bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">No students found</h1>
          </div>
        </div>
        <div className="w-full xl:w-1/3 flex flex-col gap-8">
          <Announcements />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row flex-1">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold mb-4">
              Schedule - {student.name} {student.surname} ({student.class.name})
            </h1>
            <div className="h-[600px]">
              <BigCalendarContainer type="classId" id={student.classId} />
            </div>
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  )
}

export default ParentPage
