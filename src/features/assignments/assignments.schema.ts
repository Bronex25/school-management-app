import z from 'zod'

export const assignmentSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: 'Assignment title is required' }),
  startDate: z.coerce.date({ message: 'Start date is required' }),
  dueDate: z.coerce.date({ message: 'Due date is required' }),
  lessonId: z.coerce.number({ message: 'Lesson is required' }),
})

export type AssignmentFormValues = z.input<typeof assignmentSchema>
export type AssignmentSchema = z.output<typeof assignmentSchema>
