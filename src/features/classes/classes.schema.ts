import z from 'zod'

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: 'Class name is required' }),
  capacity: z.coerce.number().min(1, { message: 'Capacity is required' }),
  gradeId: z.coerce.number().min(1, { message: 'Grade is required' }),
  supervisorId: z.string().optional(),
})

export type ClassFormValues = z.input<typeof classSchema>
export type ClassSchema = z.output<typeof classSchema>
