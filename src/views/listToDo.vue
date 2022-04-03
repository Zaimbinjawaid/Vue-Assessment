<template>
  <div class="input">
    <q-input
      filled
      type="text"
      v-model="search"
      label="Search here"
      @update:model-value="searchItem()"
    />
  </div>
  <q-list bordered class="rounded-borders list">

      <q-card v-if="toDoList.length == 0"> No results found.</q-card>
    <div v-for="(item, index) in toDoList" :key="index">
      <q-card v-if="item" class="my-card bg-secondary text-white">
        <q-card-section>
          <div class="text-h6">{{ item.title }}</div>
          <div class="text-subtitle2">{{ item.description }}</div>
        </q-card-section>

        <q-card-section>
          {{ item.done ? `Status: Done` : "Status: Pending" }}
        </q-card-section>

        <q-separator dark />

        <q-card-actions>
          <q-btn @click.prevent="viewItem(item)">View </q-btn>
          <q-btn @click.prevent="editItem(item)" color="primary">Edit</q-btn>
          <q-btn @click.prevent="deleteItem(item)" color="red">Delete</q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-list>
</template>
<script>
import { useQuasar } from "quasar";
import { ref, onMounted } from "vue";
import { auth } from "@/services/auth.js";

import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();
    const toDoList = ref([]);
    const toDoListCopy = ref([]);
    const router = useRouter();
    const search = ref(null);

    onMounted(async () => {
      let result = await auth.getToDoList();
      if (result && result.data.success) {
        let toDo_list = result.data.items.data;
        toDoList.value = toDo_list;
        toDoListCopy.value = toDo_list;

      } else {
        $q.notify({
          color: "red-4",
          textColor: "white",
          message: result.error.response.data.message
            ? result.error.response.data.message
            : "Something went wrong.",
        });
      }
    });

    function editItem(item) {
      router.push({
        name: "toDo",
        params: {
          type: "edit",
          id: item.id,
        },
      });
    }

    function viewItem(item) {
      router.push({
        name: "toDo",
        params: {
          type: "view",
          id: item.id,
        },
      });
    }

    async function deleteItem(item) {
      let id = item.id;
      let result = await auth.deleteToDo(id);
      if (result.data && result.data.success) {
        let index = toDoList.value.findIndex((todo) => todo.id == id);

        if (index != -1) {
          toDoList.value.splice(index, 1);
        }
      }
    }

    function searchItem() {
      if (search.value) {
        return (toDoList.value = toDoList.value.filter((item) => {
          return item.title.toLowerCase().match(search.value.toLowerCase());
        }));
      } else {
        return (toDoList.value = toDoListCopy.value);
      }
    }

    return {
      toDoList,
      toDoListCopy,
      editItem,
      viewItem,
      deleteItem,
      search,
      searchItem,
    };
  },
};
</script>

<style scoped>
.list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 12px;
  row-gap: 12px;
}

.q-list--bordered {
  border: none;
}
.input {
  padding: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>