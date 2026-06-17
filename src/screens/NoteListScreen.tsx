import { useState, useEffect, useCallback } from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import { Text, FAB, Card, Button, Dialog, Portal, TextInput } from 'react-native-paper'
import { notesService } from '../features/notes/service'
import type { Note, CreateNoteInput, UpdateNoteInput } from '../features/notes/types'

export default function NoteListScreen() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true)
      const data = await notesService.list()
      setNotes(data)
    } catch (err) {
      console.error('Failed to load notes', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  function openCreateDialog() {
    setEditingNote(null)
    setTitle('')
    setContent('')
    setDialogOpen(true)
  }

  function openEditDialog(note: Note) {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setDialogOpen(true)
  }

  async function handleSave() {
    try {
      if (editingNote) {
        const updated = await notesService.update(editingNote.id, { title, content })
        if (updated) {
          setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
        }
      } else {
        const created = await notesService.create({ title, content })
        setNotes(prev => [created, ...prev])
      }
      setDialogOpen(false)
    } catch (err) {
      console.error('Failed to save note', err)
    }
  }

  async function handleDelete(id: string) {
    try {
      await notesService.remove(id)
      setNotes(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Failed to delete note', err)
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={loadNotes}
        contentContainerStyle={notes.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={
          <Text variant="bodyLarge" style={styles.emptyText}>
            Nenhuma nota ainda.{'\n'}Toque em + para criar.
          </Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => openEditDialog(item)}>
            <Card.Content>
              <Text variant="titleMedium">{item.title || 'Sem título'}</Text>
              <Text variant="bodyMedium" numberOfLines={2} style={styles.snippet}>
                {item.content}
              </Text>
              <Text variant="labelSmall" style={styles.date}>
                {formatDate(item.updated_at)}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => handleDelete(item.id)} textColor="#e53935">
                Excluir
              </Button>
            </Card.Actions>
          </Card>
        )}
      />

      <FAB icon="plus" style={styles.fab} onPress={openCreateDialog} />

      <Portal>
        <Dialog visible={dialogOpen} onDismiss={() => setDialogOpen(false)}>
          <Dialog.Title>{editingNote ? 'Editar nota' : 'Nova nota'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Título"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Conteúdo"
              value={content}
              onChangeText={setContent}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onPress={handleSave}>Salvar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.5,
  },
  card: {
    marginBottom: 12,
  },
  snippet: {
    marginTop: 4,
    opacity: 0.7,
  },
  date: {
    marginTop: 8,
    opacity: 0.5,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  input: {
    marginBottom: 12,
  },
})
