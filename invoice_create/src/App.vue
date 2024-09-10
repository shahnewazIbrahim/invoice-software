<script setup>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

</script>

<template>
  <div class="min-h-screen flex flex-col w-full">
    <Header />
    <div class="flex flex-1">
      <Sidebar />
      <main class="flex-1 p-6 bg-gray-100 w-full">
        <router-view/>
      </main>
    </div>
  </div>
</template>
