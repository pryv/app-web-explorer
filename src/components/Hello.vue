<template>
  <div>
    <h1>Hello</h1>

    <v-divider
      class="mt-3 mb-2"
    />

    <v-form
      ref="form"
      v-model="validForm"
      @submit.prevent
    >
      <v-text-field
        id="username"
        v-model="username"
        :rules="[rules.required]"
        label="Username"
      />

      <Password v-model="password" />

      <v-btn
        id="submitButton"
        :disabled="!validForm||submitting"
        @click="submit"
      >
        Sign-in
      </v-btn>
    </v-form>

    <Alerts
      id="alert"
      :successMsg="success"
      :errorMsg="error"
    />

  </div>
</template>

<script>
import Password from './bits/Password.vue';
import Alerts from './bits/Alerts.vue';
import Context from '../context.js';

export default {
  components: {
    Password,
    Alerts,
  },
  data: () => ({
    password: '',
    username: '',
    error: '',
    success: '',
    submitting: false,
    ctx: {},
    rules: {
      required: value => !!value || 'This field is required.',
    },
    validForm: false,
  }),
  async created () {
    this.ctx = new Context(this.$route.query);
    await this.ctx.init();
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        this.submitting = true;
        try {
          await this.ctx.pryv.login(this.username, this.password, this.ctx.appId);
          this.success = 'Login successful.';
        } catch (err) {
          this.error = err.toString();
        } finally {
          this.submitting = false;
        }
      }
    },
  },
};
</script>
