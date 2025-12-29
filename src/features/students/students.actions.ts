'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { StudentSchema } from './students.schema'
import { StudentActionState } from './students.types'
import { clerkClient } from '@clerk/nextjs/server'

const clerk = await clerkClient()

export const createStudent = async (
  currentState: StudentActionState,
  data: StudentSchema,
): Promise<StudentActionState> => {
  let clerkUser = null
  try {
    if (!data.password || data.password.trim() === '') {
      return {
        success: false,
        error: [{ message: 'Password is required when creating a student.' }],
      }
    }

    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    })

    if (classItem && classItem.capacity === classItem._count.students) {
      return {
        success: false,
        error: [{ message: 'The selected class is at full capacity.' }],
      }
    }

    clerkUser = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      emailAddress: data.email ? [data.email] : [],
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'student' },
    })

    const studentData = {
      id: clerkUser.id,
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
      gradeId: data.gradeId,
      parentId: data.parentId,
      classId: data.classId,
    }

    await prisma.student.create({ data: studentData })

    revalidatePath('/list/students')
    return { success: true, error: false }
  } catch (error: unknown) {
    console.error('Error creating student:', error)

    if (clerkUser?.id) {
      try {
        await clerk.users.deleteUser(clerkUser.id)
      } catch (cleanupError) {
        console.error('Failed to cleanup Clerk user:', cleanupError)
      }
    }

    const err = error as {
      errors?: Array<{ message?: string; longMessage?: string }>
      code?: string
      meta?: { target?: string[] }
      message?: string
    }

    if (err.errors && Array.isArray(err.errors)) {
      return {
        success: false,
        error: err.errors.map((e) => ({
          message:
            e.message || e.longMessage || 'An unexpected error occurred.',
        })),
      }
    }

    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field'
      return {
        success: false,
        error: [{ message: `A student with this ${field} already exists.` }],
      }
    }

    if (err.message) {
      return {
        success: false,
        error: [{ message: err.message }],
      }
    }

    return {
      success: false,
      error: [
        {
          message:
            'Failed to create student. Please check the console for details.',
        },
      ],
    }
  }
}

export const updateStudent = async (
  currentState: StudentActionState,
  data: StudentSchema,
): Promise<StudentActionState> => {
  if (!data.id) return { success: false, error: true }

  try {
    await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'student' },
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
      gradeId: data.gradeId,
      parentId: data.parentId,
      classId: data.classId,
    }

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: updateData,
    })

    revalidatePath('/list/students')
    return { success: true, error: false }
  } catch (error: unknown) {
    console.error('Error updating student:', error)

    const err = error as {
      errors?: Array<{ message?: string; longMessage?: string }>
      code?: string
      meta?: { target?: string[] }
      message?: string
    }

    if (err.errors && Array.isArray(err.errors)) {
      return {
        success: false,
        error: err.errors.map((e) => ({
          message:
            e.message || e.longMessage || 'An unexpected error occurred.',
        })),
      }
    }

    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field'
      return {
        success: false,
        error: [{ message: `A student with this ${field} already exists.` }],
      }
    }

    if (err.message) {
      return {
        success: false,
        error: [{ message: err.message }],
      }
    }

    return { success: false, error: true }
  }
}

export const deleteStudent = async (
  currentState: StudentActionState,
  data: FormData,
): Promise<StudentActionState> => {
  const id = data.get('id') as string
  try {
    await clerk.users.deleteUser(id)
    await prisma.student.delete({
      where: {
        id: id,
      },
    })

    revalidatePath('/list/students')
    return { success: true, error: false }
  } catch (error: unknown) {
    console.error('Error deleting student:', error)

    const err = error as {
      errors?: Array<{ message?: string; longMessage?: string }>
      code?: string
      meta?: { target?: string[] }
      message?: string
    }

    if (err.errors && Array.isArray(err.errors)) {
      return {
        success: false,
        error: err.errors.map((e) => ({
          message:
            e.message || e.longMessage || 'An unexpected error occurred.',
        })),
      }
    }

    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field'
      return {
        success: false,
        error: [{ message: `A student with this ${field} already exists.` }],
      }
    }

    if (err.message) {
      return {
        success: false,
        error: [{ message: err.message }],
      }
    }

    return { success: false, error: true }
  }
}
