<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
const totalInvoices = ref(0)
onMounted(async() => {
   let response =  await axios.get('http://localhost:3000/count-invoices')
    
   totalInvoices.value = response.data.count
})
</script>

<template>
<div class="p-6 bg-gray-100 min-h-screen">
    <!-- Dashboard Header -->
    <header class="bg-white shadow-md p-4 mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Invoice Dashboard</h1>
      
      <!-- Create New Invoice Button -->
      <div class="bg-white rounded-lg shadow-md flex items-center justify-center">
        <router-link
          to="/invoices/create"
          class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Create New Invoice
        </router-link>
      </div>
    </header>

    <!-- Dashboard Main Content -->
    <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Total Invoices Card -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">Total Invoices</h2>
        <p class="text-3xl font-bold text-blue-600 mt-2">{{ totalInvoices }}</p>
      </div>

      <!-- Pending Invoices Card -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">Pending Invoices</h2>
        <p class="text-3xl font-bold text-yellow-600 mt-2">{{ 2}}</p>
      </div>

      <!-- Overdue Invoices Card -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">Overdue Invoices</h2>
        <p class="text-3xl font-bold text-red-600 mt-2">{{ 1 }}</p>
      </div>

    </main>
  </div>
</template>