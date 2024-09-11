<script setup>
import axios from "axios";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const invoice = ref({});

// Calculate the total amount of the invoice
const invoiceTotal = computed(() =>
  invoice.value.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  )
);

onBeforeMount(async () => {
  let response = await axios.get(
    `http://localhost:3000/invoices/${route.params.id}`
  );

  invoice.value = response.data.invoice;
});

// Function to trigger print
function printInvoice() {
  window.print();
}
</script>

<template>
  <div class="container mx-auto p-6 bg-white shadow-md rounded-lg">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Invoice #{{ invoice.invoiceNumber }}</h1>
      <div class="flex items-center gap-5">
        <router-link
        :to="`/invoices/edit/${invoice.invoiceNumber}`"
        class="bg-gradient-to-l from-pink-400 to-pink-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Edit Invoice
      </router-link>
        <button
        @click="printInvoice"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Print Invoice
      </button>
      </div>
    </div>
    <div class="mb-4">
      <h2 class="text-lg font-semibold">Client Details:</h2>
      <p><strong>Name:</strong> {{ invoice.clientName }}</p>
      <p><strong>Email:</strong> {{ invoice.clientEmail }}</p>
    </div>

    <div class="mb-4">
      <h2 class="text-lg font-semibold">Invoice Details:</h2>
      <p><strong>Date:</strong> {{ invoice.invoiceDate }}</p>
      <p><strong>Due Date:</strong> {{ invoice.dueDate }}</p>
      <p><strong>Status:</strong> {{ invoice.status.toUpperCase() }}</p>
    </div>

    <div class="mb-4">
      <h2 class="text-lg font-semibold">Items:</h2>
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border">Description</th>
            <th class="py-2 px-4 border">Quantity</th>
            <th class="py-2 px-4 border">Price</th>
            <th class="py-2 px-4 border">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoice.items" :key="item.description">
            <td class="py-2 px-4 border">{{ item.description }}</td>
            <td class="py-2 px-4 border text-center">{{ item.quantity }}</td>
            <td class="py-2 px-4 border text-center">{{ item.price }}</td>
            <td class="py-2 px-4 border text-right">
              {{ item.quantity * item.price }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-right mt-4">
      <p v-if="invoice.invoiceNumber" class="text-xl font-bold">
        Total: {{ invoiceTotal }}
      </p>
    </div>
  </div>
</template>
