import z from 'zod'

export const eventSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: 'Event title is required' }),
  description: z.string().min(12, { message: 'Description is required' }),
  startTime: z.coerce.date({ message: 'Start time is required' }),
  endTime: z.coerce.date({ message: 'End time is required' }),
  classId: z.coerce.number().optional(),
})

export type EventFormValues = z.input<typeof eventSchema>
export type EventSchema = z.output<typeof eventSchema>
