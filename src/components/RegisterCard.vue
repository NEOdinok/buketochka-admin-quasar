<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(135deg,  #EA5C54  0%,#bb6dec 100%);"
  >
    <div class="column">
      <div class="row">
        <q-card square dark class="q-pa-md q-ma-none no-shadow bg-grey-10" style="width:320px;">
          <q-card-section class="q-mt-md q-mb-md">
            <!-- <p class="text-weight-bolder text-grey">Log Into Admin</p> -->
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

              <!-- <div class="col-6">
                <p class="text-no-wrap text-grey text-caption text-right">Forgot password?</p>
              </div> -->
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
  import { useTestStore } from '../stores/TestStore'
  import { ref } from 'vue';

  const testStore = useTestStore()
  const email = ref('')
  const password = ref('')
  const name = ref('')
  const successRegister = false;

  const submitHandler = async () => {
    const registerObj = {
      email: email.value,
      password: password.value,
      name: name.value
    }

    try {
      successRegister = await testStore.register(registerObj)
      console.log('[RegisterCard], successRegister', successRegister)
    } catch (err) {}
  }

</script>

<style>
.q-card {
  width: 360px;
}
</style>
