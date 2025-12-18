import z from 'zod'

export const announcementSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: 'Exam title is required' }),
  description: z.string().min(12, { message: 'Description is required' }),
  date: z.coerce.date({ message: 'Date is required' }),
  classId: z.number().optional(),
})

export type AnnouncementFormValues = z.input<typeof announcementSchema>
export type AnnouncementSchema = z.output<typeof announcementSchema>
