<template>
  <PryvBtn
    icon="arrow-clockwise"
    content=" streams"
    @click="loadStreams"
    id="submitBtn"
  ></PryvBtn>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";
import GET_STREAMS_API from "../../utilities/api";
import { mapState } from "vuex";
import GET_EVENTS_API from "../../utilities/api";
export default {
  name: "LoadStreamsForConnection",
  components: { PryvBtn },
  props: {
    merge: { type: String, default: "not_accepted" },
  },
  computed: {
    ...mapState(["viewStreamInfo"]),
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
  },
  methods: {
    loadStreams() {
      console.log("load streams")
      console.log(this.merge)
      const endpoint = this.viewStreamInfo.endpoint;
      const connection = this.connectionsMap[endpoint];
      if (connection)
        if (this.addStreamsToStore(connection)) {
          if (this.merge === "accepted") {
            this.addInitialEventsToStore(connection);
            this.addEventsToStore(connection);
          }
          if (this.currentRouteName() === "Login") this.$router.push("events");
        }
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
    async addInitialEventsToStore(connection) {
      console.log("add initial events to store")
      this.displayEvents = [];
      this.typesSet = new Set();
      const apiObj = GET_EVENTS_API.GET_EVENTS_API;
      apiObj[0].params = {};
      try {
        const result = await connection.api(apiObj);
        this.modifiedSinceMap = [connection.apiEndpoint, Date.now() / 1000];
        if (result) {
          result[0].events.forEach(event => {
            this.forEachDisplayEvent(event);
          });
          this.types = this.typesSet;
          const clonedEventsDisplayMap = Object.assign(
            {},
            this.selectedStreamsMap
          );
          clonedEventsDisplayMap[connection.apiEndpoint] = this.displayEvents;
          this.eventsDisplayMap = clonedEventsDisplayMap;
        }
      } catch (e) {
        console.log("Error occurred when retrieving streams " + e);
        return false;
      }
      return true;
    },
    async addEventsToStore(connection) {
      this.events = [];
      let queryParams = { limit: 1000000 };
      try {
        const result = await connection.getEventsStreamed(
          queryParams,
          this.forEachEvent
        );
        this.modifiedSinceMap = [
          connection.apiEndpoint,
          result.meta.serverTime,
        ];
        this.eventsMap[connection.apiEndpoint] = this.events;
      } catch (e) {
        console.log("Error occurred when retrieving events " + e);
        return false;
      }
      return true;
    },
    forEachEvent(event) {
      this.events.push(event);
    },

    forEachDisplayEvent(event) {
      this.displayEvents.push(event);
      this.typesSet.add(event.type);
    },
  },
};
</script>