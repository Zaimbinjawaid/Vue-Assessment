<template>
  <div class="q-pa-lg main-content">
    <q-form @submit="submit" @reset="onReset" class="q-gutter-xl form-class">
      <q-input
        filled
        type="text"
        v-model="title"
        label="Your Title *"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Enter Title']"
        :readonly="fieldState"
      />

      <q-input
        filled
        type="textarea"
        v-model="description"
        label="Add description here"
        :rules="[(val) => (val && val.length > 0) || 'Enter Description']"
        :readonly="fieldState"
      />

      <div>
        <q-btn
          label="Submit"
          type="submit"
          color="primary"
          v-if="!fieldState"
        />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          class="q-ml-sm"
          v-if="!fieldState"
        />
        <q-btn
          label="Back"
          color="primary"
          class="q-ml-sm"
          v-if="fieldState"
          @click.prevent="router.push('/listToDo')"
        />
      </div>
    </q-form>
  </div>
</template>
<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { auth } from "@/services/auth.js";
import { useRouter, useRoute } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();

    const title = ref(null);
    const description = ref(null);
    const token = ref(false);
    const fieldState = ref(false);

    if (route.params.id) {
      getToDo(route.params.id);
      if (route.params.type == "view") {
        fieldState.value = true;
      }
    }

    async function submit() {
      let obj = {
        title: title.value,
        description: description.value,
      };
      let result = route.params.id
        ? await auth.updateToDo(route.params.id, obj)
        : await auth.toDo(obj);
      if (result.data && result.data.success) {
        $q.notify({
          color: "green-4",
          textColor: "white",
          message: result.data.message
            ? result.data.message
            : route.params.type
            ? "ToDo Updated Successfully"
            : "ToDo Added Successfully",
        });
        router.push("/listToDo");
      } else {
        $q.notify({
          color: "red-4",
          textColor: "white",
          message: result.error.response.data.message
            ? result.error.response.data.message
            : "Something went wrong.",
        });
      }
    }

    async function getToDo(id) {
      let result = await auth.getSingleToDo(id);
      if (result && result.data.success) {
        title.value = result.data.item.title;
        description.value = result.data.item.description;
      }
    }

    function onReset() {
      title.value = null;
      description.value = null;
    }

    return {
      title,
      description,
      submit,
      token,
      getToDo,
      onReset,
      fieldState,
      router,
    };
  },
};
</script>