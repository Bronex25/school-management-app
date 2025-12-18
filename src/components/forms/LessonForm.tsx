/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '../InputField'
import { LessonSchema, lessonSchema } from '@/lib/formValidationSchema'
import { createLesson, updateLesson } from '@/lib/actions'
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from 'react'
import { toast } from 'react-toastify'

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']

const LessonForm = ({
  type,
  data,
  setOpen,
  relativeData,
}: {
  type: 'create' | 'update'
  data?: any
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: any
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  })

  const [state, formAction] = useActionState(
    type === 'create' ? createLesson : updateLesson,
    { success: false, error: false },
  )

  const onSubmit = handleSubmit((formData) => {
    startTransition(() => {
      formAction({
        ...formData,
        startTime: new Date(formData.startTime),
        endTime: new Date(formData.endTime),
      })
    })
  })

  useEffect(() => {
    if (state?.success) {
      toast(`Lesson has been ${type === 'create' ? 'created' : 'updated'}`)
      setOpen(false)
    }
  }, [state, type, setOpen])

  const { subjects = [], classes = [], teachers = [] } = relativeData || {}

  const defaultStart = data?.startTime
    ? new Date(data.startTime).toISOString().slice(0, 16)
    : undefined
  const defaultEnd = data?.endTime
    ? new Date(data.endTime).toISOString().slice(0, 16)
    : undefined

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new lesson' : 'Update the lesson'}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Lesson Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('day')}
            defaultValue={data?.day ?? 'MONDAY'}
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
          defaultValue={defaultStart}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="End time"
          name="endTime"
          defaultValue={defaultEnd}
          register={register}
          error={errors?.endTime}
          type="datetime-local"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('subjectId')}
            defaultValue={data?.subjectId}
          >
            {subjects.map((subject: { id: number; name: string }) => (
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
            {...register('classId')}
            defaultValue={data?.classId}
          >
            {classes.map((classItem: { id: number; name: string }) => (
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
            defaultValue={data?.teacherId}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} {teacher.surname}
                </option>
              ),
            )}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId.message.toString()}
            </p>
          )}
        </div>
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            registerOptions={{ valueAsNumber: true }}
            error={errors?.id}
            hidden
          />
        )}
      </div>
      {state?.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  )
}

export default LessonForm

