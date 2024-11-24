<script setup lang="ts">
import ImageComponent from '@/components/ImageComponent.vue'
import ImageUploader from '@/components/ImageUploader.vue'
import WordpressLogin from '@/components/WordpressLogin.vue'
import { APP_BASE_URL } from '@/config/sd'
import { viewTransition } from '@/utils/viewTransition'
import { initWpCredentials } from '@/utils/wpCredentials'
import { extractSizes, type Image, type WpResponse } from '@/utils/wpUploader'
import { ref } from 'vue'
</script>

<script lang="ts">
const WP_BASE_URL = 'https://os.ar.dhamma.org'
const LOGIN_URL =
  WP_BASE_URL +
  '/wp-admin/authorize-application.php' +
  '?app_name=Editor de boletines' +
  '&success_url=https://alvarezrrj.github.io' +
  APP_BASE_URL
const images = ref<Image[]>([])
const wpBasicAuth = ref<string>()
const loading = ref(false)
const error = ref('')
const imagesWrapperRef = ref<HTMLDivElement>()
const IMAGES_PER_PAGE = 15

const wpCredentials = initWpCredentials()
wpBasicAuth.value = wpCredentials()

function appendToImages(image: Image) {
  images.value.splice(0, 0, image)
}

async function fetchImages(page = 1, per_page = IMAGES_PER_PAGE) {
  if (loading.value) return
  loading.value = true
  error.value = ''
  const FETCH_URL = WP_BASE_URL + '/wp-json/wp/v2/media'
  try {
    const response = await fetch(
      FETCH_URL + `?page=${page}&per_page=${per_page}`,
      { headers: { Authorization: `Basic ${wpBasicAuth.value}` } }
    )

    if (!response.ok) throw new Error(await response.text())

    const result = await response.json()
    result.forEach((i: WpResponse) => {
      const image = extractSizes(i)
      viewTransition(() => image && images.value.push(image))
    })
  } catch (e) {
    error.value = 'Algo salió mal mientras intentabamos descargar las imágenes.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function scrollListener() {
  const gallery = imagesWrapperRef.value
  if (!gallery) return
  const { scrollTop, scrollHeight, clientHeight } = gallery
  if (scrollTop + clientHeight >= scrollHeight - 50) {
    const page = Math.floor(images.value.length / IMAGES_PER_PAGE) + 1
    fetchImages(page)
  }
}

if (wpBasicAuth.value) fetchImages()
</script>

<template>
  <div class="images_wrapper" ref="imagesWrapperRef" @scroll="scrollListener">
    <a href="#/">
      <p>👈 Volver al boletin</p>
    </a>

    <template v-if="wpBasicAuth">
      <ImageUploader
        :wp-basic-auth="wpBasicAuth"
        :on-upload="appendToImages"
        :base-url="WP_BASE_URL"
      />

      <hr />

      <div class="images">
        <template v-for="image in images" :key="image.thumbnail">
          <ImageComponent :image="image" />
        </template>
        <div class="loader">
          <span v-if="loading" :aria-busy="loading"></span>
          <del v-if="error">{{ error }}</del>
        </div>
      </div>
    </template>

    <template v-else>
      <WordpressLogin :login-url="LOGIN_URL" />
    </template>
  </div>
</template>

<style lang="css" scoped>
.images_wrapper {
  max-height: 100%;
  width: 100%;
  overflow-y: scroll;
  padding-inline: 5px;
}
.images {
  display: grid;
  gap: var(--pico-spacing);
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  width: calc(100vw - 4 * var(--pico-spacing));
}
.loader {
  display: grid;
  place-items: center;
}
</style>
