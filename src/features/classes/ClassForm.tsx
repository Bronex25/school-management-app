'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '@/components/InputField'
import { ClassFormValues, ClassSchema, classSchema } from './classes.schema'
import { createClass, updateClass } from './classes.actions'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import FormButton from '@/components/FormButton'

type ClassFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function ClassForm({
  type,
  data,
  setOpen,
  relativeData,
}: ClassFormProps) {
  const classData = data as Partial<ClassSchema> | undefined
  const classRelativeData = (relativeData as {
    teachers: { id: string; name: string; surname: string }[]
    grades: { id: number; level: number }[]
  }) || { grades: [] }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      id: classData?.id,
      name: classData?.name ?? '',
      capacity: classData?.capacity ?? 0,
      gradeId:
        classData?.gradeId ??
        (classRelativeData.grades.length
          ? classRelativeData.grades[0].id
          : undefined),
      supervisorId: classData?.supervisorId,
    },
  })

  const [isPending, setIsPending] = useState(false)

  const onSubmit = handleSubmit(
    async (formValues) => {
      setIsPending(true)
      try {
        const parsed = classSchema.parse(formValues)
        const action = type === 'create' ? createClass : updateClass
        const result = await action({ success: false, error: false }, parsed)

        if (result.success) {
          toast(`Class has been ${type === 'create' ? 'created' : 'updated'}`)
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
        toast.error('Failed to save class')
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
        {type === 'create' ? 'Create a new class' : 'Update the class'}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class name"
          name="name"
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          register={register}
          error={errors?.capacity}
          registerOptions={{ valueAsNumber: true }}
        />
        {classData?.id && (
          <InputField
            label="Id"
            name="id"
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('supervisorId')}
          >
            {classRelativeData.teachers.map((teacher) => (
              <option value={teacher.id} key={teacher.id}>
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('gradeId', { valueAsNumber: true })}
          >
            {classRelativeData.grades.map((grade) => (
              <option value={grade.id} key={grade.id}>
                {grade.level}
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId.message.toString()}
            </p>
          )}
        </div>
      </div>
      <FormButton isPending={isPending} type={type} />
    </form>
  )
}
