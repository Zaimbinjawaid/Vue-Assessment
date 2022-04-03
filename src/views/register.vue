<template>
  <div class="q-pa-lf main-content">
    <q-form @submit="submit" @reset="onReset" class="q-gutter-xl form-class">
      <q-input
        filled
        v-model="email"
        label="Your Email *"
        hint="e.g abc@test.com"
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

      <q-input
        filled
        type="password"
        v-model="confirmPassword"
        label="Confirm Password *"
        lazy-rules
        :rules="[(val) => val == password || 'Not Equal to Password']"
      />

      <q-toggle v-model="accept" label="I accept the license and terms" />

      <div>
        <q-btn
          label="Submit"
          type="submit"
          @click.prevent="submit"
          color="primary"
        />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
          @click.prevent="onReset"
        />
      </div>
    </q-form>
  </div>
</template>
<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { auth } from "@/services/auth.js";

export default {
  setup() {
    const $q = useQuasar();

    const email = ref(null);
    const password = ref(null);
    const confirmPassword = ref(null);
    const accept = ref(false);

    async function submit() {
      if (accept.value !== true) {
        $q.notify({
          color: "red-5",
          textColor: "white",
          message: "Accept the terms and license first",
        });
      } else {
        let obj = {
          email: email.value,
          password: password.value,
          password_confirmation: confirmPassword.value,
        };

        let result = await auth.register(obj);
        if (result.data && result.data.success) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              token: result.data.user.token,
            })
          );
          $q.notify({
            color: "green-4",
            textColor: "white",
            message: result.data.message ? result.data.message : "Success!",
          });
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
              message: "Something went wrong.",
            });
          }
        }
      }
    }

    function onReset() {
      email.value = null;
      password.value = null;
      confirmPassword.value = null;
      accept.value = false;
    }

    return {
      email,
      password,
      accept,
      confirmPassword,
      submit,
      onReset,
    };
  },
};
</script>