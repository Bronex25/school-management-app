'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '../../components/InputField'

import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import {
  ResultsFormValues,
  ResultsSchema,
  resultSchema,
} from './results.schema'
import { createResult, updateResult } from './results.actions'

type ResultFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function ResultForm({
  type,
  data,
  setOpen,
  relativeData,
}: ResultFormProps) {
  const resultData = data as Partial<ResultsSchema> | undefined
  const resultRelativeData = (relativeData as {
    students: { id: string; name: string; surname: string }[]
    exams: { id: number; title: string }[]
    assignments: { id: number; title: string }[]
  }) || { students: [], exams: [], assignments: [] }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultsFormValues>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      score: resultData?.score ?? 0,
      examId:
        resultData?.examId ??
        (resultRelativeData.exams.length
          ? resultRelativeData.exams[0].id
          : undefined),
      assignmentId:
        resultData?.assignmentId ??
        (resultRelativeData.assignments.length
          ? resultRelativeData.assignments[0].id
          : undefined),
      studentId:
        resultData?.studentId ??
        (resultRelativeData.students.length
          ? resultRelativeData.students[0].id
          : undefined),
      id: resultData?.id,
    },
  })

  const [isPending, setIsPending] = useState(false)

  const onSubmit = handleSubmit(
    async (formValues) => {
      setIsPending(true)

      console.log('ZOD INPUT:', formValues)

      try {
        const parsed = resultSchema.parse(formValues)
        const action = type === 'create' ? createResult : updateResult
        const result = await action({ success: false, error: false }, parsed)
        console.log('ZOD RESULT:', parsed)
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
        {type === 'create' ? 'Create a new result' : 'Update the result'}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Score"
          name="score"
          register={register}
          error={errors?.score}
          type="number"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('studentId')}
          >
            {!resultRelativeData.students.length && (
              <option value="">No students available</option>
            )}
            {resultRelativeData.students.map(
              (student: { id: string; name: string; surname: string }) => (
                <option key={student.id} value={student.id}>
                  {student.name} {student.surname}
                </option>
              ),
            )}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Exam (optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('examId', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
          >
            <option value="">Select exam</option>
            {resultRelativeData.exams.map(
              (exam: { id: number; title: string }) => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ),
            )}
          </select>
          {errors.examId?.message && (
            <p className="text-xs text-red-400">
              {errors.examId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Assignment (optional)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('assignmentId', {
              setValueAs: (v) => (v === '' ? undefined : Number(v)),
            })}
          >
            <option value="">Select assignment</option>
            {resultRelativeData.assignments.map(
              (assignment: { id: number; title: string }) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title}
                </option>
              ),
            )}
          </select>
          {errors.assignmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.assignmentId.message.toString()}
            </p>
          )}
        </div>

        {type === 'update' && resultData?.id && (
          <InputField
            label="Id"
            name="id"
            register={register}
            error={errors?.id}
            hidden
          />
        )}
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
