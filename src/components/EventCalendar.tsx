'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const EventCalendar = () => {
  const [value, setValue] = useState<Value>(new Date())
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (value instanceof Date) {
      const today = new Date().toLocaleDateString('en-CA')
      const isToday = value.toLocaleDateString('en-CA') === today

      const params = new URLSearchParams(searchParams.toString())

      if (!isToday) {
        const formatted = value.toLocaleDateString('en-CA')
        params.set('date', formatted)
      } else {
        params.delete('date')
      }

      const newQuery = params.toString()
      router.push(newQuery ? `?${newQuery}` : '?')
    }
  }, [value])

  return <Calendar onChange={setValue} value={value} locale="en-US" />
}
export default EventCalendar
