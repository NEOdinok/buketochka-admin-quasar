import { defineStore } from 'pinia'
import { auth } from '../../firebaseConfig'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const useTestStore = defineStore('TestStore', {
  state: () => ({
    counter: 0,

    user: null,
    authIsReady: false,
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2
    }
  },

  actions: {
    increment() {
      this.counter++
    },

    getUserId() {
      const user = firebase.auth().currentUser;
      return user ? user.uid : null;
    },

    async login(loginObj) {
      try {

        return true;
      } catch (error) {
        console.warn({error});
        throw err;
      }
    },


    async register({email, password }) {
      try {
        // console.log('[TestStore]', registerObj.email, registerObj.password)
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.warn({ userCredential });
      } catch (error) {
        console.error({error})
      }

    }
  }
})
