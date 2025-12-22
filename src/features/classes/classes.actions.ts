'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ClassSchema } from './classes.schema'
import { ClassActionState } from './classes.types'

export const createClass = async (
  currentState: ClassActionState,
  data: ClassSchema,
): Promise<ClassActionState> => {
  try {
    await prisma.class.create({
      data,
    })

    revalidatePath('/list/classes')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateClass = async (
  currentState: ClassActionState,
  data: ClassSchema,
): Promise<ClassActionState> => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    })

    revalidatePath('/list/classes')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteClass = async (
  currentState: ClassActionState,
  data: FormData,
): Promise<ClassActionState> => {
  const id = data.get('id') as string
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    })

    revalidatePath('/list/classes')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}
