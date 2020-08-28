<template>
  <PryvBtn
    icon="arrow-clockwise"
    content=" All"
    @click="loadStreams"
    id="submitBtn"
  ></PryvBtn>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";
import GET_STREAMS_API from "../../utilities/api";
import { mapState } from "vuex";
export default {
  name: "LoadAllBtn",
  components: { PryvBtn },
  data() {
    return {
      events: [],
      typesSet: new Set(),
    };
  },
  computed: {
    ...mapState(["connectionsMap"]),
    streamsMap: {
      get() {
        return this.$store.state.streamsMap;
      },
      set(value) {
        this.$store.commit("UPDATE_STREAMS_MAP", value);
      },
    },
    eventsMap: {
      get() {
        return this.$store.state.eventsMap;
      },
      set(value) {
        this.$store.commit("UPDATE_EVENTS_MAP", value);
      },
    },
    eventsDisplayMap: {
      get() {
        return this.$store.state.eventsDisplayMap;
      },
      set(value) {
        this.$store.commit("UPDATE_DISPLAY_EVENTS_MAP", value);
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
    modifiedSinceMap: {
      get() {
        return this.$store.state.modifiedSinceMap;
      },
      set([key, value]) {
        this.$store.commit("ADD_MODIFIED_SINCE_MAP", [key, value]);
      },
    },
  },
  methods: {
    loadStreams() {
      let existing = this.$sessionStorage.endpoint_arr;
      existing = existing ? JSON.parse(existing) : [];
      existing.forEach(obj => {
        const connection = this.connectionsMap[obj.key];
        if (connection) this.updateStore(connection);
      });
    },
    currentRouteName() {
      return this.$route.name;
    },
    async addStreamsToStore(connection) {
      const apiObj = GET_STREAMS_API.GET_STREAMS_API;
      apiObj[0].params = { state: "all" };
      try {
        const result = await connection.api(apiObj);
        if (result) {
          const loadStreams = [];
          result[0].streams.forEach(stream => {
            this.addStream(connection.apiEndpoint, stream, loadStreams);
          });
          const clonedStreams = Object.assign({}, this.streamsMap);
          clonedStreams[connection.apiEndpoint] = loadStreams;
          this.streamsMap = clonedStreams;
        }
      } catch (e) {
        console.log("Error occurred when retrieving streams " + e);
        return false;
      }
      return true;
    },
    async addStream(apiEndpoint, stream, loadStreams) {
      if (stream.children && stream.children.length === 0)
        loadStreams.push(stream);
      if (stream.children && stream.children.length > 0) {
        loadStreams.push(stream);
        stream.children.forEach(streamChild =>
          this.addStream(apiEndpoint, streamChild, loadStreams)
        );
      }
    },
    async addEventsToStore(connection) {
      this.events = [];
      let modified = this.modifiedSinceMap[connection.apiEndpoint];
      let queryParams = { modifiedSince: modified };
      try {
        const result = await connection.getEventsStreamed(
          queryParams,
          this.forEachEvent
        );
        this.modifiedSinceMap = [
          connection.apiEndpoint,
          result.meta.serverTime,
        ];
        this.typesSet = new Set();
        const clonedDisplayEvents = Object.assign({}, this.eventsDisplayMap);
        this.events.forEach(event => {
          if (
            this.eventsMap[connection.apiEndpoint].filter(
              e => e.id === event.id
            ).length === 0
          ) {
            this.eventsMap[connection.apiEndpoint].push(event);
          }
          if (
            clonedDisplayEvents[connection.apiEndpoint].filter(
              e => e.id === event.id
            ).length === 0
          ) {
            clonedDisplayEvents[connection.apiEndpoint].push(event);
          }
        });
        this.eventsDisplayMap = clonedDisplayEvents;
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
        this.addEventsToStore(connection)
      )
        if (this.currentRouteName() === "Login") this.$router.push("events");
    },
  },
};
</script>