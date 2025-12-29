'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import InputField from '@/components/InputField'
import { ParentFormValues, ParentSchema, parentSchema } from './parents.schema'
import { createParent, updateParent } from './parents.actions'
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'
import FormButton from '@/components/FormButton'

type ParentFormProps = {
  type: 'create' | 'update'
  data?: unknown
  setOpen: Dispatch<SetStateAction<boolean>>
  relativeData?: unknown
}

export default function ParentForm({ type, data, setOpen }: ParentFormProps) {
  const parentData = data as Partial<ParentSchema> | undefined

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParentFormValues>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      id: parentData?.id,
      username: parentData?.username ?? '',
      email: parentData?.email ?? '',
      password: '',
      name: parentData?.name ?? '',
      surname: parentData?.surname ?? '',
      phone: parentData?.phone ?? '',
      address: parentData?.address ?? '',
    },
  })

  const [isPending, setIsPending] = useState(false)

  const onSubmit = handleSubmit(
    async (formValues) => {
      setIsPending(true)
      try {
        if (
          type === 'create' &&
          (!formValues.password || formValues.password.trim() === '')
        ) {
          toast.error('Password is required when creating a parent.')
          setIsPending(false)
          return
        }

        const action = type === 'create' ? createParent : updateParent
        const result = await action(
          { success: false, error: false },
          formValues,
        )

        if (result.success) {
          toast(`Parent has been ${type === 'create' ? 'created' : 'updated'}`)
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
        toast.error('Failed to save parent')
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
        {type === 'create' ? 'Create a new parent' : 'Update the parent'}
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
          error={errors?.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          register={register}
          error={errors?.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors?.address}
        />
        {parentData?.id && (
          <InputField
            label="Id"
            name="id"
            register={register}
            error={errors?.id}
            hidden
          />
        )}
      </div>
      <FormButton isPending={isPending} type={type} />
    </form>
  )
}
