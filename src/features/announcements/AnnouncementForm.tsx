'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '../../components/InputField'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import { createAnnouncement, updateAnnouncement } from './announcements.actions'
import {
  AnnouncementFormValues,
  AnnouncementSchema,
  announcementSchema,
} from './announcements.schema'

type AnnouncementFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function AnnouncementForm({
  type,
  data,
  setOpen,
  relativeData,
}: AnnouncementFormProps) {
  const announcementData = data as Partial<AnnouncementSchema> | undefined
  const announcementRelativeData = (relativeData as {
    classes: { id: number; name: string }[]
  }) || { classes: [] }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcementData?.title ?? '',
      description: announcementData?.description ?? '',
      date: announcementData?.date
        ? new Date(announcementData.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      classId:
        announcementData?.classId ??
        (announcementRelativeData.classes.length
          ? announcementRelativeData.classes[0].id
          : undefined),
      id: announcementData?.id,
    },
  })

  const [isPending, setIsPending] = useState(false)

  const onSubmit = handleSubmit(async (formValues) => {
    setIsPending(true)
    try {
      const parsed = announcementSchema.parse(formValues)
      const action = type === 'create' ? createAnnouncement : updateAnnouncement
      const result = await action({ success: false, error: false }, parsed)

      if (result.success) {
        toast(
          `Announcement has been ${type === 'create' ? 'created' : 'updated'}`,
        )
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
      toast.error('Failed to save announcement')
      console.error(error)
    } finally {
      setIsPending(false)
    }
  })

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
          register={register}
          error={errors.title}
        />

        <InputField
          label="Description"
          name="description"
          register={register}
          error={errors.description}
        />

        <InputField
          label="Date"
          name="date"
          type="date"
          register={register}
          registerOptions={{ valueAsDate: true }}
          error={errors.date}
        />

        {announcementData?.id && (
          <InputField
            label="Id"
            name="id"
            register={register}
            registerOptions={{ valueAsNumber: true }}
            error={errors.id}
            hidden
          />
        )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            {...register('classId', { valueAsNumber: true })}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            {announcementRelativeData.classes.map((c) => (
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
