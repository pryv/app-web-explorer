<template>
  <div>
    <b-form>
      <b-input-group class="mb-4 mr-sm-4 mb-sm-0">
        <PryvInput
          :id="id"
          :placeholder="placeholder"
          v-model="this.serviceInfo"
          :disabled="disabled"
        ></PryvInput>
      </b-input-group>
    </b-form>
    <div class="pt-2">
      <h6 style="text-align: left;font-size: smaller">{{ ServiceInfo }}</h6>
      <b-card class="card-style service-info-container">
        <div class="service-info-content">
          "register": {{ register }} <br />
          "access": {{ access }} <br />
          "api": {{ api_v }} <br />
          "name": {{ name }} <br />
          "home": {{ home }} <br />
          "support": {{ support }} <br />
          "terms": {{ terms }} <br />
          "eventTypes": {{ eventTypes }}<br />
          "assets-": {{ assets }}<br />
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import PryvInput from "../../shared/PryvInput";
import { constants } from "../../../utilities/constants";
export default {
  name: "APILogin",
  components: { PryvInput },
  computed: {
    serviceInfo: {
      get() {
        return this.$store.state.serviceInfo;
      },
      set(value) {
        this.$store.commit("UPDATE_SERVICE_INFO", value);
      },
    },
  },
  data() {
    return {
      endpoint: constants.DEFAULT_SERVICE_INFO_URL,
      placeholder: "Enter Service Endpoint",
      ServiceInfo: "Service Info",
      disabled: true,
      register: "",
      access: "",
      api_v: "",
      name: "",
      home: "",
      support: "",
      terms: "",
      eventTypes: "",
      assets: "",
    };
  },
  props: {
    id: {
      type: String,
    },
  },
  async created() {
    if (this.$route.query && this.$route.query.pryvServiceInfoUrl) {
      const serviceInfoUrl = this.$route.query.pryvServiceInfoUrl;
      if (serviceInfoUrl) this.serviceInfo = serviceInfoUrl;
    }
    const service = new this.$pryv.Service(this.serviceInfo);
    const serviceInfoVar = await service.info();
    this.register = serviceInfoVar.register;
    this.access = serviceInfoVar.access;
    this.api_v = serviceInfoVar.api;
    this.name = serviceInfoVar.name;
    this.home = serviceInfoVar.home;
    this.support = serviceInfoVar.support;
    this.terms = serviceInfoVar.terms;
    this.eventTypes = serviceInfoVar.eventTypes;
    this.assets = serviceInfoVar.assets;
  },
};
</script>
<style scoped>
.card-body {
  padding: 0.5rem !important;
}
.service-info-container {
  max-height: 150px;
  overflow-y: auto;
}
.service-info-content {
  text-align: left;
  font-size: 11px;
}
</style>
