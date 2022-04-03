<template>
  <div class="q-pa-lg main-content">
    <q-form @submit="submit" @reset="onReset" class="q-gutter-xl form-class">
      <q-input
        filled
        v-model="email"
        label="Your Email *"
        hint="abc@test.com"
        lazy-rules
        :rules="[
          (val) =>
            (val && val.length > 0 && val.includes('@')) ||
            'Please type something',
        ]"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        label="Your passowrd *"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 5) || 'Passowrd must be of 6 character',
        ]"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>
<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { auth } from "@/services/auth.js";
import { useRouter } from "vue-router";

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const email = ref(null);
    const password = ref(null);

    async function submit() {
      let obj = {
        email: email.value,
        password: password.value,
      };

      let result = await auth.login(obj);
      if (result.data && result.data.success) {
        let token = result.data.user.token;
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            token,
          })
        );
        $q.notify({
          color: "green-4",
          textColor: "white",
          message: result.data.message ? result.data.message : "Success!",
        });
        router.push("/listToDo");
      } else {
        if (
          !result.error.response.data.success &&
          result.error.response.status == 422
        ) {
          $q.notify({
            color: "red-4",
            textColor: "white",
            message: result.error.response.data.error[0]
              ? result.error.response.data.error[0]
              : "Error!",
          });
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
    }

    function onReset() {
      email.value = null;
      password.value = null;
    }

    return {
      email,
      password,
      submit,
      onReset,
    };
  },
};
</script>