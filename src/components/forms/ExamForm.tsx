/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '../InputField'
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from 'react'
import { toast } from 'react-toastify'
import { ExamSchema, examSchema } from '@/lib/formValidationSchema'
import { createExam, updateExam } from '@/lib/actions'

const ExamForm = ({
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
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  })

  const [state, formAction] = useActionState(
    type === 'create' ? createExam : updateExam,
    {
      success: false,
      error: false,
    },
  )

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    startTransition(() => {
      formAction(data)
    })
  })

  useEffect(() => {
    if (state?.success) {
      toast(`Exam has been ${type === 'create' ? 'created' : 'updated'}`)
      setOpen(false)
    }
  }, [state, type, setOpen])

  const { lessons } = relativeData

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create new subject' : 'Update subject'}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Exam title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors.title}
          type="text"
        />
        <InputField
          label="Start Date"
          name="startTime"
          defaultValue={data?.startTime}
          register={register}
          error={errors.startTime}
          type="datetime-local"
        />
        <InputField
          label="End Date"
          name="endTime"
          defaultValue={data?.endTime}
          register={register}
          error={errors.endTime}
          type="datetime-local"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors.id}
            type="text"
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('lessonId')}
            defaultValue={data?.teachers}
          >
            {lessons.map(
              (lesson: { id: string; name: string; surname: string }) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.name} {lesson.surname}
                </option>
              ),
            )}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>
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

export default ExamForm
