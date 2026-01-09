export default function EventCalendarSkeleton() {
  return (
    <div className="bg-white p-4 rounded-md animate-pulse">
      {/* Calendar skeleton */}
      <div className="h-[300px] w-full bg-gray-200 rounded mb-4" />

      {/* Events header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-24 bg-gray-300 rounded" />
        <div className="h-5 w-5 bg-gray-300 rounded" />
      </div>

      {/* Event items */}
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-md p-4">
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
            <div className="h-3 w-1/2 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
