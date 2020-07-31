<template>
  <div>
    <div>
      <PryvAlert :message="alertMessage" :show="show"></PryvAlert>
    </div>
    <div>
      <b-form>
        <div class="mb-4 mb-sm-0">
          <PryvInput
            :id="id"
            :placeholder="placeHolder"
            @textInput="updateEndpoint"
            v-model="apiEndpoint"
          ></PryvInput>
        </div>
        <PryvBtn :content="btnContent" @click="loginAPI"></PryvBtn>
      </b-form>
    </div>
  </div>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";
import PryvInput from "../shared/PryvInput";
import PryvAlert from "../shared/PryvAlert";

export default {
  name: "APILogin",
  components: { PryvInput, PryvBtn, PryvAlert },
  data() {
    return {
      apiEndpoint: "",
      btnContent: "Login",
      id: "inline-form-input-endpoint",
      placeHolder: "Enter API Endpoint",
      show: false,
      alertMessage: "",
    };
  },
  methods: {
    loginAPI: async function() {
      if (!this.apiEndpoint) {
        this.show = true;
        this.alertMessage = "Please enter the API endpoint";
        return;
      }
      try {
        const connection = new this.$pryv.Connection(this.apiEndpoint);
        if (connection) {
          this.$emit("authenticated", connection, false);
        } else {
          this.show = true;
          this.alertMessage = "Please enter the valid API endpoint";
          this.apiEndpoint = "";
          console.log("Endpoint is not valid.");
        }
      } catch (e) {
        this.show = true;
        this.alertMessage = e.message;
        this.apiEndpoint = "";
        return;
      }
    },
    updateEndpoint(value) {
      this.apiEndpoint = value;
      if (this.apiEndpoint && this.show) {
        this.show = false;
        this.alertMessage = "";
      }
    },
  },
};
</script>
