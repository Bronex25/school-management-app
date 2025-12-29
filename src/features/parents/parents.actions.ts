'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ParentSchema } from './parents.schema'
import { ParentActionState } from './parents.types'
import { clerkClient } from '@clerk/nextjs/server'

const clerk = await clerkClient()

export const createParent = async (
  currentState: ParentActionState,
  data: ParentSchema,
): Promise<ParentActionState> => {
  let clerkUser = null
  try {
    if (!data.password || data.password.trim() === '') {
      return {
        success: false,
        error: [{ message: 'Password is required when creating a parent.' }],
      }
    }

    clerkUser = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      emailAddress: data.email ? [data.email] : [],
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'parent' },
    })

    await prisma.parent.create({
      data: {
        id: clerkUser.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
      },
    })

    revalidatePath('/list/parents')
    return { success: true, error: false }
  } catch (error: unknown) {
    console.error('Error creating parent:', error)

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
        error: [{ message: `A parent with this ${field} already exists.` }],
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
            'Failed to create parent. Please check the console for details.',
        },
      ],
    }
  }
}

export const updateParent = async (
  currentState: ParentActionState,
  data: ParentSchema,
): Promise<ParentActionState> => {
  if (!data.id) return { success: false, error: true }

  try {
    await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== '' && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'parent' },
    })

    await prisma.parent.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone,
        address: data.address,
      },
    })

    revalidatePath('/list/parents')
    return { success: true, error: false }
  } catch (error: unknown) {
    console.error('Error updating parent:', error)

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
        error: [{ message: `A parent with this ${field} already exists.` }],
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

export const deleteParent = async (
  currentState: ParentActionState,
  data: FormData,
): Promise<ParentActionState> => {
  const id = data.get('id') as string
  try {
    await clerk.users.deleteUser(id)
    await prisma.parent.delete({
      where: { id },
    })

    revalidatePath('/list/parents')
    return { success: true, error: false }
  } catch (error: unknown) {
    console.error('Error deleting parent:', error)

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
        error: [{ message: `A parent with this ${field} already exists.` }],
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
