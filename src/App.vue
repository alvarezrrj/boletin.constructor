<script setup lang="ts">
import NewsLetter from '@/views/NewsLetter.vue'
import LoginComponent from '@/views/LoginComponent.vue'
import { computed, onBeforeUnmount, provide, ref, type Component } from 'vue'
import { protectedView } from '@/utils/protected'
import NotFound from '@/views/NotFound.vue'
import Layout from '@/views/LayoutComponent.vue'
import TopNav from '@/components/TopNav.vue'
import { emailRefKey } from '@/keys/html'
import { firepadResetKey } from '@/keys/firepad'

const routes = computed<{ [key: string]: Component }>(() => ({
  '/': protectedView(NewsLetter),
  '/login': LoginComponent
}))

const currentPath = ref(window.location.hash)
const currentView = computed(
  () => routes.value[currentPath.value.slice(1) || '/'] || NotFound
)
const emailRef = ref<HTMLDivElement | null>(null)
const firepadReset = ref(() => {})
const setFirepadReset = (cb: () => void) => {
  firepadReset.value = cb
}

function hashChangeHandler() {
  if (window.location.hash[1] !== '/') return
  currentPath.value = window.location.hash
}

window.addEventListener('hashchange', hashChangeHandler)
provide(emailRefKey, emailRef)
provide(firepadResetKey, { firepadReset, setFirepadReset })
onBeforeUnmount(() => {
  window.removeEventListener('hashchange', hashChangeHandler)
})
</script>

<template>
  <Layout>
    <template #header>
      <TopNav />
    </template>
    <template #main>
      <component :is="currentView" />
    </template>
  </Layout>
</template>

<style scoped></style>
