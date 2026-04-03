<template>
  <div class="min-h-screen">
    <nav-header></nav-header>
    <div class="pt-20 pl-5 pr-5">
      <container></container>
    </div>
    <fab></fab>
  </div>
</template>

<script setup lang="ts">
import Fab from './Fab.vue'
import NavHeader from './NavHeader.vue'
import Container from './Container.vue'
</script>

<style lang="scss" scoped></style>
