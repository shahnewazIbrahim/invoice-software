<script setup>
import { createToaster } from "@meforma/vue-toaster";
import axios from "axios";
import { onBeforeMount, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const toaster = createToaster({
  /* options */
});

const invoice = reactive({});

onBeforeMount(async () => {
  let response = await axios.get(
    `http://localhost:3000/invoices/${route.params.id}`
  );

  invoice.value = response.data.invoice;
});

const addItem = () => {
  invoice.value.items.push({
    description: "",
    quantity: 1,
    price: 0,
  });
};

const removeItem = (index) => {
  invoice.value.items.splice(index, 1);
};

const saveInvoice = async () => {
  try {
    const response = await axios.put(
      `http://localhost:3000/invoices/${invoice.value.invoiceNumber}`,
      invoice.value
    );
    console.log("Invoice updated:", response.data);

    // After saving, navigate back to the invoice detail view
    toaster.show(`${response.data.message}`, {
      type: "success",
      position: "top-right",
    });
    router.push(`/invoices/${invoice.value.invoiceNumber}`);
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
  <form
    v-if="invoice?.value"
    @submit.prevent="saveInvoice"
    class="container mx-auto p-6 bg-white shadow-md rounded-lg"
  >
    <h1 class="text-2xl font-bold mb-6">
      Edit Invoice #{{ invoice.value.invoiceNumber }}
    </h1>

    <!-- Client Details Section -->
    <h2 class="text-lg font-semibold">Client Details:</h2>
    <div class="grid grid-cols-3 gap-2 mb-4">
        <div>

            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="invoice.value.clientName"
              type="text"
              required
              class="mt-1 block w-full p-2 border rounded-md"
            />
        </div>
        <div>

            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="invoice.value.clientEmail"
              type="email"
              class="mt-1 block w-full p-2 border rounded-md"
            />
        </div>
        <div>

            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="client-email"
              v-model="invoice.value.status"
              class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Client's Email"
              required
            >
              <option value="">Select status</option>
              <option value="paid" :selected="invoice.value.status == 'paid'">Paid</option>
              <option value="pending" :selected="invoice.value.status == 'pending'">Pending</option>
              <option value="overdue" :selected="invoice.value.status == 'overdue'">Overdue</option>
            </select>
        </div>
    </div>

    <!-- Invoice Dates Section -->
    <div class="mb-4">
      <h2 class="text-lg font-semibold">Invoice Details:</h2>
      <label class="block text-sm font-medium text-gray-700"
        >Invoice Date</label
      >
      <input
        v-model="invoice.value.invoiceDate"
        type="date"
        required
        class="mt-1 block w-full p-2 border rounded-md"
      />

      <label class="block text-sm font-medium text-gray-700 mt-4"
        >Due Date</label
      >
      <input
        v-model="invoice.value.dueDate"
        type="date"
        required
        class="mt-1 block w-full p-2 border rounded-md"
      />
    </div>

    <!-- Items Section -->
    <div class="mb-4">
      <h2 class="text-lg font-semibold">Items:</h2>
      <div
        v-for="(item, index) in invoice.value.items"
        :key="index"
        class="mb-4"
      >
        <div class="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <input
              v-model="item.description"
              type="text"
              required
              class="mt-1 block w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Quantity</label
            >
            <input
              v-model="item.quantity"
              type="number"
              required
              class="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Price</label>
            <input
              v-model="item.price"
              type="number"
              required
              class="mt-1 block w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <button @click="removeItem(index)" class="text-red-500 mt-2">
          Remove Item
        </button>
      </div>

      <button
        @click="addItem"
        type="button"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Add New Item
      </button>
    </div>

    <!-- Save Button -->
    <div class="text-right">
      <button
        type="submit"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Save Changes
      </button>
    </div>
  </form>
</template>
