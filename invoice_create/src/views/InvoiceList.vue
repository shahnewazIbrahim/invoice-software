<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { createToaster } from "@meforma/vue-toaster";

const invoices = ref([]);
const toaster = createToaster();

const router = useRouter();

function getAmount(invoice) {
  // Logic to edit the selected invoice
  let amount = 0;
  invoice.items.forEach((element) => {
    console.log(element);
    amount += element.price;
  });

  return amount;
}
onMounted(async () => {
  let response = await axios.get("http://localhost:3000/list-invoices");

  invoices.value = response.data.invoices;
});

const fetchInvoices = async () => {
  let response = await axios.get("http://localhost:3000/list-invoices");

  invoices.value = response.data.invoices;
};

const deleteInvoice = async (id) => {
  try {
    const confirmed = confirm("Are you sure you want to delete this invoice?");

    if (confirmed) {
      const response = await axios.delete(
        `http://localhost:3000/invoices/${id}`
      );
      console.log("Invoice deleted:", response.data);
      toaster.show(`${response.data.message}`, {
        type: "success",
        position: "top-right",
      });
      // After deletion, navigate back to the invoice list or another appropriate page
      fetchInvoices()
      router.push("/invoices");
    }
  } catch (error) {
    console.error("Failed to update invoice:", error);

    toaster.show(error.message, {
      type: "error",
      position: "top-right",
    });
  }
};
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
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span
                :class="{
                  'text-green-500': invoice.status === 'paid',
                  'text-yellow-500': invoice.status === 'pending',
                  'text-red-500': invoice.status === 'overdue',
                }"
              >
                {{ invoice.status.toUpperCase() }}
              </span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center"
            >
              <router-link
                :to="`/invoices/${invoice.invoiceNumber}`"
                class="text-blue-500 hover:text-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 text-yellow-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </router-link>
              <router-link
                :to="`/invoices/edit/${invoice.invoiceNumber}`"
                class="ml-4 text-blue-500 hover:text-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 text-blue-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </router-link>

              <button
                @click="deleteInvoice(invoice.invoiceNumber)"
                class="ml-4 text-blue-500 hover:text-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 text-red-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
