type CalendarSkeletonProps = {
  height?: string
}

export default function CalendarSkeleton({
  height = 'h-[500px]',
}: CalendarSkeletonProps) {
  return (
    <div className={`w-full ${height} bg-white rounded-md p-4 animate-pulse`}>
      <div className="h-6 w-32 bg-gray-300 rounded mb-4" />
      <div className="h-full w-full bg-gray-200 rounded" />
    </div>
  )
}
