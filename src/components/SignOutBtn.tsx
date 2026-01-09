'use client'

import { useClerk } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function SignOutBtn() {
  const clerk = useClerk()

  return (
    <button
      className="flex items-center justify-center bo cursor-pointer w-full lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-skyLight"
      onClick={() => clerk.signOut()}
    >
      <Image src="/logout.png" alt="logout icon" width={20} height={20} />
      <span className="hidden lg:block">Sign Out</span>
    </button>
  )
}

export default SignOutBtn
