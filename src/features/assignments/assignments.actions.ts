'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { AssignmentSchema } from './assignments.schema'
import { AssignmentActionState } from './assignments.types'

export const createAssignment = async (
  currentState: AssignmentActionState,
  data: AssignmentSchema,
) => {
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    })
    revalidatePath('/list/assignments')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateAssignment = async (
  currentState: AssignmentActionState,
  data: AssignmentSchema,
) => {
  if (!data.id) return { success: false, error: true }
  try {
    await prisma.assignment.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    })
    revalidatePath('/list/assignments')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteAssignment = async (
  currentState: AssignmentActionState,
  data: FormData,
) => {
  const id = data.get('id') as string
  try {
    await prisma.assignment.delete({
      where: { id: parseInt(id) },
    })
    revalidatePath('/list/assignments')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}
