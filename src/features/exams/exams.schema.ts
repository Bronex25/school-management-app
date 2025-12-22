import z from 'zod'

export const examSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: 'Exam title is required' }),
  startTime: z.coerce.date({ message: 'Start time is required' }),
  endTime: z.coerce.date({ message: 'End time is required' }),
  subjectId: z.number({ message: 'Subject is required' }),
  classId: z.number({ message: 'Class is required' }),
})

export type ExamFormValues = z.input<typeof examSchema>
export type ExamSchema = z.output<typeof examSchema>
