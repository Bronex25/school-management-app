'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '@/components/InputField'
import { LessonFormValues, LessonSchema, lessonSchema } from './lessons.schema'
import { createLesson, updateLesson } from './lessons.actions'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import FormButton from '@/components/FormButton'
import { dateToString } from '@/lib/utils'

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

type LessonFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function LessonForm({
  type,
  data,
  setOpen,
  relativeData,
}: LessonFormProps) {
  const lessonData = data as Partial<LessonSchema> | undefined
  const lessonRelativeData = (relativeData as {
    subjects: { id: number; name: string }[]
    classes: { id: number; name: string }[]
    teachers: { id: string; name: string; surname: string }[]
  }) || { subjects: [], classes: [], teachers: [] }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      id: lessonData?.id,
      name: lessonData?.name ?? '',
      day: lessonData?.day ?? 'MONDAY',
      startTime: lessonData?.startTime
        ? dateToString(lessonData.startTime, true)
        : dateToString(new Date(), true),
      endTime: lessonData?.endTime
        ? dateToString(lessonData.endTime, true)
        : dateToString(new Date(), true),
      subjectId:
        lessonData?.subjectId ??
        (lessonRelativeData.subjects.length
          ? lessonRelativeData.subjects[0].id
          : undefined),
      classId:
        lessonData?.classId ??
        (lessonRelativeData.classes.length
          ? lessonRelativeData.classes[0].id
          : undefined),
      teacherId:
        lessonData?.teacherId ??
        (lessonRelativeData.teachers.length
          ? lessonRelativeData.teachers[0].id
          : undefined),
    },
  })

  const [isPending, setIsPending] = useState(false)

  const onSubmit = handleSubmit(
    async (formValues) => {
      setIsPending(true)
      try {
        const parsed = lessonSchema.parse(formValues)
        const action = type === 'create' ? createLesson : updateLesson
        const result = await action({ success: false, error: false }, parsed)

        if (result.success) {
          toast(`Lesson has been ${type === 'create' ? 'created' : 'updated'}`)
          setOpen(false)
        } else {
          if (Array.isArray(result.error)) {
            result.error.forEach((err) => {
              toast.error(err.message)
            })
          } else if (result.error === true) {
            toast.error('Something went wrong!')
          }
        }
      } catch (error) {
        toast.error('Failed to save lesson')
        console.error(error)
      } finally {
        setIsPending(false)
      }
    },
    (formErrors) => {
      console.error('Validation errors:', formErrors)
      Object.values(formErrors).forEach((error) => {
        if (error?.message) {
          toast.error(error.message as string)
        }
      })
    },
  )

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new lesson' : 'Update the lesson'}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lesson Name"
          name="name"
          register={register}
          error={errors?.name}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('day')}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          {errors.day?.message && (
            <p className="text-xs text-red-400">
              {errors.day.message.toString()}
            </p>
          )}
        </div>
        <InputField
          label="Start time"
          name="startTime"
          register={register}
          error={errors?.startTime}
          type="datetime-local"
          registerOptions={{ valueAsDate: true }}
        />
        <InputField
          label="End time"
          name="endTime"
          register={register}
          error={errors?.endTime}
          type="datetime-local"
          registerOptions={{ valueAsDate: true }}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('subjectId', { valueAsNumber: true })}
          >
            {lessonRelativeData.subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('classId', { valueAsNumber: true })}
          >
            {lessonRelativeData.classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('teacherId')}
          >
            {lessonRelativeData.teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId.message.toString()}
            </p>
          )}
        </div>
        {lessonData?.id && (
          <InputField
            label="Id"
            name="id"
            register={register}
            registerOptions={{ valueAsNumber: true }}
            error={errors?.id}
            hidden
          />
        )}
      </div>
      <FormButton isPending={isPending} type={type} />
    </form>
  )
}
