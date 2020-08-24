<template>
  <div>
    <div>
      <PryvAlert :message="alertMessage" :show="show"></PryvAlert>
    </div>
    <div>
      <b-form @submit.prevent>
        <div class="mb-4 mb-sm-0">
          <PryvInput
            :id="id"
            :placeholder="placeHolder"
            @textInput="updateEndpoint"
            v-model="apiEndpoint"
            :required="requiredInput"
          ></PryvInput>
        </div>
        <PryvBtn
          :content="btnContent"
          :type="btnType"
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
      btnContent: "Login",
      id: "inline-form-input-endpoint",
      placeHolder: "Enter API Endpoint",
      show: false,
      alertMessage: "",
      btnType: "submit",
      requiredInput: true,
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
        alert();
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