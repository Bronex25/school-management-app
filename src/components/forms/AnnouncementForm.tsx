/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '../InputField'
import {
  AnnouncementSchema,
  announcementSchema,
} from '@/lib/formValidationSchema'
import { createAnnouncement, updateAnnouncement } from '@/lib/actions'
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'

const AnnouncementForm = ({
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
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema) as any,
  })

  const [state, formAction] = useActionState(
    type === 'create' ? createAnnouncement : updateAnnouncement,
    {
      success: false,
      error: false,
    },
  )

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    formAction(data as AnnouncementSchema)
  })

  useEffect(() => {
    if (state.success) {
      toast(`Class has been ${type === 'create' ? 'created' : 'updated'}`)
      setOpen(false)
    }
  }, [state, type, setOpen])

  const { classes } = relativeData
  const defaultDateValue = data?.date
    ? new Date(data.date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === 'create'
          ? 'Create a new announcement'
          : 'Update the announcement'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Announcement title"
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
          label="Date"
          name="date"
          type="date"
          defaultValue={defaultDateValue}
          register={register}
          registerOptions={{ valueAsDate: true }}
          error={errors?.date}
        />
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('classId', { valueAsNumber: true })}
            defaultValue={data?.classId}
          >
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

export default AnnouncementForm
