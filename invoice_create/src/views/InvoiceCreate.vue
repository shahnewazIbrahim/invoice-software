<script setup>
import { createToaster } from "@meforma/vue-toaster";
import axios from "axios";
import { computed, ref } from "vue";

const toaster = createToaster({
  /* options */
});

const invoice = ref({
  invoiceNumber: "",
  invoiceDate: "",
  dueDate: "",
  clientName: "",
  clientEmail: "",
  status: "",
  items: [{ description: "", quantity: 1, price: 0 }],
});

const addItem = () => {
  invoice.value.items.push({ description: "", quantity: 1, price: 0 });
};

const removeItem = (index) => {
  invoice.value.items.splice(index, 1);
};

const subtotal = computed(() => {
  return invoice.value.items.reduce((sum, item) => {
    return sum + item.quantity * item.price;
  }, 0);
});

const tax = computed(() => {
  return subtotal.value * 0.1;
});

const total = computed(() => {
  return subtotal.value + tax.value;
});

const submitInvoice = () => {
  // Handle form submission logic

  console.log("Invoice Submitted:", invoice.value);
  axios
    .post("http://localhost:3000/save-invoice", invoice.value)
    .then((response) => {
      console.log(response.data.message);

      invoice.value = {
        invoiceNumber: "",
        invoiceDate: "",
        dueDate: "",
        clientName: "",
        clientEmail: "",
        items: [{ description: "", quantity: 1, price: 0 }],
      };

      toaster.show(`${response.data.message}`, {
        type: "success",
        position: "top-right",
      });
    })
    .catch((error) => {
      console.error("There was an error saving the invoice!", error);
      toaster.show(error.message, {
        type: "error",
        position: "top-right",
      });
    });
};
</script>

<template>
  <form
    @submit.prevent="submitInvoice"
    class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto"
  >
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Create New Invoice</h2>

    <!-- Invoice Metadata -->
    <div class="grid grid-cols-2 gap-6 mb-8">
      <div>
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="invoice-number"
          >Invoice Number</label
        >
        <input
          type="text"
          required
          id="invoice-number"
          v-model="invoice.invoiceNumber"
          class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="INV-1001"
        />
      </div>
      <div>
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="invoice-date"
          >Invoice Date</label
        >
        <input
          type="date"
          id="invoice-date"
          v-model="invoice.invoiceDate"
          required
          class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="due-date"
          >Due Date</label
        >
        <input
          type="date"
          id="due-date"
          v-model="invoice.dueDate"
          class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    </div>

    <!-- Client Details -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold text-gray-700 mb-4">
        Client Information
      </h3>
      <div class="grid grid-cols-3 gap-6">
        <div>
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="client-name"
            >Client Name</label
          >
          <input
            type="text"
            id="client-name"
            v-model="invoice.clientName"
            required
            class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Client's Name"
          />
        </div>
        <div>
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="client-email"
            >Client Email</label
          >
          <input
            type="email"
            id="client-email"
            v-model="invoice.clientEmail"
            class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Client's Email"
          />
        </div>

        <div>
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="client-email"
            >Status</label
          >
          <select
            id="client-email"
            v-model="invoice.status"
            class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Client's Email"
            required
          >
            <option value="">Select status</option>
            <option value="paid">Complete</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Invoice Items -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold text-gray-700 mb-4">Invoice Items</h3>
      <div class="space-y-4">
        <div
          v-for="(item, index) in invoice.items"
          :key="index"
          class="grid grid-cols-5 gap-4 items-end"
        >
          <input
            type="text"
            v-model="item.description"
            class="shadow-sm appearance-none border rounded col-span-2 py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Item Description"
            required
          />
          <input
            type="number"
            v-model="item.quantity"
            required
            class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Quantity"
          />
          <input
            type="number"
            v-model="item.price"
            required
            class="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Price"
          />
          <div class="text-right text-lg text-gray-800 font-semibold">
            Tk.{{ (item.quantity * item.price).toFixed(2) }}
          </div>
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
        class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Add Item
      </button>
    </div>

    <!-- Invoice Summary -->
    <div class="bg-gray-50 p-6 rounded-lg shadow-inner">
      <div class="flex justify-between text-xl font-semibold text-gray-700">
        <span>Subtotal:</span>
        <span>Tk.{{ subtotal.toFixed(2) }}</span>
      </div>
      <div
        class="flex justify-between text-xl font-semibold text-gray-700 mt-4"
      >
        <span>Tax (10%):</span>
        <span>Tk.{{ tax.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between text-2xl font-bold text-gray-800 mt-4">
        <span>Total:</span>
        <span>Tk.{{ total.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Submit Button -->
    <!-- @click="submitInvoice" -->
    <div class="mt-8 flex justify-end">
      <button
        type="submit"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
      >
        Create Invoice
      </button>
    </div>
  </form>
</template>
