<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(135deg,  #EA5C54  0%,#bb6dec 100%);"
  >
    <div class="column">
      <div class="row">
        <q-card square dark class="q-pa-md q-ma-none no-shadow bg-grey-10" style="width:320px;">
          <q-card-section class="q-mt-md q-mb-md">
            <h5 class="q-mt-none q-mb-none">Create admin account</h5>
          </q-card-section>

          <q-card-section>
            <q-form id="register-form" class="q-gutter-md" @submit.prevent="submitHandler" >
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

              <q-input dark dense square filled clearable v-model="name" label="Name">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

            </q-form>
          </q-card-section>

          <q-card-actions>
            <div class="row full-width items-center">
              <div class="col-6">
                <q-btn type="submit" form="register-form" outline rounded size="md" color="purple-4" class="full-width text-white" label="Create" />
              </div>
            </div>
          </q-card-actions>
          <q-card-section>
            <p class="text-caption text-weight-light text-grey">
              Already have an account ?
              <router-link to="/login" replace class="text-secondary" style="text-decoration: none;">
                Log in
              </router-link>
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { useAuthStore } from '../stores/authStore'
  import { ref } from 'vue';

  import { app } from '../../firebaseConfig'
  import { getFirestore, doc, setDoc } from "firebase/firestore";
  import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
  import { useRouter } from 'vue-router';

  const authStore = useAuthStore()
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const name = ref('')

  const submitHandler = async () => {
  const auth = getAuth(app)
  const db = getFirestore(app)

  createUserWithEmailAndPassword(auth, email.value, password.value, name.value)
    .then((cred) => {
      return setDoc(doc(db, "users", cred.user.uid), {
        name: name.value,
        email: email.value,
      })
    })
    .then(() => {
      //create a record in store
      authStore.userInfo = {
        name: name.value,
        email: email.value,
        uid: auth.currentUser.uid,
      }
      //set user insatnce data
      return updateProfile(auth.currentUser, {
        displayName: name.value,
        email: email.value,
        uid: auth.currentUser.uid,
      })
    })
    .then(() => {
      router.push({ path: '/' })
    })
    .catch(function(error) {
      console.log(error);
    });
  }

</script>

<style>
.q-card {
  width: 360px;
}
</style>
