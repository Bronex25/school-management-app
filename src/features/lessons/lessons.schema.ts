import z from 'zod'

export const lessonSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: 'Lesson name is required' }),
  day: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']),
  startTime: z.coerce.date({ message: 'Start time is required' }),
  endTime: z.coerce.date({ message: 'End time is required' }),
  subjectId: z.coerce.number({ message: 'Subject is required' }),
  classId: z.coerce.number({ message: 'Class is required' }),
  teacherId: z.string().min(1, { message: 'Teacher is required' }),
})

export type LessonFormValues = z.input<typeof lessonSchema>
export type LessonSchema = z.output<typeof lessonSchema>
