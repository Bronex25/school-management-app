'use client'

export default function BigFormSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="h-6 w-48 bg-gray-300 rounded" />

      <span className="h-4 w-32 bg-gray-300 rounded" />

      <div className="flex justify-between flex-wrap gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2 w-full md:w-[30%]">
            <div className="h-3 w-20 bg-gray-300 rounded" />
            <div className="h-10 w-full bg-gray-300 rounded-md" />
          </div>
        ))}
      </div>

      <span className="h-4 w-32 bg-gray-300 rounded" />

      <div className="flex justify-between flex-wrap gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2 w-full md:w-[30%]">
            <div className="h-3 w-20 bg-gray-300 rounded" />
            <div className="h-10 w-full bg-gray-300 rounded-md" />
          </div>
        ))}

        <div className="flex items-center gap-2 cursor-not-allowed opacity-50">
          <div className="h-7 w-7 bg-gray-300 rounded" />
          <div className="h-4 w-24 bg-gray-300 rounded" />
        </div>
      </div>

      <div className="h-4 w-40 bg-gray-300 rounded" />

      <div className="h-10 w-28 bg-blue-300 rounded-md" />
    </div>
  )
}
