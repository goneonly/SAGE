// PLAN.md §7 users.level enum
export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface User {
  id: string
  email: string
  level: Level
}
