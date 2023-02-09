<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftDrawerIsOpen = !leftDrawerIsOpen"/>
        <q-toolbar-title>The Combatulator</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <navigation-drawer :is-open="leftDrawerIsOpen"/>

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
import NavigationDrawer from "./components/NavigationDrawer.vue";
import {ref} from "vue";

const leftDrawerIsOpen = ref(false);
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
