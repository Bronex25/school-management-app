/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { revalidatePath } from 'next/cache'
import {
  AnnouncementSchema,
  ClassSchema,
  ExamSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from './formValidationSchema'
import prisma from './prisma'
import { clerkClient } from '@clerk/nextjs/server'

const clerk = await clerkClient()

type CurrentState = { success: boolean; error: boolean }

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema,
) => {
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
  currentState: CurrentState,
  data: SubjectSchema,
) => {
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
  currentState: CurrentState,
  data: FormData,
) => {
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

export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema,
) => {
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
  currentState: CurrentState,
  data: AnnouncementSchema,
) => {
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
  currentState: CurrentState,
  data: FormData,
) => {
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

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema,
) => {
  try {
    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    })

    return { success: true, error: false }
  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema,
) => {
  try {
    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    })

    return { success: true, error: false }
  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get('id') as string

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
      },
    })

    return { success: true, error: false }
  } catch (err) {
    console.log(err)
    return { success: false, error: true }
  }
}

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema,
) => {
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
  currentState: CurrentState,
  data: ClassSchema,
) => {
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
  currentState: CurrentState,
  data: FormData,
) => {
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

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema,
) => {
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    })

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true }
    }

    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      emailAddress: [data.email!],
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'student' },
    })

    const studentData = {
      id: user.id,
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
  } catch (error: any) {
    console.log('Clerk error:', JSON.stringify(error.errors, null, 2))
    return { success: false, error: true }
  }
}

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema,
) => {
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
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData,
) => {
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
  } catch (error) {
    console.log(error)
    return { success: false, error: true }
  }
}

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema,
) => {
  try {
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      emailAddress: [data.email!],
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: 'teacher' },
    })

    const teacherData = {
      id: user.id,
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
              connect: data.subjects.map((sid) => ({ id: parseInt(sid) })),
            },
          }
        : {}),
    }

    await prisma.teacher.create({ data: teacherData })

    revalidatePath('/list/teachers')
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

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema,
) => {
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
              set: data.subjects.map((sid) => ({ id: parseInt(sid) })),
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
  currentState: CurrentState,
  data: FormData,
) => {
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
