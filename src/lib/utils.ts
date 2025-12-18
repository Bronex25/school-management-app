const getLatestMonday = (): Date => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const latestMonday = today
  latestMonday.setDate(today.getDate() - daysSinceMonday)
  return latestMonday
}

export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[],
): { title: string; start: Date; end: Date }[] => {
  const latestMonday = getLatestMonday()

  return lessons.map((lesson) => {
    const lessonDayOfWeek = lesson.start.getDay()

    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1

    const adjustedStartDate = new Date(latestMonday)

    adjustedStartDate.setDate(latestMonday.getDate() + daysFromMonday)
    adjustedStartDate.setHours(
      lesson.start.getHours(),
      lesson.start.getMinutes(),
      lesson.start.getSeconds(),
    )
    const adjustedEndDate = new Date(adjustedStartDate)
    adjustedEndDate.setHours(
      lesson.end.getHours(),
      lesson.end.getMinutes(),
      lesson.end.getSeconds(),
    )

    return {
      title: lesson.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    }
  })
}

export const dateToString = (date: Date, withTime: boolean = false) => {
  const dateObj = new Date(date)

  if (withTime) {
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    const hours = String(dateObj.getHours()).padStart(2, '0')
    const minutes = String(dateObj.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } else {
    return dateObj.toISOString().split('T')[0]
  }
}
