export default function AnnouncementsSkeleton() {
  return (
    <div className="bg-white p-4 rounded-md animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-32 bg-gray-300 rounded" />
        <div className="h-4 w-16 bg-gray-300 rounded" />
      </div>
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`rounded-md p-4 ${
              i === 0 ? 'bg-gray-100' : i === 1 ? 'bg-gray-100' : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-5 w-3/4 bg-gray-300 rounded" />
              <div className="h-4 w-20 bg-gray-300 rounded" />
            </div>
            <div className="h-4 w-full bg-gray-300 rounded" />
            <div className="h-4 w-2/3 bg-gray-300 rounded mt-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
