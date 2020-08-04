<template>
  <PryvBtn :content="btnContent" @click="loadStreams" id="submitBtn"></PryvBtn>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";
import GET_STREAMS_API from "../../utilities/api";
import { mapState } from "vuex";
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
      existing.forEach(obj => {
        const connection = this.connectionsMap[obj.key];
        if (connection) this.updateStore(connection);
      });
    },
    currentRouteName() {
      return this.$route.name;
    },
    async addStreamsToStore(connection) {
      try {
        const result = await connection.api(GET_STREAMS_API.GET_STREAMS_API);
        if (result) {
          const clonedStreams = Object.assign({}, this.streamsMap);
          clonedStreams[connection.apiEndpoint] = result[0].streams;
          this.streamsMap = clonedStreams;
        }
      } catch (e) {
        console.log("Error occurred when retrieving streams" + e);
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
        const clonedEvents = Object.assign({}, this.eventsMap);
        clonedEvents[connection.apiEndpoint] = this.events;
        this.eventsMap = clonedEvents;
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
        if (this.currentRouteName() !== "Events") this.$router.push("events");
    },
  },
};
</script>