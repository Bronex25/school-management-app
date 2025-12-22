'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '../../components/InputField'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import {
  AssignmentFormValues,
  AssignmentSchema,
  assignmentSchema,
} from './assignments.schema'
import { dateToString } from '@/lib/utils'
import { createAssignment, updateAssignment } from './assignments.actions'
import FormButton from '@/components/FormButton'

type AssignmenFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function AssignmentForm({
  type,
  data,
  setOpen,
  relativeData,
}: AssignmenFormProps) {
  const assignmentData = data as Partial<AssignmentSchema> | undefined
  const assignmentRelativeData = (relativeData as {
    lessons: { id: number; name: string }[]
  }) || { lessons: [] }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: assignmentData?.title ?? '',
      startDate: assignmentData?.startDate
        ? dateToString(assignmentData?.startDate, true)
        : dateToString(new Date(), true),
      dueDate: assignmentData?.dueDate
        ? dateToString(assignmentData.dueDate, true)
        : dateToString(new Date(), true),
      lessonId:
        assignmentData?.lessonId ??
        (assignmentRelativeData.lessons.length
          ? assignmentRelativeData.lessons[0].id
          : undefined),
      id: assignmentData?.id,
    },
  })

  console.log(assignmentRelativeData.lessons)

  const [isPending, setIsPending] = useState(false)

  const onSubmit = handleSubmit(
    async (formValues) => {
      setIsPending(true)

      try {
        const parsed = assignmentSchema.parse(formValues)
        const action = type === 'create' ? createAssignment : updateAssignment
        const result = await action({ success: false, error: false }, parsed)
        if (result.success) {
          toast(`Result has been ${type === 'create' ? 'created' : 'updated'}`)
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
        toast.error('Failed to save result')
        console.error(error)
      } finally {
        setIsPending(false)
      }
    },
    (errors) => {
      console.error('Validation errors:', errors)
      Object.values(errors).forEach((error) => {
        if (error?.message) {
          toast.error(error.message as string)
        }
      })
    },
  )

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create'
          ? 'Create a new assignment'
          : 'Update the assignment'}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Assignment Title"
          name="title"
          defaultValue={assignmentData?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Start Date"
          name="startDate"
          register={register}
          error={errors?.startDate}
          type="datetime-local"
        />
        <InputField
          label="Due Date"
          name="dueDate"
          register={register}
          error={errors?.dueDate}
          type="datetime-local"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Lesson</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('lessonId')}
            defaultValue={assignmentData?.lessonId}
          >
            {assignmentRelativeData.lessons.map(
              (lesson: { id: number; name: string }) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.name}
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
        {type === 'update' && assignmentData?.id && (
          <InputField
            label="Id"
            name="id"
            register={register}
            error={errors?.id}
            hidden
          />
        )}
      </div>

      <FormButton isPending={isPending} type={type} />
    </form>
  )
}
