<template>
  <div>
    <div>
      <PryvAlert :message="alertMessage" :show="show"></PryvAlert>
    </div>
    <div>
      <b-form @submit.prevent class="text-right">
        <div class="mb-4 mb-sm-0 text-right" >
          <PryvInput
            id="inline-form-input-endpoint"
            placeholder="Enter API Endpoint"
            @textInput="updateEndpoint"
            v-model="apiEndpoint"
            required
          ></PryvInput>
        </div>
        <PryvBtn
          content="Login"
          type="submit"
          @click="loginAPI"
        ></PryvBtn>
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
      placeHolder: "",
      show: false,
      alertMessage: "",
    };
  },
  methods: {
    loginAPI: async function() {
      try {
        const connection = new this.$pryv.Connection(this.apiEndpoint);
        connection
          ? this.$emit("authenticated", connection, false)
          : console.log("Please enter a valid endpoint.");
      } catch (e) {
        this.show = true;
        this.alertMessage = e.message;
        this.apiEndpoint = "";
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