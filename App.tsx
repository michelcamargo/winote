import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import NoteListScreen from './src/screens/NoteListScreen'

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NoteListScreen />
      </PaperProvider>
    </SafeAreaProvider>
  )
}
