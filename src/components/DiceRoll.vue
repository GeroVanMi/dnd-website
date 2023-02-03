<template>
  <div class="dice-roll-menu">
    <div class="dice-roll-inputs">
      <q-input label="Number of Dice" dark type="number" v-model="numberOfDice"/>
      <q-btn-dropdown :label="'d' + selectedDice">
        <div class="bg-grey-10 text-white">
          <q-list>
            <q-item clickable v-close-popup v-for="die in availableDice" @click="selectedDice = die">
              <q-item-section>
                <q-item-label color="black">d{{ die }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

      </q-btn-dropdown>
      <q-btn @click="rollDice" color="green">Roll Dice</q-btn>
    </div>

    <div>
      <transition>
        <div class="dice-roll-total">Total: {{ resultSum }}</div>
      </transition>

      <div class="dice-results-grid">
        <transition-group
            name="dice-roll-list"
            :css="false"
            @enter="onEnter"
        >
          <div
              v-for="(result, index) of results"
              :key="'dice_roll_' + index + result"
              :data-index="index"
          >
            <d6 :number="result"/>
          </div>
        </transition-group>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, Ref, ref} from "vue";
import D6 from "./dice/d6.vue";
import {gsap} from 'gsap';

const selectedDice = ref(20);
const results: Ref<number[]> = ref([]);
const numberOfDice = ref(1);
const availableDice = [2, 3, 4, 6, 8, 10, 12, 20, 100];

function rollDice(event: Event) {
  results.value = [];

  setTimeout(() => {
    for (let i = 0; i < numberOfDice.value; i++) {
      results.value.push(randomNumber(selectedDice.value));
    }
  }, 50);
}

const resultSum = computed(() => {
  let sum = 0;
  for (let result of results.value) {
    sum += result;
  }
  return sum;
});

function randomNumber(max: number, min = 1) {
  return Math.floor(Math.random() * max) + min;
}

function onEnter(element: any, done: any) {
  gsap.from(element, {
    opacity: 0,
    y: -200,
    delay: element.dataset.index * 0.1,
    onComplete: done,
    duration: 0.75,
    ease: 'out'
  });
}
</script>

<style scoped>

.dice-roll-menu {
  margin-bottom: 3rem;
}

.dice-roll-inputs {
  margin-bottom: 2rem;
}

.dice-results-grid {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.dice-roll-total {
  margin-bottom: 2rem;
}

.dice-roll-list-move,
.dice-roll-list-enter-active {
  transition: all 0.5s ease;
}

.dice-roll-list-enter-active {
  /*transition-delay: 0.5s;*/
}

.dice-roll-list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

@media (min-width: 750px) {
}
</style>