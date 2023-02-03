<template>

  <svg class="d6-svg" width="97" viewBox="0 0 97 113" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.37886" y="78" width="88.1872" height="27.2944" rx="1" transform="rotate(5 2.37886 78)" fill="#413C3C"/>
    <rect x="9" width="88.1872" height="78.6131" rx="1" transform="rotate(5 9 0)" fill="#D9D9D9"/>

    <text x="50%" y="45%" font-family="&quot;ecHAFOI0VZD1:::Roboto&quot;" dominant-baseline="middle"
          text-anchor="middle" font-size="48"
          font-weight="400" stroke-width="0" fill="#000000">
      {{ props.number }}
    </text>
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  number: number,
}>();
</script>

<style scoped>
.d6-svg {
  width: 2rem;
  text-align: center;
}

.d6-svg text {
  width: 2rem;

}
</style>