<template>
  <div>
    <div class="inputs">
      <q-input dark type="number" min="1" v-model="armorClass" label="Armor Class"></q-input>
      <q-input dark label="To hit bonus" type="number" min="0" max="20" v-model="toHitBonus"/>
      <q-input dark label="Hit Points (HP)" type="number" min="1" v-model="hitPoints"/>
      <q-input dark label="Damage" type="number" min="1" v-model="damage"/>
      <q-checkbox dark label="Natural 1s and 20s" class="grid-span-2" v-model="naturalRollsIgnoreAC"/>
    </div>

    <div id="hits">
      <div>
        Probability for hitting the target is: {{ calculateHitProbability(hits) }}%
      </div>

      <div>Possible rolls to hit: {{ hits.join(", ") }}</div>

      <div>On average it will take <span class="highlight">{{
          amountOfAttacksRequired(parseInt(hitPoints), parseInt(damage), hits)
        }} hit(s)</span> to defeat your opponent.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";

const armorClass = ref("10");
const toHitBonus = ref("0");
const hitPoints = ref("20");
const damage = ref("1");
const naturalRollsIgnoreAC = ref(true);

let hits = computed(() => calculateHits(parseInt(armorClass.value), parseInt(toHitBonus.value), naturalRollsIgnoreAC.value));

function calculateHitProbability(hits: Array<number>): number {
  return 100 / 20 * hits.length;
}

function calculateHits(armorClass: number, toHitBonus = 0, naturalRollsIgnoreAC = true): Array<number> {
  console.log(naturalRollsIgnoreAC);
  const diceRolls: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  return diceRolls.filter(roll => {
    if (naturalRollsIgnoreAC && roll == 20) {
      return true;
    }

    if (naturalRollsIgnoreAC && roll == 1) {
      console.log(roll);
      return false;
    }

    return roll + toHitBonus >= armorClass;
  });
}

function amountOfAttacksRequired(hitPoints: number, damage: number, hits: Array<number>): number {
  const probability = calculateHitProbability(hits) / 100;
  const attacksRequired = Math.ceil(hitPoints / damage * (1 / probability));
  return Math.max(attacksRequired, 1);
}
</script>

<style scoped>
.inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
}

.inputs > div {
  display: flex;
  gap: 0.5rem;
}

#hits {
  text-align: center;
}

.highlight {
  color: rgb(255, 50, 50);
}

.grid-span-2 {
  grid-column: span 2;
}

.box {
  width: 200px;
  height: 200px;
  background-color: wheat;
}
</style>