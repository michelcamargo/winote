export interface Note {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  last_opened_at: string | null
}

export type CreateNoteInput = Pick<Note, 'title' | 'content'>

export type UpdateNoteInput = Partial<Pick<Note, 'title' | 'content'>>

export type NoteSortField = 'updated_at' | 'created_at' | 'title'

export interface NoteQueryParams {
  sort?: NoteSortField
  order?: 'asc' | 'desc'
  limit?: number
}
