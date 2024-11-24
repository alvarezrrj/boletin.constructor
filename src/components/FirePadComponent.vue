<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { fromMonaco, type IFirepad } from '@hackerrank/firepad'
import { fire } from '../firebase/app'
import * as monaco from 'monaco-editor'
import { navigate } from '@/utils/navigate'
import { firepadResetKey, type FirepadResetProvider } from '@/keys/firepad'

const props = defineProps<{
  onChange: (raw: string) => void
}>()
const monacoWrapperRef = ref()
const userColor = ref('gray')
const userColors = [
  '#817',
  '#ed0',
  '#0bc',
  '#c66',
  '#4d8',
  '#36b',
  '#e94',
  '#2cb',
  '#639'
]
const { setFirepadReset } = inject(firepadResetKey) as FirepadResetProvider
let monacoEditor: monaco.editor.IStandaloneCodeEditor
let firepad: IFirepad

async function setUserColor() {
  const loggedInUsers = await fire.loggedInUsers
  userColor.value = userColors[(loggedInUsers - 1) % userColors.length]
}

/**
 * Initialize monaco and firepad with optional default text
 */
function initializePad(defaultText?: string) {
  monacoEditor = monaco.editor.create(monacoWrapperRef.value, {
    language: 'markdown',
    minimap: { enabled: false },
    wordWrap: 'on',
    smoothScrolling: true,
    automaticLayout: true,
    theme: '#f00'
    // TODO
    // Dark theme
  })

  monacoEditor.onDidChangeModelContent(() =>
    props.onChange(monacoEditor.getValue())
  )
  firepad = fromMonaco(fire.dbRef, monacoEditor, {
    userName: fire.user?.email?.split('@')[0],
    userColor: userColor.value,
    userId: fire.user?.uid,
    defaultText
  })
}

/**
 * Clear history and save current state as firepad's initial state
 */
async function reset() {
  const loggedInUsers = await fire.loggedInUsers
  if (loggedInUsers !== 1) return

  const data = monacoEditor.getValue()

  await fire.clearHistory()

  monacoEditor.dispose()
  firepad.dispose()

  initializePad(data)
}

setFirepadReset(reset)

onMounted(async () => {
  if (!fire.isAuthed) return navigate('/login')

  try {
    await setUserColor()
    initializePad()
  } catch (e) {
    alert('No se pudo cargar el editor de texto. Probá recargando la página.')
    console.error('Error initializing pad', e)
  }
})
onUnmounted(() => {
  firepad.dispose()
  monacoEditor.dispose()
})
</script>

<template>
  <div id="monaco" ref="monacoWrapperRef"></div>
</template>
