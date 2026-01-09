export default function UserCardSkeleton() {
  return (
    <div className="rounded-2xl bg-gray-200 p-4 flex-1 min-w-[130px] animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 w-16 bg-gray-300 rounded-full" />
        <div className="h-5 w-5 bg-gray-300 rounded" />
      </div>
      <div className="h-8 w-16 bg-gray-300 rounded my-4" />
      <div className="h-4 w-20 bg-gray-300 rounded" />
    </div>
  )
}
