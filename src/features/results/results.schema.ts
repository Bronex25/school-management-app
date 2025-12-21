import z from 'zod'

export const resultSchema = z.object({
  id: z.coerce.number().optional(),
  score: z.coerce.number().min(0, { message: 'Score is required' }),
  examId: z.coerce.number().optional(),
  assignmentId: z.coerce.number().optional(),
  studentId: z.string().min(1, { message: 'Student is required' }),
})

export type ResultsFormValues = z.input<typeof resultSchema>
export type ResultsSchema = z.output<typeof resultSchema>
