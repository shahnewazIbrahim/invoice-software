<script setup>
import { ref } from "vue";

const invoice = ref({
  clientName: "",
  clientEmail: "",
  items: [{ description: "", quantity: 1, price: 0 }],
});

const addItem = () => {
  invoice.value.items.push({ description: "", quantity: 1, price: 0 });
};

const removeItem = (index) => {
  invoice.value.items.splice(index, 1);
};

const submitInvoice = () => {
  // Handle form submission logic
  console.log("Invoice Submitted:", invoice.value);
};
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
    <h2 class="text-2xl font-semibold mb-4">Create New Invoice</h2>

    <!-- Invoice Form -->
    <form @submit.prevent="submitInvoice">
      <!-- Client Details -->
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="client-name"
          >Client Name</label
        >
        <input
          type="text"
          id="client-name"
          v-model="invoice.clientName"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter client's name"
        />
      </div>

      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="client-email"
          >Client Email</label
        >
        <input
          type="email"
          id="client-email"
          v-model="invoice.clientEmail"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter client's email"
        />
      </div>

      <!-- Invoice Items -->
      <div v-for="(item, index) in invoice.items" :key="index" class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2"
          >Item {{ index + 1 }}</label
        >
        <div class="flex space-x-4">
          <input
            type="text"
            v-model="item.description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Item Description"
          />
          <input
            type="number"
            v-model="item.quantity"
            class="shadow appearance-none border rounded w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Quantity"
          />
          <input
            type="number"
            v-model="item.price"
            class="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Price"
          />
          <button
            type="button"
            @click="removeItem(index)"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Remove
          </button>
        </div>
      </div>

      <button
        type="button"
        @click="addItem"
        class="mb-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Item
      </button>

      <!-- Submit Button -->
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Invoice
        </button>
      </div>
    </form>
  </div>
</template>
