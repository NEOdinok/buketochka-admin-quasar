<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="bg-black">
      <q-toolbar>
        <q-btn flat @click="toggleLeftDrawer" round dense icon="menu" />
        <q-toolbar-title>{{ headerTitle }}</q-toolbar-title>
        <div>{{ headerDate }}</div>
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
import { computed, ref, watch } from 'vue'
import { useRoute } from "vue-router"

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

    return {
      headerDate,
      headerTitle,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      // drawer: ref(true),
      menuList
    }
  }
}
</script>
