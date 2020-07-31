<template>
  <div>
    <div>
      <PryvAlert :show="show" :message="message"></PryvAlert>
    </div>
    <div>
      <b-form inline ref="form" v-on:submit.prevent="login">
        <label class="sr-only" for="inline-form-input-username">Username</label>
        <b-input-group class="input-group-width mb-4 mr-sm-2 mb-sm-0">
          <PryvInput
            :id="id_username"
            :placeholder="placeholder_username"
            v-model="username"
            @textInput="updateUsername"
          ></PryvInput>
        </b-input-group>
        <label class="sr-only" for="inline-form-input-password">Password</label>
        <b-input-group
          class="input-group-width mb-4 mb-sm-0 w-40"
          style="float: right"
        >
          <PryvPassword
            :id="id_password"
            :placeholder="placeholder_password"
            v-model="password"
            @passwordInput="updatePassword"
          ></PryvPassword>
        </b-input-group>
        <PryvBtn :content="btncontent" @click="login" id="submitBtn"></PryvBtn>
      </b-form>
    </div>
  </div>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";
import PryvInput from "../shared/PryvInput";
import PryvPassword from "../shared/PryvPassword";
import PryvAlert from "../shared/PryvAlert";

import { mapState } from "vuex";
export default {
  name: "UsernameLogin",
  components: { PryvAlert, PryvPassword, PryvBtn, PryvInput },
  data() {
    return {
      username: "",
      password: "",
      btncontent: "Login",
      id_username: "inline-form-input-username",
      id_password: "inline-form-input-password",
      placeholder_username: "Enter username",
      placeholder_password: "Enter password",
      show: false,
      message: "",
    };
  },
  computed: {
    ...mapState(["serviceInfo"]),
  },
  methods: {
    async login() {
      if (!this.username && !this.password) {
        this.show = true;
        this.message = "Please enter your username and password";
        return;
      } else if (!this.username) {
        this.show = true;
        this.message = "Please enter your username";
        return;
      } else if (!this.password) {
        this.show = true;
        this.message = "Please enter your password";
        return;
      }

      const serviceInfoUrl = this.serviceInfo;
      const appId = "web-app-explorer";
      const service = new this.$pryv.Service(serviceInfoUrl);
      try {
        const connection = await service.login(
          this.username,
          this.password,
          appId
        );
        if (connection) {
          this.$emit("authenticated", connection, false);
        } else {
          this.show = true;
          this.message = "login credentials are not correct.";
          this.username = "";
          this.password = "";
          console.log("Invalid login credentials.");
          return;
        }
      } catch (e) {
        this.show = true;
        this.message = e.message;
        this.username = "";
        this.password = "";
        console.log(e.message);
        return;
      }
    },
    updateUsername(value) {
      this.username = value;
      if (this.username && this.show) {
        this.show = false;
        this.message = "";
      }
    },
    updatePassword(value) {
      this.password = value;
      if (this.password && this.show) {
        this.show = false;
        this.message = "";
      }
    },
  },
};
</script>
<style scoped>
.input-group-width {
  width: 49%;
}
</style>
