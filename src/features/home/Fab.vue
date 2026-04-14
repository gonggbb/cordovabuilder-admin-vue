<template>
  <div class="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
    <!-- 链接 -->
    <div class="fab fab-flower">
      <!-- a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility -->
      <div tabindex="0" role="button" class="btn btn-lg btn-circle btn-success">F</div>

      <!-- Main Action button replaces the original button when FAB is open -->
      <button class="fab-main-action btn btn-circle btn-lg">M</button>

      <!-- buttons that show up when FAB is open -->
      <button
        class="btn btn-lg btn-circle"
        @click="() => win.open('https://nodejs.org/en/download', '_blank')"
      >
        nodejs
      </button>
      <!-- Temurin https://github.com/adoptium/temurin17-binaries/releases -->
      <button
        class="btn btn-lg btn-circle"
        @click="() => win.open('https://adoptium.net/temurin/release-notes', '_blank')"
      >
        Temurin Release Notes
      </button>

      <button
        class="btn btn-lg btn-circle"
        @click="() => win.open('https://developer.android.com/studio/archive', '_blank')"
      >
        Android Studio Archive
      </button>
      <button
        class="btn btn-lg btn-circle"
        @click="() => win.open('https://gradle.org/releases/', '_blank')"
      >
        Gradle Releases
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 将 window 对象暴露给模板使用
const win = window
</script>

<style scoped></style>
