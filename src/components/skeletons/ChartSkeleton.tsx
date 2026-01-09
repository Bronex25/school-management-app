type ChartSkeletonProps = {
  height?: string
}

export default function ChartSkeleton({
  height = 'h-[450px]',
}: ChartSkeletonProps) {
  return (
    <div className={`w-full ${height} bg-white rounded-md p-4 animate-pulse`}>
      <div className="h-6 w-32 bg-gray-300 rounded mb-4" />
      <div className="h-full w-full bg-gray-200 rounded" />
    </div>
  )
}
