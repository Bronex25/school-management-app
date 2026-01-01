import React from 'react'
import FormModal from './FormModal'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export type TableName =
  | 'teacher'
  | 'student'
  | 'parent'
  | 'subject'
  | 'class'
  | 'lesson'
  | 'exam'
  | 'assignment'
  | 'result'
  | 'event'
  | 'announcement'

export type FormConatinerProps = {
  table: TableName
  type: 'create' | 'update' | 'delete'
  data?: unknown
  id?: number | string
  isSubmit?: boolean
}

type RelatedData = {
  teachers?: { id: string | number; name: string; surname?: string }[]
  grades?: { id: number; level: number }[]
  subjects?: { id: number; name: string }[]
  classes?: {
    id: number
    name?: string
    capacity?: number
    _count?: { students: number }
  }[]
  lessons?: { id: number; name: string }[]
  students?: { id: string; name: string; surname: string }[]
  parents?: { id: string; name: string; surname: string }[]
  exams?: { id: number; title: string }[]
  assignments?: { id: number; title: string }[]
}

const FormContainer = async ({
  table,
  type,
  data,
  id,
  isSubmit,
}: FormConatinerProps) => {
  const { sessionClaims, userId } = await auth()
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role

  let relatedData: RelatedData = {}

  if (type !== 'delete') {
    switch (table) {
      case 'subject': {
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        })
        relatedData = { teachers: subjectTeachers }
        break
      }
      case 'class': {
        const [classGrades, classTeachers] = await Promise.all([
          prisma.grade.findMany({ select: { id: true, level: true } }),
          prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          }),
        ])
        relatedData = { teachers: classTeachers, grades: classGrades }
        break
      }
      case 'teacher': {
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        })
        relatedData = { subjects: teacherSubjects }
        break
      }
      case 'student': {
        const [studentGrades, studentClasses, studentParents] =
          await Promise.all([
            prisma.grade.findMany({ select: { id: true, level: true } }),
            prisma.class.findMany({
              select: {
                id: true,
                name: true,
                capacity: true,
                _count: { select: { students: true } },
              },
            }),
            prisma.parent.findMany({
              select: { id: true, name: true, surname: true },
            }),
          ])
        relatedData = {
          classes: studentClasses,
          grades: studentGrades,
          parents: studentParents,
        }
        break
      }
      case 'exam': {
        const [examSubjects, examClasses] = await Promise.all([
          prisma.subject.findMany({
            select: { id: true, name: true },
          }),
          prisma.class.findMany({
            select: { id: true, name: true },
          }),
        ])
        relatedData = { subjects: examSubjects, classes: examClasses }
        break
      }
      case 'announcement': {
        const announcementClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        })
        relatedData = { classes: announcementClasses }
        break
      }
      case 'event': {
        const eventClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        })
        relatedData = { classes: eventClasses }
        break
      }
      case 'lesson': {
        const [lessonSubjects, lessonClasses, lessonTeachers] =
          await Promise.all([
            prisma.subject.findMany({ select: { id: true, name: true } }),
            prisma.class.findMany({ select: { id: true, name: true } }),
            prisma.teacher.findMany({
              select: { id: true, name: true, surname: true },
            }),
          ])
        relatedData = {
          subjects: lessonSubjects,
          classes: lessonClasses,
          teachers: lessonTeachers,
        }
        break
      }
      case 'assignment': {
        let lessons
        if (role === 'teacher' && userId) {
          lessons = await prisma.lesson.findMany({
            where: { teacherId: userId as string },
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
          })
        } else {
          lessons = await prisma.lesson.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
          })
        }
        relatedData = { lessons }
        break
      }
      case 'result': {
        const [resultStudents, resultExams, resultAssignments] =
          await Promise.all([
            prisma.student.findMany({
              select: { id: true, name: true, surname: true },
            }),
            prisma.exam.findMany({
              where:
                role === 'teacher' && userId
                  ? { lesson: { teacherId: userId } }
                  : undefined,
              select: { id: true, title: true },
            }),
            prisma.assignment.findMany({
              where:
                role === 'teacher' && userId
                  ? { lesson: { teacherId: userId } }
                  : undefined,
              select: { id: true, title: true },
            }),
          ])
        relatedData = {
          students: resultStudents,
          exams: resultExams,
          assignments: resultAssignments,
        }
        break
      }
      default:
        break
    }
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relativeData={relatedData}
        isSubmit={isSubmit}
      />
    </div>
  )
}

export default FormContainer
