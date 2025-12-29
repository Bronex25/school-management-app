'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { TeacherSchema } from './teachers.schema'
import { TeacherActionState } from './teachers.types'
import { clerkClient } from '@clerk/nextjs/server'

const clerk = await clerkClient()

export const createTeacher = async (
  currentState: TeacherActionState,
  data: TeacherSchema,
): Promise<TeacherActionState> => {
  let clerkUser = null
  try {
    if (!data.password || data.password.trim() === '') {
      return {
        success: false,
        error: [{ message: 'Password is required when creating a teacher.' }],
      }
    }

    clerkUser = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      emailAddress: data.email ? [data.email] : [],
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'teacher' },
    })

    const teacherData = {
      id: clerkUser.id,
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || undefined,
      phone: data.phone,
      address: data.address ?? '',
      img: data.img,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: new Date(data.birthday),
      ...(data.subjects && data.subjects.length
        ? {
            subjects: {
              connect: data.subjects.map((id) => ({ id })),
            },
          }
        : {}),
    }

    await prisma.teacher.create({ data: teacherData })

    revalidatePath('/list/teachers')
    return { success: true, error: false }
  } catch (error: any) {
    console.error('Error creating teacher:', error)

    if (clerkUser?.id) {
      try {
        await clerk.users.deleteUser(clerkUser.id)
      } catch (cleanupError) {
        console.error('Failed to cleanup Clerk user:', cleanupError)
      }
    }

    if (error.errors && Array.isArray(error.errors)) {
      return {
        success: false,
        error: error.errors.map((err: any) => ({
          message:
            err.message || err.longMessage || 'An unexpected error occurred.',
        })),
      }
    }

    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field'
      return {
        success: false,
        error: [{ message: `A teacher with this ${field} already exists.` }],
      }
    }

    if (error.message) {
      return {
        success: false,
        error: [{ message: error.message }],
      }
    }

    return {
      success: false,
      error: [
        {
          message:
            'Failed to create teacher. Please check the console for details.',
        },
      ],
    }
  }
}

export const updateTeacher = async (
  currentState: TeacherActionState,
  data: TeacherSchema,
): Promise<TeacherActionState> => {
  if (!data.id) return { success: false, error: true }

  try {
    await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'teacher' },
    })

    const updateData = {
      ...(data.password !== '' && { password: data.password }),
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: new Date(data.birthday),
      ...(Array.isArray(data.subjects)
        ? {
            subjects: {
              set: data.subjects.map((sid) => ({ id: sid })),
            },
          }
        : {}),
    }

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: updateData,
    })

    revalidatePath('/list/teachers')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteTeacher = async (
  currentState: TeacherActionState,
  data: FormData,
): Promise<TeacherActionState> => {
  const id = data.get('id') as string
  try {
    await clerk.users.deleteUser(id)
    await prisma.teacher.delete({
      where: {
        id: id,
      },
    })

    revalidatePath('/list/teachers')
    return { success: true, error: false }
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}
