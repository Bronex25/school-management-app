import AnnouncementsSkeleton from '@/components/skeletons/AnnouncementsSkeleton'
import CalendarSkeleton from '@/components/skeletons/CalendarSkeleton'
import React from 'react'

const Loading = () => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row flex-1">
      {/* LEFT - Could be multiple students, showing skeletons */}
      <div className="w-full xl:w-2/3 flex flex-col gap-4">
        <CalendarSkeleton height="h-[600px]" />
        <CalendarSkeleton height="h-[600px]" />
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <AnnouncementsSkeleton />
      </div>
    </div>
  )
}

export default Loading
