'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '@/components/InputField'
import {
  StudentFormValues,
  StudentSchema,
  studentSchema,
} from './students.schema'
import { createStudent, updateStudent } from './students.actions'
import { Dispatch, SetStateAction, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import FormButton from '@/components/FormButton'
import UploadPhotoButton from '@/components/UploadPhotoButton'
import { dateToString } from '@/lib/utils'

type StudentFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function StudentForm({
  type,
  data,
  setOpen,
  relativeData,
}: StudentFormProps) {
  const studentData = data as Partial<StudentSchema> | undefined
  const studentRelativeData = (relativeData as {
    classes: {
      id: number
      name: string
      capacity: number
      _count: { students: number }
    }[]
    grades: { id: number; level: number }[]
    parents?: { id: string; name: string; surname: string }[]
  }) || { classes: [], grades: [], parents: [] }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      id: studentData?.id,
      username: studentData?.username ?? '',
      email: studentData?.email ?? '',
      password: '',
      name: studentData?.name ?? '',
      surname: studentData?.surname ?? '',
      phone: studentData?.phone ?? '',
      address: studentData?.address ?? '',
      img: (studentData?.img as string | undefined) ?? undefined,
      bloodType: studentData?.bloodType ?? '',
      birthday: studentData?.birthday
        ? dateToString(new Date(studentData.birthday))
        : '',
      sex: studentData?.sex ?? 'MALE',
      gradeId:
        studentData?.gradeId ??
        (studentRelativeData.grades.length
          ? studentRelativeData.grades[0].id
          : undefined),
      classId:
        studentData?.classId ??
        (studentRelativeData.classes.length
          ? studentRelativeData.classes[0].id
          : undefined),
      parentId: studentData?.parentId ?? '',
    },
  })

  const [img, setImg] = useState<string | undefined>(
    studentData?.img ?? undefined,
  )
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const onSubmit = handleSubmit(
    async (formValues) => {
      setIsPending(true)
      try {
        // Validate password for create operations
        if (
          type === 'create' &&
          (!formValues.password || formValues.password.trim() === '')
        ) {
          toast.error('Password is required when creating a student.')
          setIsPending(false)
          return
        }

        const parsed = studentSchema.parse({
          ...formValues,
          img: img ?? formValues.img ?? null,
        })
        const action = type === 'create' ? createStudent : updateStudent
        const result = await action({ success: false, error: false }, parsed)

        if (result.success) {
          toast(
            `Student has been ${type === 'create' ? 'created' : 'updated'}!`,
          )
          setOpen(false)
          router.refresh()
        } else {
          if (Array.isArray(result.error)) {
            result.error.forEach((err) => {
              toast.error(err.message)
            })
          } else if (result.error === true) {
            toast.error('Something went wrong!')
          } else {
            toast.error('An unknown error occurred. Please try again.')
          }
        }
      } catch (error) {
        toast.error('Failed to save student')
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
        {type === 'create' ? 'Create a new student' : 'Update the student'}
      </h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          register={register}
          error={errors?.username}
        />
        <InputField
          label="Email"
          name="email"
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birthday"
          name="birthday"
          register={register}
          error={errors.birthday}
          type="date"
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Parent</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('parentId')}
          >
            {studentRelativeData.parents?.map((parent) => (
              <option value={parent.id} key={parent.id}>
                {parent.name} {parent.surname}
              </option>
            ))}
          </select>
          {errors.parentId?.message && (
            <p className="text-xs text-red-400">
              {errors.parentId.message.toString()}
            </p>
          )}
        </div>
        {studentData?.id && (
          <InputField
            label="Id"
            name="id"
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('sex')}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('gradeId', { valueAsNumber: true })}
          >
            {studentRelativeData.grades.map((grade) => (
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('classId', { valueAsNumber: true })}
          >
            {studentRelativeData.classes.map((classItem) => (
              <option value={classItem.id} key={classItem.id}>
                {classItem.name} -{' '}
                {classItem._count.students + '/' + classItem.capacity} Capacity
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
        <UploadPhotoButton img={img} setImg={setImg}></UploadPhotoButton>
      </div>
      <FormButton isPending={isPending} type={type} />
    </form>
  )
}
