<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-black">
      <q-toolbar>
        <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        <q-toolbar-title>{{ headerTitle }}</q-toolbar-title>
        <!-- <div>{{ headerDate }}</div> -->
        <q-btn-dropdown
          outline
          rounded
          label="Account"
          color="purple-4"
        >
          <div class="row no-wrap q-pa-md">
            <!-- <div class="column">
              <div class="text-h6 q-mb-md">Settings</div>
              <q-toggle v-model="mobileData" label="Use Mobile Data" />
              <q-toggle v-model="bluetooth" label="Bluetooth" />
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            -->

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>

              <div class="items-right">
                <div class="text-subtitle1 q-mt-md q-mb-xs">{{ userName }}</div>
                <div class="text-subtitle1 q-mb-md">{{ userEmail }}</div>
              </div>

              <q-btn
                color="primary"
                label="Logout"
                push
                size="sm"
                v-close-popup
                @click="handleSighOut"
              />
            </div>

          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="200"
      :breakpoint="500"
      overlay
      bordered
      class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list>

          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable v-ripple :to="menuItem.route">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" />
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { date } from 'quasar'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from "vue-router"
import { app } from '../../firebaseConfig'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useAuthStore } from '../stores/authStore'

const menuList = [
  {
    icon: 'grid_view',
    label: 'Categories',
    separator: false,
    route: '/'
  },
  {
    icon: 'grid_on',
    label: 'Subcategories',
    separator: false,
    route: '/subcategories'
  },
  {
    icon: 'inventory',
    label: 'Product',
    separator: false,
    route: '/products'
  },
]

export default {
  setup () {
    const leftDrawerOpen = ref(false)
    const route = useRoute()
    const router = useRouter()
    const auth = getAuth(app)
    const userName = ref('no user')
    const userEmail = ref('no user')
    const authStore = useAuthStore()

    const pathObj = {
      '/products': 'Products',
      '/subcategories': 'Subcategories',
      '/': 'Categories'
    }

    const headerDate = computed(() => {
      let timeStamp = Date.now()
      return date.formatDate(timeStamp, 'dddd D MMMM')
    })

    const headerTitle = computed(() => pathObj[route.path])

    const handleSighOut = () => {
      signOut(auth).then(() => {
        //clear info
        authStore.userInfo = {}
        router.push({ path: '/login' })
      }).catch((error) => {
        throw error;
      });
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        userName.value = user.displayName
        userEmail.value = user.email
      } else {
        //
      }
    });

    return {
      headerDate,
      headerTitle,
      leftDrawerOpen,
      onAuthStateChanged,
      userName,
      userEmail,
      handleSighOut,
      authStore,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      // drawer: ref(true),
      menuList
    }

  }
}
</script>
