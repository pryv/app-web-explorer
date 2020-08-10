<template>
  <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
    <div class="bg-white py-2 w-80">
      <div class="card-style info-card">
        <b-row>
          <b-col cols="10">
            <h4>Access Info Panel</h4>
          </b-col>
          <b-col cols="1">
            <PryvBtn
              v-if="infoJSON"
              @click="backToEvents"
              class="mt-0"
              :content="btnContent"
            ></PryvBtn>
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
              :content="btnContentDisconnect"
            ></PryvBtn>
          </b-row>
        </b-card>
        <b-card class="text-info" v-else>
          {{ message }}
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VueJsonPretty from "vue-json-pretty";
import PryvBtn from "../components/shared/PryvBtn";

export default {
  name: "Info",
  computed: {
    ...mapState(["accessInfo"]),
    connections_map: {
      get() {
        return this.$store.state.connections_map;
      },
      set(value) {
        this.$store.commit("DELETE_CONNECTIONS_MAP", value);
      },
    },
    streams_map: {
      get() {
        return this.$store.state.streams_map;
      },
      set(value) {
        this.$store.commit("DELETE_STREAMS_MAP", value);
      },
    },
    access_info_map: {
      get() {
        return this.$store.state.access_info_map;
      },
      set(value) {
        this.$store.commit("DELETE_ACCESS_INFO_MAP", value);
      },
    },
    events_map: {
      get() {
        return this.$store.state.events_map;
      },
      set(value) {
        this.$store.commit("DELETE_EVENTS_MAP", value);
      },
    },
    infoJSON: {
      get: function() {
        return Object.keys(this.access_info_map)
          .filter(key => key === this.accessInfo)
          .reduce((obj, key) => {
            obj[key] = this.access_info_map[key];
            return obj;
          }, {});
      },
    },
  },
  components: {
    PryvBtn,
    VueJsonPretty,
  },
  data() {
    return {
      btnContent: "Back",
      message: "Please select an endpoint to view the access data",
      btnContentDisconnect: "Disconnect",
    };
  },
  methods: {
    displayAccessData() {
      for (const [key, value] of Object.entries(this.access_info_map)) {
        if (key.includes(this.accessInfo)) this.infoJSON = value;
      }
    },
    currentRouteName() {
      return this.$route.name;
    },
    backToEvents() {
      if (this.currentRouteName !== "events") {
        this.$router.push("events");
      }
    },
    deleteConnectionData()
    {
      const connections_map_cloned = Object.assign({}, this.connections_map);
      delete connections_map_cloned[this.accessInfo];
      this.connections_map = connections_map_cloned;

      const access_info_map_cloned = Object.assign({}, this.access_info_map);
      delete access_info_map_cloned[this.accessInfo];
      this.access_info_map = access_info_map_cloned;

      const streams_map_cloned = Object.assign({}, this.streams_map);
      delete streams_map_cloned[this.accessInfo];
      this.streams_map = streams_map_cloned;

      const events_map_cloned = Object.assign({}, this.events_map);
      delete events_map_cloned[this.accessInfo];
      this.events_map = events_map_cloned;

      Object.keys(this.connections_map).length === 0 ? this.$router.push("login") : this.$router.push("events");
    },
    //todo restructure the logout funcitionality
    logout() {
      let endpointArr = JSON.parse(this.$sessionStorage.endpoint_arr);
      let obj = endpointArr.find(o => o.key === this.accessInfo);
      if (obj.cookie) {
        const test = this.$cookies.remove("pryv-libjs-web-app-explorer", "/", {
          domain: ".l.rec.la",
        });
        console.log("remove cookies");
        console.log(test);
      }
      endpointArr = endpointArr.filter(obj => obj.key !== this.accessInfo);
      this.$sessionStorage.endpoint_arr = JSON.stringify(endpointArr);
      this.deleteConnectionData();
    },
  },
  watch: {
    accessInfo() {
      this.displayAccessData();
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
