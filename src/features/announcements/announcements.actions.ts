'use server'

import prisma from '@/lib/prisma'
import { AnnouncementSchema } from './announcements.schema'
import { AnnouncementActionState } from './announcements.types'
import { revalidatePath } from 'next/cache'

export const createAnnouncement = async (
  currentState: AnnouncementActionState,
  data: AnnouncementSchema,
): Promise<AnnouncementActionState> => {
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId,
      },
    })
    revalidatePath('/list/announcements')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const updateAnnouncement = async (
  currentState: AnnouncementActionState,
  data: AnnouncementSchema,
): Promise<AnnouncementActionState> => {
  try {
    await prisma.announcement.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data.classId,
      },
    })
    revalidatePath('/list/announcements')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteAnnouncement = async (
  currentState: AnnouncementActionState,
  data: FormData,
): Promise<AnnouncementActionState> => {
  const id = data.get('id') as string
  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id),
      },
    })

    revalidatePath('/list/announcements')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}
