export function SmallFormSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      <div className="h-6 w-1/3 rounded-md bg-gray-200" />

      <div className="flex justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-9 w-full bg-gray-200 rounded-md" />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-9 w-full bg-gray-200 rounded-md" />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-9 w-full bg-gray-200 rounded-md" />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-9 w-full bg-gray-200 rounded-md" />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-9 w-full bg-gray-200 rounded-md" />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="h-9 w-full bg-gray-200 rounded-md" />
        </div>
      </div>

      <div className="h-9 w-full bg-gray-200 rounded-md" />
    </div>
  )
}
