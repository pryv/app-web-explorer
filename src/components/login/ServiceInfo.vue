<template>
  <div>
    <b-form>
      <b-input-group class="mb-4 mr-sm-4 mb-sm-0">
        <b-input
          :id="id"
          placeholder="Enter Service Endpoint"
          ref="serviceInfo"
          :value="serviceInfoUrl"
          @input="setServiceInfo"
        ></b-input>
      </b-input-group>
      <PryvBtn icon="arrow-clockwise" @click="fetchServiceInfo" content="Fetch Service Info" ></PryvBtn>
    </b-form>
    <div class="pt-2">
      <h6 class="text-left default-font">{{ ServiceInfoLabel }}</h6>
      <div class="service-info-container">
        <div class="text-left default-font">
          "register": {{ register }} <br />
          "access": {{ access }} <br />
          "api": {{ api }} <br />
          "name": {{ name }} <br />
          "home": {{ home }} <br />
          "support": {{ support }} <br />
          "terms": {{ terms }} <br />
          "eventTypes": {{ eventTypes }}<br />
          "assets": {{ assets }}<br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";
import { constants } from "../../utilities/constants";
export default {
  name: "APILogin",
  components: { PryvBtn },
  computed: {
    serviceInfoMap: {
      get() {
        return this.$store.state.serviceInfoMap;
      },
      set(value) {
        this.$store.commit("UPDATE_SERVICE_INFO_MAP", value);
      },
    },
  },
  data() {
    return {
      serviceInfoUrl : this.id === "manual_login" ? this.$store.state.serviceInfoMap["manual"]: this.$store.state.serviceInfoMap["web"],
      ServiceInfoLabel: "Service Info",
      register: "",
      access: "",
      api: "",
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
    let service =null
    let serviceInfoVar = null
    if (this.$route.query && this.$route.query.pryvServiceInfoUrl) {
      this.serviceInfoUrl = this.$route.query.pryvServiceInfoUrl;
    }
    try{
      service = new this.$pryv.Service(this.serviceInfoUrl);
      serviceInfoVar = await service.info();
    }
    catch (e) {
      this.serviceInfoUrl = constants.DEFAULT_SERVICE_INFO_URL
      this.$route.query.pryvServiceInfoUrl = this.serviceInfoUrl
      service = new this.$pryv.Service(this.serviceInfoUrl);
      serviceInfoVar = await service.info();
    }
    finally {
      if(this.id === "manual_login")
        this.serviceInfoMap.manual = this.serviceInfoUrl;
      else if(this.id === "web_login")
        this.serviceInfoMap.web = this.serviceInfoUrl;
      //this.serviceInfo = this.serviceInfoUrl
      this.register = serviceInfoVar.register;
      this.access = serviceInfoVar.access;
      this.api = serviceInfoVar.api;
      this.name = serviceInfoVar.name;
      this.home = serviceInfoVar.home;
      this.support = serviceInfoVar.support;
      this.terms = serviceInfoVar.terms;
      this.eventTypes = serviceInfoVar.eventTypes;
      this.assets = serviceInfoVar.assets;
    }
  },
  methods:{
    setServiceInfo(value)
    {
      this.serviceInfoUrl = value
    },
    async fetchServiceInfo(){
      let service = null;
      let serviceInfoVar = null;
      try{
        service = new this.$pryv.Service(this.serviceInfoUrl);
        serviceInfoVar = await service.info();
      }
      catch (e) {
        this.serviceInfoUrl = constants.DEFAULT_SERVICE_INFO_URL
        service = new this.$pryv.Service(this.serviceInfoUrl);
        serviceInfoVar = await service.info();
      }
      finally {
        if(this.id === "manual_login")
          this.serviceInfoMap.manual = this.serviceInfoUrl;
        else if(this.id === "web_login")
          this.serviceInfoMap.web = this.serviceInfoUrl;
        console.log("fianall service info")
        console.log(this.serviceInfo)
        this.register = serviceInfoVar.register;
        this.access = serviceInfoVar.access;
        this.api = serviceInfoVar.api;
        this.name = serviceInfoVar.name;
        this.home = serviceInfoVar.home;
        this.support = serviceInfoVar.support;
        this.terms = serviceInfoVar.terms;
        this.eventTypes = serviceInfoVar.eventTypes;
        this.assets = serviceInfoVar.assets;
      }

    }
  }
};
</script>
<style scoped>
.service-info-container {
  max-height: 200px;
  overflow-y: auto;
}
</style>