import { defineStore } from 'pinia'
import { app } from '../../firebaseConfig'
import { getAuth, onAuthStateChanged } from "firebase/auth";


export const useAuthStore = defineStore('authStore', {
  state: () => ({
    counter: 0,

    user: null,
    authIsReady: false,
  }),

  getters: {
    doubleCount (state) {
      return state.counter * 2
    }
  },

  actions: {
    increment () {
      this.counter++
    },

    getCurrentUserId() {
      const auth = getAuth(app)

      onAuthStateChanged(auth, (user) => {
        console.log('[authStore] authStateChanged', user.uid)

        if (user) {
          return user.uid
        } else {
          return null
        }

      })
    }
  }
})
