import { supabase } from '../../lib/supabase'
import type {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  NoteQueryParams,
} from './types'

function buildQuery(params?: NoteQueryParams) {
  let query = supabase.from('notes').select<'*', Note>('*')

  if (params?.sort) {
    query = query.order(params.sort, {
      ascending: params?.order === 'asc',
    })
  } else {
    query = query.order('updated_at', { ascending: false })
  }

  if (params?.limit) {
    query = query.limit(params.limit)
  }

  return query
}

export const notesRepository = {
  async list(params?: NoteQueryParams): Promise<Note[]> {
    const { data, error } = await buildQuery(params)
    if (error) throw error
    return data ?? []
  },

  async getById(id: string): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
      .select<'*', Note>('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data
  },

  async create(input: CreateNoteInput): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .insert(input)
      .select<'*', Note>('*')
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, input: UpdateNoteInput): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
      .update(input)
      .eq('id', id)
      .select<'*', Note>('*')
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) throw error
  },

  async markAsOpened(id: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .update({ last_opened_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  },
}
