import { APP_BASE_URL } from '@/config/sd'

export const initWpCredentials = () => {
  let basicAuth = ''

  return () => {
    if (basicAuth) return basicAuth
    const credentials = new URLSearchParams(window.location.search)
    const username = credentials.get('user_login')
    const password = credentials.get('password')

    if (!username || !password) return

    basicAuth = btoa(`${username}:${password}`)
    const origin = window.location.origin
    history.pushState(null, '', origin + APP_BASE_URL)
    return basicAuth
  }
}
