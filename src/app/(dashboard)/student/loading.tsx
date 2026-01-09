import AnnouncementsSkeleton from '@/components/skeletons/AnnouncementsSkeleton'
import CalendarSkeleton from '@/components/skeletons/CalendarSkeleton'
import EventCalendarSkeleton from '@/components/skeletons/EventCalendarSkeleton'
import React from 'react'

const Loading = () => {
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <CalendarSkeleton height="h-[600px]" />
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendarSkeleton />
        <AnnouncementsSkeleton />
      </div>
    </div>
  )
}

export default Loading
