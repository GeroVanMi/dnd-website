<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerIsOpen = !leftDrawerIsOpen"/>
        <q-toolbar-title>The Combatulator</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
        show-if-above
        dark
        v-model="leftDrawerIsOpen"
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

    <q-page-container>
      <div class="content">
        <div class="side-bar">
          <dice-roll/>
        </div>

        <div class="main-content">
          <router-view/>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import DiceRoll from "./components/DiceRoll.vue";
import {ref} from "vue";

const leftDrawerIsOpen = ref(false);

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
.content {
  display: grid;
  grid-template-columns: 1fr;

  margin: 2rem 2rem 0 2rem;
}

@media (min-width: 700px) {
  .content {
    grid-template-columns: 3fr 1fr;
    gap: 10rem;
  }

  .side-bar {
    order: 1;
  }
}
</style>
