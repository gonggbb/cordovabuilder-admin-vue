<template>
  <!-- 链接 -->
  <div class="fab fab-flower">
    <!-- a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility -->
    <div tabindex="0" role="button" class="btn btn-lg btn-circle btn-success">F</div>

    <!-- Main Action button replaces the original button when FAB is open -->
    <button class="fab-main-action btn btn-circle btn-lg">M</button>

    <!-- buttons that show up when FAB is open -->
    <button
      class="btn btn-lg btn-circle"
      @click="() => window.open('https://nodejs.org/en/download', '_blank')"
    >
      nodejs
    </button>
    <!-- Temurin https://github.com/adoptium/temurin17-binaries/releases -->
    <button
      class="btn btn-lg btn-circle"
      @click="() => window.open('https://adoptium.net/temurin/release-notes', '_blank')"
    >
      Temurin Release Notes
    </button>

    <button
      class="btn btn-lg btn-circle"
      @click="() => window.open('https://developer.android.com/studio/archive', '_blank')"
    >
      Android Studio Archive
    </button>
    <button
      class="btn btn-lg btn-circle"
      @click="() => window.open('https://gradle.org/releases/', '_blank')"
    >
      Gradle Releases
    </button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
