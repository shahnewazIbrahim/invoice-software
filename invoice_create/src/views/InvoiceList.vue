<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const invoices = ref([]);

function viewInvoice(id) {
  // Logic to view the details of the selected invoice
  this.$router.push({ name: "ViewInvoice", params: { id } });
}

function editInvoice(id) {
  // Logic to edit the selected invoice
  this.$router.push({ name: "EditInvoice", params: { id } });
}

function getAmount(invoice) {
  // Logic to edit the selected invoice
  let amount = 0;
  invoice.items.forEach(element => {
    console.log(element);
    amount += element.price
    
  })
  
  return amount
}
onMounted(async() => {
   let response =  await axios.get('http://localhost:3000/list-invoices')
    
   invoices.value = response.data.invoices
})
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Invoice List Header -->
    <header
      class="bg-white shadow-md p-4 mb-6 flex items-center justify-between"
    >
      <h1 class="text-2xl font-bold text-gray-800">Invoice List</h1>
      <router-link
        to="/invoices/create"
        class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Create New Invoice
      </router-link>
    </header>

    <!-- Invoice Table -->
    <div class="bg-white rounded-lg shadow-md">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Invoice Number
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Client
            </th>
            <!-- <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th> -->
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
            >
              {{ invoice.invoiceNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ invoice.invoiceDate }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ getAmount(invoice) }} Tk
            </td>

            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ invoice.clientName }}
            </td>
            <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
                :class="{
                  'text-green-500': invoice.status === 'Paid',
                  'text-yellow-500': invoice.status === 'Pending',
                  'text-red-500': invoice.status === 'Overdue',
                }"
              >
                {{ invoice.status }}
              </span>
            </td> -->
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="viewInvoice(invoice.invoiceNumber)"
                class="text-blue-500 hover:text-blue-700"
              >
                View
              </button>
              <button
                @click="editInvoice(invoice.invoiceNumber)"
                class="ml-4 text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
