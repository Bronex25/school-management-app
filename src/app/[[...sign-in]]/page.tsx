'use client'
import FormModal from '@/components/FormModal'
import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Atom } from 'react-loading-indicators'

type Roles = 'teacher' | 'student' | 'parent'

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [role, setRole] = useState<Roles>('student')
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn && user) {
      const userRole = user.publicMetadata.role as Roles | undefined

      if (userRole) {
        setIsRedirecting(true)
        router.push(`/${userRole}`)
      }
    }
  }, [isLoaded, isSignedIn, user, router])

  if (!isLoaded || isRedirecting)
    return (
      <div className="h-screen flex justify-center items-center">
        <Atom />
      </div>
    )

  return (
    <div className="flex justify-center items-center h-screen bg-skyLight">
      <div className="flex flex-col bg-white gap-4 p-12 rounded-md w-full max-w-md">
        <div className="flex items-center justify-center gap-2">
          <Image src="/logo12.png" alt="logo" width={32} height={32} />
          <h1 className="text-xl font-bold bg-gradient-to-br from-sky-800 to-emerald-500 bg-clip-text text-transparent">
            Scholario
          </h1>
        </div>

        <div className="flex gap-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              !isSignUp
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              isSignUp
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {!isSignUp ? (
          <SignIn.Root>
            <SignIn.Step name="start" className="flex flex-col gap-4">
              <h2 className="text-gray-400 text-center">
                Sign in to your account
              </h2>

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
                className="bg-blue-500 text-white p-[10px] rounded-md my-1 text-sm hover:bg-blue-600 transition-colors"
              >
                Sign in
              </SignIn.Action>
            </SignIn.Step>
          </SignIn.Root>
        ) : (
          <div className="flex flex-col gap-6">
            <label className="text-xs text-gray-500">Choose your role</label>

            <div className="flex gap-4 flex-col">
              {(['student', 'teacher', 'parent'] as const).map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 cursor-pointer text-sm"
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                    className="accent-blue-500"
                  />
                  <span className="capitalize">{r}</span>
                </label>
              ))}
            </div>
            <FormModal table={role} type="create" isSubmit={true} />
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage
