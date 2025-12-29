'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ExamSchema } from './exams.schema'
import { ExamActionState } from './exams.types'

export const createExam = async (
  currentState: ExamActionState,
  data: ExamSchema,
): Promise<ExamActionState> => {
  try {
    let lesson = await prisma.lesson.findFirst({
      where: {
        subjectId: data.subjectId,
        classId: data.classId,
      },
    })

    if (!lesson) {
      const subject = await prisma.subject.findUnique({
        where: { id: data.subjectId },
        include: {
          teachers: {
            take: 1,
          },
        },
      })

      if (!subject || !subject.teachers.length) {
        return {
          success: false,
          error: [
            {
              message:
                'No teacher found for selected subject. Please create a lesson first.',
            },
          ],
        }
      }

      lesson = await prisma.lesson.create({
        data: {
          name: `${subject.name} - Exam`,
          day: 'MONDAY',
          startTime: data.startTime,
          endTime: data.endTime,
          subjectId: data.subjectId,
          classId: data.classId,
          teacherId: subject.teachers[0].id,
        },
      })
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: lesson.id,
      },
    })

    revalidatePath('/list/exams')
    return { success: true, error: false }
  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const updateExam = async (
  currentState: ExamActionState,
  data: ExamSchema,
): Promise<ExamActionState> => {
  try {
    if (!data.id) {
      return { success: false, error: [{ message: 'Exam ID is required' }] }
    }

    let lesson = await prisma.lesson.findFirst({
      where: {
        subjectId: data.subjectId,
        classId: data.classId,
      },
    })

    if (!lesson) {
      const subject = await prisma.subject.findUnique({
        where: { id: data.subjectId },
        include: {
          teachers: {
            take: 1,
          },
        },
      })

      if (!subject || !subject.teachers.length) {
        return {
          success: false,
          error: [
            {
              message:
                'No teacher found for selected subject. Please create a lesson first.',
            },
          ],
        }
      }

      lesson = await prisma.lesson.create({
        data: {
          name: `${subject.name} - Exam`,
          day: 'MONDAY',
          startTime: data.startTime,
          endTime: data.endTime,
          subjectId: data.subjectId,
          classId: data.classId,
          teacherId: subject.teachers[0].id,
        },
      })
    }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: lesson.id,
      },
    })

    revalidatePath('/list/exams')
    return { success: true, error: false }
  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const deleteExam = async (
  currentState: ExamActionState,
  data: FormData,
): Promise<ExamActionState> => {
  const id = data.get('id') as string

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
      },
    })

    revalidatePath('/list/exams')
    return { success: true, error: false }
  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}
