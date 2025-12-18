/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '../InputField'
import { EventSchema, eventSchema } from '@/lib/formValidationSchema'
import { createEvent, updateEvent } from '@/lib/actions'
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from 'react'
import { toast } from 'react-toastify'

const EventForm = ({
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
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema) as any,
  })

  const [state, formAction] = useActionState(
    type === 'create' ? createEvent : (updateEvent as any),
    {
      success: false,
      error: false,
    },
  )

  const classes = relativeData?.classes || []

  const onSubmit = handleSubmit((formValues) => {
    startTransition(() => {
      const classIdValue =
        formValues.classId === undefined || Number.isNaN(formValues.classId)
          ? undefined
          : formValues.classId
      ;(formAction as any)({
        ...formValues,
        classId: classIdValue,
      })
    })
  })

  useEffect(() => {
    if (state?.success) {
      toast(`Event has been ${type === 'create' ? 'created' : 'updated'}`)
      setOpen(false)
    }
  }, [state, type, setOpen])

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new event' : 'Update the event'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Event title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Description"
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
        <InputField
          label="Start time"
          name="startTime"
          defaultValue={
            data?.startTime
              ? new Date(data.startTime).toISOString().slice(0, 16)
              : undefined
          }
          register={register}
          registerOptions={{ valueAsDate: true }}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="End time"
          name="endTime"
          defaultValue={
            data?.endTime
              ? new Date(data.endTime).toISOString().slice(0, 16)
              : undefined
          }
          register={register}
          registerOptions={{ valueAsDate: true }}
          error={errors?.endTime}
          type="datetime-local"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('classId', { valueAsNumber: true })}
            defaultValue={data?.classId ?? ''}
          >
            <option value="">No class</option>
            {classes.map((classItem: { id: number; name: string }) => (
              <option value={classItem.id} key={classItem.id}>
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
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  )
}

export default EventForm
