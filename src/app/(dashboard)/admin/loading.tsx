import AnnouncementsSkeleton from '@/components/skeletons/AnnouncementsSkeleton'
import ChartSkeleton from '@/components/skeletons/ChartSkeleton'
import EventCalendarSkeleton from '@/components/skeletons/EventCalendarSkeleton'
import UserCardSkeleton from '@/components/skeletons/UserCardSkeleton'
import React from 'react'

const Loading = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCardSkeleton />
          <UserCardSkeleton />
          <UserCardSkeleton />
          <UserCardSkeleton />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3">
            <ChartSkeleton height="h-[450px]" />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3">
            <ChartSkeleton height="h-[450px]" />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full">
          <ChartSkeleton height="h-[500px]" />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarSkeleton />
        <AnnouncementsSkeleton />
      </div>
    </div>
  )
}

export default Loading
