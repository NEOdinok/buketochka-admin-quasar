import { defineStore } from 'pinia'
import { app } from '../../firebaseConfig'
import { getAuth, onAuthStateChanged } from "firebase/auth";


export const useAuthStore = defineStore('authStore', {
  state: () => ({
    counter: 0,

    isLoggedIn: false,
    userInfo: {},
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

      const user = auth.currentUser
      return user ? user.uid : null

      // works
      // onAuthStateChanged(auth, (user) => {
      //   console.log('[authStore] authStateChanged', user.uid)

      //   if (user) {
      //     return user.uid
      //   } else {
      //     return null
      //   }

      // })
    }
  }
})
