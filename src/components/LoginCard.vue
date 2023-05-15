<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(135deg,  #EA5C54  0%,#bb6dec 100%);"
  >
    <div class="column">
      <div class="row">
        <q-card square dark class="q-pa-md q-ma-none no-shadow bg-grey-10" style="width:320px;">
          <q-card-section class="q-mt-md q-mb-md">
            <h5 class="q-mt-none q-mb-none">Log into admin</h5>
          </q-card-section>

          <q-card-section>
            <q-form id="login-form" class="q-gutter-md" @submit.prevent="submitHandler">
              <q-input dark dense square filled clearable v-model="email" type="email" label="Email">
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input dark dense square filled clearable v-model="password" type="password" label="Password">
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions>
            <div class="row full-width items-center">
              <div class="col-6">
                <q-btn type="submit" form="login-form" outline rounded size="md" color="purple-4" class="full-width text-white" label="Sign In" />
              </div>
            </div>
          </q-card-actions>
          <q-card-section>
            <p class="text-caption text-weight-light text-grey">
              Not reigistered?
              <router-link to="/register" class="text-secondary" style="text-decoration: none;">Create an Account</router-link>
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore} from '../stores/authStore'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { app } from '../../firebaseConfig'
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence} from "firebase/auth";

const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const router = useRouter()

const submitHandler = async () => {
  const auth = getAuth(app);


  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      return signInWithEmailAndPassword(auth, email.value, password.value)
    })
    .then((cred) => {
      authStore.userInfo = {
        name: cred.user.displayName,
        email: cred.user.email,
        uid: cred.user.uid,
      }
    })
    .then(() => {
      router.push({ path: '/' })
    })
    .catch((error) => {
      console.warn({error});
    });
}
</script>

<style>
.q-card {
  width: 360px;
}

.q-card__actions {
  padding: 16px;
}
</style>
