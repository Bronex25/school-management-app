'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '../../components/InputField'

import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import { EventFormValues, EventSchema, eventSchema } from './events.schema'
import { createEvent, updateEvent } from './events.actions'
import { dateToString } from '@/lib/utils'

type EventFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function EventForm({
  type,
  data,
  setOpen,
  relativeData,
}: EventFormProps) {
  const eventData = data as Partial<EventSchema> | undefined
  const eventRelativeData = (relativeData as {
    classes: { id: number; name: string }[]
  }) || { classes: [] }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: eventData?.title ?? '',
      description: eventData?.description ?? '',
      startTime: eventData?.startTime
        ? dateToString(eventData.startTime, true)
        : dateToString(new Date(), true),
      endTime: eventData?.endTime
        ? dateToString(eventData.endTime, true)
        : dateToString(new Date(), true),
      classId:
        eventData?.classId ??
        (eventRelativeData.classes.length
          ? eventRelativeData.classes[0].id
          : undefined),
      id: eventData?.id,
    },
  })

  const [isPending, setIsPending] = useState(false)

  const onSubmit = handleSubmit(async (formValues) => {
    setIsPending(true)
    try {
      const parsed = eventSchema.parse(formValues)
      const action = type === 'create' ? createEvent : updateEvent
      const result = await action({ success: false, error: false }, parsed)

      if (result.success) {
        toast(`Event has been ${type === 'create' ? 'created' : 'updated'}`)
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
      toast.error('Failed to save Event')
      console.error(error)
    } finally {
      setIsPending(false)
    }
  })

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create' ? 'Create a new event' : 'Update the event'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Event title"
          name="title"
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Description"
          name="description"
          register={register}
          error={errors?.description}
        />
        <InputField
          label="Start time"
          name="startTime"
          register={register}
          registerOptions={{ valueAsDate: true }}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="End time"
          name="endTime"
          register={register}
          registerOptions={{ valueAsDate: true }}
          error={errors?.endTime}
          type="datetime-local"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            {...register('classId', { valueAsNumber: true })}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            {eventRelativeData.classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="text-xs text-red-400">{errors.classId.message}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className={`p-2 rounded-md text-white ${
          isPending ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-400'
        }`}
      >
        {isPending ? 'Saving...' : type === 'create' ? 'Create' : 'Update'}
      </button>
    </form>
  )
}
