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
            id="inline-form-input-username"
            placeholder="Enter username"
            v-model="username"
            @textInput="updateUsername"
            required
          ></PryvInput>
        </b-input-group>
        <label class="sr-only" for="inline-form-input-password">Password</label>
        <b-input-group class="input-group-width mb-4 mb-sm-0 w-40 float-right">
          <PryvPassword
            id="inline-form-input-password"
            placeholder="Enter password"
            v-model="password"
            @passwordInput="updatePassword"
          ></PryvPassword>
        </b-input-group>
        <PryvBtn
          content="Login"
          type="submit"
          @click="login"
          id="submitBtn"
        ></PryvBtn>
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
      show: false,
      message: "",
    };
  },
  computed: {
    ...mapState(["serviceInfoMap"]),
  },
  methods: {
    async login() {
      const serviceInfoUrl = this.serviceInfoMap["manual"];
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
        }
      } catch (e) {
        this.show = true;
        this.message = e.message;
        this.username = "";
        this.password = "";
        console.log(e.message);
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