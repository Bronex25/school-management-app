import Menu from '@/components/Menu'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DashboardLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="h-screen flex">
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-1"
        >
          <Image src="/logo12.png" alt="logo" width={60} height={64} />
          <span className="hidden lg:inline text-xl font-bold bg-gradient-to-br from-sky-800 to-emerald-500 bg-clip-text text-transparent">
            Scholario
          </span>
        </Link>
        <Menu></Menu>
      </div>
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
