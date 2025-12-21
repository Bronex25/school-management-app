'use server'

import { revalidatePath } from 'next/cache'
import { ResultActionState } from './results.types'
import { ResultsSchema } from './results.schema'
import prisma from '@/lib/prisma'

export const createResult = async (
  currentState: ResultActionState,
  data: ResultsSchema,
) => {
  try {
    await prisma.result.create({
      data: {
        score: data.score,
        examId: data.examId,
        assignmentId: data.assignmentId,
        studentId: data.studentId,
      },
    })
    revalidatePath('/list/results')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateResult = async (
  currentState: ResultActionState,
  data: ResultsSchema,
) => {
  if (!data.id) return { success: false, error: true }
  try {
    await prisma.result.update({
      where: { id: data.id },
      data: {
        score: data.score,
        examId: data.examId,
        assignmentId: data.assignmentId,
        studentId: data.studentId,
      },
    })
    revalidatePath('/list/results')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteResult = async (
  currentState: ResultActionState,
  data: FormData,
) => {
  const id = data.get('id') as string
  try {
    await prisma.result.delete({
      where: { id: parseInt(id) },
    })
    revalidatePath('/list/results')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}
