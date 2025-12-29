'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '@/components/InputField'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  TeacherFormValues,
  TeacherSchema,
  teacherSchema,
} from './teachers.schema'
import { createTeacher, updateTeacher } from './teachers.actions'
import { toast } from 'react-toastify'
import UploadPhotoButton from '@/components/UploadPhotoButton'

import FormButton from '@/components/FormButton'
import { dateToString } from '@/lib/utils'

type TeacherFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function TeacherForm({
  type,
  data,
  setOpen,
  relativeData,
}: TeacherFormProps) {
  const teacherData = data as Partial<TeacherSchema> | undefined
  const teacherRelativeData = (relativeData as {
    subjects: { id: number; name: string }[]
  }) || { subjects: [] }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      id: teacherData?.id,
      username: teacherData?.username ?? '',
      email: teacherData?.email ?? '',
      password: '',
      name: teacherData?.name ?? '',
      surname: teacherData?.surname ?? '',
      phone: teacherData?.phone ?? '',
      address: teacherData?.address ?? '',
      img: teacherData?.img,
      bloodType: teacherData?.bloodType ?? '',
      birthday: teacherData?.birthday
        ? dateToString(new Date(teacherData.birthday))
        : '',
      sex: teacherData?.sex ?? 'MALE',
      subjects: teacherData?.subjects ?? [],
    },
  })

  const [img, setImg] = useState<string | undefined>(
    teacherData?.img ?? undefined,
  )
  const [isPending, setIsPending] = useState(false)

  const onSubmit = handleSubmit(
    async (formValues) => {
      setIsPending(true)
      try {
        if (
          type === 'create' &&
          (!formValues.password || formValues.password.trim() === '')
        ) {
          toast.error('Password is required when creating a teacher.')
          setIsPending(false)
          return
        }

        const parsed = teacherSchema.parse({
          ...formValues,
          img: img ?? formValues.img ?? null,
          subjects: Array.isArray(formValues.subjects)
            ? formValues.subjects.map(Number)
            : formValues.subjects,
        })

        const action = type === 'create' ? createTeacher : updateTeacher
        const result = await action({ success: false, error: false }, parsed)

        if (result.success) {
          toast(
            `Teacher has been ${type === 'create' ? 'created' : 'updated'}!`,
          )
          setOpen(false)
        } else {
          if (Array.isArray(result.error)) {
            result.error.forEach((err: { message: string }) => {
              toast.error(err.message)
            })
          } else if (result.error === true) {
            toast.error('Something went wrong!')
          } else {
            toast.error('An unknown error occurred. Please try again.')
          }
        }
      } catch (error) {
        toast.error('Failed to save teacher')
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
        {type === 'create' ? 'Create a new teacher' : 'Update the teacher'}
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
        {teacherData?.id && (
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
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full "
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
          <label className="text-xs text-gray-500">Subjects</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register('subjects')}
          >
            {teacherRelativeData.subjects.map((subject) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subjects?.message && (
            <p className="text-xs text-red-400">
              {errors.subjects.message.toString()}
            </p>
          )}
        </div>
        <UploadPhotoButton img={img} setImg={setImg}></UploadPhotoButton>
      </div>
      <FormButton isPending={isPending} type={type} />
    </form>
  )
}
