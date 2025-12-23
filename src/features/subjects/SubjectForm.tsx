'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '@/components/InputField'
import {
  SubjectFormValues,
  SubjectSchema,
  subjectSchema,
} from './subjects.schema'
import { createSubject, updateSubject } from './subjects.actions'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import FormButton from '@/components/FormButton'

type SubjectFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function SubjectForm({
  type,
  data,
  setOpen,
  relativeData,
}: SubjectFormProps) {
  const subjectData = data as Partial<SubjectSchema> | undefined
  const subjectRelativeData = (relativeData as {
    teachers: { id: string; name: string; surname: string }[]
  }) || { teachers: [] }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      id: subjectData?.id,
      name: subjectData?.name ?? '',
      teachers: subjectData?.teachers ?? [],
    },
  })

  const [isPending, setIsPending] = useState(false)

  const onSubmit = handleSubmit(
    async (formValues) => {
      setIsPending(true)
      try {
        const parsed = subjectSchema.parse(formValues)
        const action = type === 'create' ? createSubject : updateSubject
        const result = await action({ success: false, error: false }, parsed)

        if (result.success) {
          toast(`Subject has been ${type === 'create' ? 'created' : 'updated'}`)
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
        toast.error('Failed to save subject')
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
        {type === 'create' ? 'Create new subject' : 'Update subject'}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject name"
          name="name"
          register={register}
          error={errors.name}
          type="text"
        />
        {subjectData?.id && (
          <InputField
            label="Id"
            name="id"
            register={register}
            error={errors.id}
            type="text"
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('teachers')}
          >
            {subjectRelativeData.teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">
              {errors.teachers.message.toString()}
            </p>
          )}
        </div>
      </div>
      <FormButton isPending={isPending} type={type} />
    </form>
  )
}
