<template>
  <PryvBtn :content="btnContent" @click="loadEvents" id="submitBtn"></PryvBtn>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";
import GET_STREAMS_API from "../../utilities/api";
import ACCESS_INFO_API from "../../utilities/api";

export default {
  name: "LoadEvents",
  components: { PryvBtn },
  data() {
    return {
      btnContent: "Load Events",
    };
  },
  computed: {
    events_map: {
      get() {
        return this.$store.state.events_map;
      },
      set([key, value]) {
        if (!this.events_map[key]) {
          this.$store.commit("ADD_EVENTS_MAP", [key, value]);
        }
      },
    },
    types: {
      get() {
        return this.$store.state.types;
      },
      set(value) {
        this.$store.commit("SET_TYPES", value);
      },
    },
  },
  methods: {
    apiLogin(endPoint) {
      var connection = null;
      try {
        connection = new this.$pryv.Connection(endPoint);
      } catch (e) {
        console.log("connection retrieved successfully");
      }
      return connection;
    },
    loadEvents() {
      var existing = this.$sessionStorage.endpoint_arr;
      existing = existing ? JSON.parse(existing) : [];
      existing.forEach(function(obj) {
        var connection = this.apiLogin(obj.key);
        if (connection) this.updateStore(connection);
      });
    },
    async addStreamsToStore(connection) {
      try {
        const result = await connection.api(GET_STREAMS_API.GET_STREAMS_API);
        if (result)
          this.streams_map = [connection.apiEndpoint, result[0].streams];
      } catch (e) {
        console.log("Error occurred when retrieving streams");
        console.log(e);
        return false;
      }
      return true;
    },
    async addAccessInfoToStore(connection) {
      try {
        const result = await connection.api(ACCESS_INFO_API.ACCESS_INFO_API);
        if (result)
          this.access_info_map = [
            connection.token + connection.endpoint,
            result[0],
          ];
      } catch (e) {
        console.log("Error occurred when retrieving access info");
        console.log(e);
        return false;
      }
      return true;
    },
    async addEventsToStore(connection) {
      this.events = [];
      var queryParams = {};
      try {
        const result = await connection.getEventsStreamed(
          queryParams,
          this.addEachEvent
        );
        this.events_map = [connection.token + connection.endpoint, this.events];
        console.log(result);
      } catch (e) {
        console.log("Error occurred when retrieving events");
        console.log(e);
        return false;
      }
      return true;
    },
    addEachEvent(event) {
      this.events.push(event);
      this.typesSet.add(event.type);
      this.types = this.typesSet;
    },
    updateStore(connection) {
      if (this.addEventsToStore(connection)) this.$router.push("events");
      return false;
    },
  },
};
</script>

<style scoped></style>
