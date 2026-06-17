import { notesRepository } from './repository'
import type { Note, CreateNoteInput, UpdateNoteInput } from './types'

export const notesService = {
  async list() {
    return notesRepository.list()
  },

  async getById(id: string) {
    return notesRepository.getById(id)
  },

  async create(input: CreateNoteInput) {
    return notesRepository.create(input)
  },

  async update(id: string, input: UpdateNoteInput) {
    return notesRepository.update(id, input)
  },

  async remove(id: string) {
    return notesRepository.remove(id)
  },

  async openNote(id: string) {
    await notesRepository.markAsOpened(id)
    return notesRepository.getById(id)
  },
}
