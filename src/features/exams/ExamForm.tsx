'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '@/components/InputField'
import { ExamFormValues, ExamSchema, examSchema } from './exams.schema'
import { createExam, updateExam } from './exams.actions'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import { dateToString } from '@/lib/utils'
import FormButton from '@/components/FormButton'

type ExamFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function ExamForm({
  type,
  data,
  setOpen,
  relativeData,
}: ExamFormProps) {
  const examData = data as
    | (Partial<ExamSchema> & {
        lesson?: { subjectId: number; classId: number }
      })
    | undefined
  const examRelativeData = (relativeData as {
    subjects: { id: number; name: string }[]
    classes: { id: number; name: string }[]
  }) || { subjects: [], classes: [] }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      id: examData?.id,
      title: examData?.title ?? '',
      startTime: examData?.startTime
        ? dateToString(examData.startTime, true)
        : dateToString(new Date(), true),
      endTime: examData?.endTime
        ? dateToString(examData.endTime, true)
        : dateToString(new Date(), true),
      subjectId:
        examData?.lesson?.subjectId ??
        (examRelativeData.subjects.length
          ? examRelativeData.subjects[0].id
          : undefined),
      classId:
        examData?.lesson?.classId ??
        (examRelativeData.classes.length
          ? examRelativeData.classes[0].id
          : undefined),
    },
  })

  const [isPending, setIsPending] = useState(false)

  const onSubmit = handleSubmit(
    async (formValues) => {
      setIsPending(true)
      try {
        const parsed = examSchema.parse(formValues)
        const action = type === 'create' ? createExam : updateExam
        const result = await action({ success: false, error: false }, parsed)

        if (result.success) {
          toast(`Exam has been ${type === 'create' ? 'created' : 'updated'}`)
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
        toast.error('Failed to save exam')
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
        {type === 'create' ? 'Create new exam' : 'Update exam'}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Exam title"
          name="title"
          register={register}
          error={errors.title}
          type="text"
        />
        <InputField
          label="Start Date"
          name="startTime"
          register={register}
          error={errors.startTime}
          type="datetime-local"
          registerOptions={{ valueAsDate: true }}
        />
        <InputField
          label="End Date"
          name="endTime"
          register={register}
          error={errors.endTime}
          type="datetime-local"
          registerOptions={{ valueAsDate: true }}
        />
        {examData?.id && (
          <InputField
            label="Id"
            name="id"
            register={register}
            error={errors.id}
            type="text"
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('subjectId', { valueAsNumber: true })}
          >
            {examRelativeData.subjects.map((subject) => (
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
            {examRelativeData.classes.map((classItem) => (
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
      </div>
      <FormButton isPending={isPending} type={type} />
    </form>
  )
}
