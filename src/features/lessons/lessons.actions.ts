'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { LessonSchema } from './lessons.schema'
import { LessonActionState } from './lessons.types'

export const createLesson = async (
  currentState: LessonActionState,
  data: LessonSchema,
): Promise<LessonActionState> => {
  try {
    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    })

    revalidatePath('/list/lessons')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateLesson = async (
  currentState: LessonActionState,
  data: LessonSchema,
): Promise<LessonActionState> => {
  if (!data.id) return { success: false, error: true }
  try {
    await prisma.lesson.update({
      where: { id: Number(data.id) },
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    })
    revalidatePath('/list/lessons')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteLesson = async (
  currentState: LessonActionState,
  data: FormData,
): Promise<LessonActionState> => {
  const id = data.get('id') as string
  try {
    await prisma.lesson.delete({
      where: { id: parseInt(id) },
    })
    revalidatePath('/list/lessons')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}
