<template>
  <q-drawer
      dark
      :show-if-above="false"
      :model-value="isOpen"
      behavior="default"
      side="left"
      :width="200"
      :breakpoint="500"
  >
    <!-- drawer content -->
    <q-list>
      <q-item>
        <q-item-section>Navigation</q-item-section>
      </q-item>
      <q-separator dark/>

      <q-item class="" v-for="route in routes" :to="route.destination" clickable v-ripple>
        <q-item-section avatar>
          <q-icon :name="route.icon"/>
        </q-item-section>
        <q-item-section>{{ route.name }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">

const props = defineProps<{
  isOpen: boolean,
}>();


interface Route {
  name: string,
  destination: string,
  icon: string,
}

const routes: Route[] = [
  {
    name: 'Initiative',
    destination: '/',
    icon: 'security',
  },
  {
    name: 'Probabilities',
    destination: '/probability',
    icon: 'leaderboard',
  }
];
</script>

<style scoped>

</style>