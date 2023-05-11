import { defineStore } from 'pinia'
import { app } from '../../firebaseConfig'
import { getAuth } from "firebase/auth";


export const useCatStore = defineStore('catStore', {
  state: () => ({
    counter: 0,

    catNamesSelect: [],
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
  }
})
