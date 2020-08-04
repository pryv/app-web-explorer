<template>
  <PryvBtn :content="btnContent" @click="loadStreams" id="submitBtn"></PryvBtn>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";
import GET_STREAMS_API from "../../utilities/api";
import ACCESS_INFO_API from "../../utilities/api";

export default {
  name: "LoadStreamsBtn",
  components: { PryvBtn },
  data() {
    return {
      btnContent: "Load All",
      events: [],
      typesSet: new Set(),
    };
  },
  computed: {
    connections_map: {
      get() {
        return this.$store.state.connections_map;
      },
      set([key, value]) {
        if (!this.connections_map[key]) {
          this.$store.commit("ADD_CONNECTIONS_MAP", [key, value]);
        }
      },
    },
    streams_map: {
      get() {
        return this.$store.state.streams_map;
      },
      set([key, value]) {
        if (!this.streams_map[key]) {
          this.$store.commit("ADD_STREAMS_MAP", [key, value]);
        }
      },
    },
    access_info_map: {
      get() {
        return this.$store.state.access_info_map;
      },
      set([key, value]) {
        if (!this.access_info_map[key]) {
          this.$store.commit("ADD_ACCESS_INFO_MAP", [key, value]);
        }
      },
    },
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
    loadStreams() {
      let existing = this.$sessionStorage.endpoint_arr;
      existing = existing ? JSON.parse(existing) : [];
      existing.forEach((obj) =>{
        const connection = this.connections_map[obj.key];
        if (connection) this.updateStore(connection);
      });
    },
    currentRouteName() {
      return this.$route.name;
    },
    async addStreamsToStore(connection) {
      try {
        const result = await connection.api(GET_STREAMS_API.GET_STREAMS_API);
        if (result)
          this.streams_map = [connection.apiEndpoint, result[0].streams];
      } catch (e) {
        console.log("Error occurred when retrieving streams" + e);
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
        console.log("Error occurred when retrieving access info" + e);
        return false;
      }
      return true;
    },
    async addEventsToStore(connection) {
      this.events = [];
      let queryParams = {};
      try {
        const result = await connection.getEventsStreamed(
          queryParams,
          this.forEachEvent
        );
        this.events_map = [connection.token + connection.endpoint, this.events];
        console.log(result);
      } catch (e) {
        console.log("Error occurred when retrieving events" + e);
        return false;
      }
      return true;
    },
    forEachEvent(event) {
      this.events.push(event);
      this.typesSet.add(event.type);
      this.types = this.typesSet;
    },
    updateStore(connection) {
      if (
        this.addStreamsToStore(connection) &&
        this.addAccessInfoToStore(connection) &&
        this.addEventsToStore(connection)
      )
        if(this.currentRouteName() !== "Events") this.$router.push("events");
    },
  },
};
</script>
