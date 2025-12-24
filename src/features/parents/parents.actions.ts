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
  try {
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      emailAddress: data.email ? [data.email] : [],
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'parent' },
    })

    await prisma.parent.create({
      data: {
        id: user.id,
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
  } catch (error: any) {
    console.log('Clerk error:', JSON.stringify(error.errors, null, 2))
    return {
      success: false,
      error: (error.errors || [{ message: 'Unknown error' }]).map(
        (err: any) => ({
          message: err.message || 'An unexpected error occurred.',
        }),
      ),
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
  } catch (error) {
    console.log(error)
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
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}
