import { defineStore } from 'pinia'
import { auth } from '../../firebaseConfig'

export const useTestStore = defineStore('TestStore', {
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

    getUserId() {
      const user = firebase.auth().currentUser;
      return user ? user.uid : null;
    },

    async login(loginObj) {
      try {
        await auth().signInWithEmailAndPassword(loginObj.email, loginObj.password);
        console.log('true');

        return true;
      } catch (err) {
        commit('setError', err);
        throw err;
      }
    },


    async register(registerObj) {
      try {
        // console.log('[TestStore]', registerObj.email, registerObj.password)

        const res = await auth.createUserWithEmailAndPassword(registerObj.email, registerObj.password)
      } catch (err) {
        console.log(err)
      }

    }
  }
})
