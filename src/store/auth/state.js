import { LocalStorage } from 'quasar'

export default function () {
  return {
    loggedIn: LocalStorage.getItem('loggedIn') || false,
    user: {}
  }
}
