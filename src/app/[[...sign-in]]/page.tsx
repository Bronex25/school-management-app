'use client'
import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()

  useEffect(() => {
    const role = user?.publicMetadata.role

    if (role) {
      router.push(`/${role}`)
    }
  }, [user, router])

  return (
    <div className="flex justify-center  items-center h-screen bg-skyLight">
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="flex flex-col bg-white gap-2 p-12 rounded-md"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            School Again
          </h1>
          <h2 className="text-gray-400">Sign in to your account</h2>

          <Clerk.GlobalError className="text-red-500 text-sm" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className="text-gray-500 text-xs">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="ring-1 ring-gray-300 p-2 rounded-md"
            />
            <Clerk.FieldError className="text-red-500 text-xs" />
          </Clerk.Field>
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className="text-gray-500 text-xs">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="ring-1 ring-gray-300 p-2 rounded-md"
            />
            <Clerk.FieldError className="text-red-500 text-xs" />
          </Clerk.Field>
          <SignIn.Action
            submit
            className="bg-blue-500 text-white p-[10px] rounded-md my-1 text-sm"
          >
            Sign in
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  )
}

export default LoginPage
