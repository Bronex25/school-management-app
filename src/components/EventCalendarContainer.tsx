import React from 'react'
import EventList from './EventList'
import EventCalendar from './EventCalendar'
import Image from 'next/image'
import Link from 'next/link'

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams:
    | Promise<{ [keys: string]: string | undefined }>
    | { [keys: string]: string | undefined }
}) => {
  const params =
    searchParams instanceof Promise ? await searchParams : searchParams
  const { date } = params
  return (
    <div className="bg-white p-4 rounded-md">
      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Link href={'/list/events'}>
          <Image src="/moreDark.png" alt="" width={20} height={20} />
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        <EventList dateParam={date} />
      </div>
    </div>
  )
}

export default EventCalendarContainer
