<template>
  <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
    <div class="bg-white py-2 w-90">
      <div class="card-style info-card">
        <b-row>
          <b-col cols="10">
            <h4>Access Info Panel</h4>
          </b-col>
          <b-col cols="2" class="px-0 float-right">
            <PryvBtn
              v-if="infoJSON"
              @click="backToEvents"
              class="mt-0 mr-0"
              content="Back"
              icon="arrow-left"
            ></PryvBtn>
            <PryvBtn
              @click="$bvModal.show('modal-scoped-stream')"
              id="submitBtn"
              class="mt-0"
              icon="plus"
              content="Stream"
            >
            </PryvBtn>
            <AddStreamModal></AddStreamModal>
          </b-col>
        </b-row>
      </div>
      <div>
        <b-card class="text-info" v-if="infoJSON">
          <vue-json-pretty
            :path="'res'"
            :data="this.infoJSON"
          ></vue-json-pretty>
          <b-row class="justify-content-center">
            <PryvBtn
              class="mt-0"
              @click="logout"
              content="Disconnect"
              icon="power"
            ></PryvBtn>
          </b-row>
        </b-card>
        <b-card class="text-info" v-else>
          Please select an endpoint to view the access data
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VueJsonPretty from "vue-json-pretty";
import PryvBtn from "../components/shared/PryvBtn";
import AddStreamModal from "../components/modals/AddStreamModal";

export default {
  name: "Info",
  computed: {
    ...mapState(["viewAccessInfo"]),
    connectionsMap: {
      get() {
        return this.$store.state.connectionsMap;
      },
      set(value) {
        this.$store.commit("DELETE_CONNECTIONS_MAP", value);
      },
    },
    streamsMap: {
      get() {
        return this.$store.state.streamsMap;
      },
      set(value) {
        this.$store.commit("DELETE_STREAMS_MAP", value);
      },
    },
    accessInfoMap: {
      get() {
        return this.$store.state.accessInfoMap;
      },
      set(value) {
        this.$store.commit("DELETE_ACCESS_INFO_MAP", value);
      },
    },
    eventsMap: {
      get() {
        return this.$store.state.eventsMap;
      },
      set(value) {
        this.$store.commit("DELETE_EVENTS_MAP", value);
      },
    },
    infoJSON: {
      get: function() {
        return Object.keys(this.accessInfoMap)
          .filter(key => key === this.viewAccessInfo)
          .reduce((obj, key) => {
            obj[key] = this.accessInfoMap[key];
            return obj;
          }, {});
      },
    },
  },
  components: {
    AddStreamModal,
    PryvBtn,
    VueJsonPretty,
  },
  methods: {
    currentRouteName() {
      return this.$route.name;
    },
    backToEvents() {
      if (this.currentRouteName !== "events") {
        this.$router.push("events");
      }
    },
    deleteConnectionData() {
      const clonedConnectionsMap = Object.assign({}, this.connectionsMap);
      delete clonedConnectionsMap[this.viewAccessInfo];
      this.connectionsMap = clonedConnectionsMap;

      const clonedAccessInfoMap = Object.assign({}, this.accessInfoMap);
      delete clonedAccessInfoMap[this.viewAccessInfo];
      this.accessInfoMap = clonedAccessInfoMap;

      const clonedStreamsMap = Object.assign({}, this.streamsMap);
      delete clonedStreamsMap[this.viewAccessInfo];
      this.streamsMap = clonedStreamsMap;

      const clonedEventsMap = Object.assign({}, this.eventsMap);
      delete clonedEventsMap[this.viewAccessInfo];
      this.eventsMap = clonedEventsMap;

      Object.keys(this.connectionsMap).length === 0
        ? this.$router.push("login")
        : this.$router.push("events");
    },
    logout() {
      let endpointArr = JSON.parse(this.$sessionStorage.endpoint_arr);
      const obj = endpointArr.find(o => o.key === this.viewAccessInfo);
      if (obj.cookie) {
        this.$cookies.remove("pryv-libjs-web-app-explorer", window.location.pathname, "."+window.location.hostname);
      }
      endpointArr = endpointArr.filter(obj => obj.key !== this.viewAccessInfo);
      this.$sessionStorage.endpoint_arr = JSON.stringify(endpointArr);
      this.deleteConnectionData();
    },
  },
};
</script>

<style scoped>
.info-card {
  border: none;
  padding: 0.5%;
  text-align: left;
}
.text-info {
  text-align: left;
}
</style>