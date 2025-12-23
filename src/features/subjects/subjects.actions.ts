'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { SubjectSchema } from './subjects.schema'
import { SubjectActionState } from './subjects.types'

export const createSubject = async (
  currentState: SubjectActionState,
  data: SubjectSchema,
): Promise<SubjectActionState> => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    })

    revalidatePath('/list/subjects')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateSubject = async (
  currentState: SubjectActionState,
  data: SubjectSchema,
): Promise<SubjectActionState> => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    })

    revalidatePath('/list/subjects')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteSubject = async (
  currentState: SubjectActionState,
  data: FormData,
): Promise<SubjectActionState> => {
  const id = data.get('id') as string
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    })

    revalidatePath('/list/subjects')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}
