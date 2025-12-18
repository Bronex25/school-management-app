'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { EventSchema } from './events.schema'
import { EventActionState } from './events.types'

export const createEvent = async (
  currentState: EventActionState,
  data: EventSchema,
): Promise<EventActionState> => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId,
      },
    })

    revalidatePath('/list/events')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateEvent = async (
  currentState: EventActionState,
  data: EventSchema,
): Promise<EventActionState> => {
  try {
    await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId,
      },
    })

    revalidatePath('/list/events')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteEvent = async (
  currentState: EventActionState,
  data: FormData,
): Promise<EventActionState> => {
  const id = data.get('id') as string
  try {
    await prisma.event.delete({ where: { id: parseInt(id) } })

    revalidatePath('/list/events')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}
