<template>
  <PryvBtn :icon="icon" :content="btnContent" @click="loadStreams" id="submitBtn"></PryvBtn>
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
      btnContent: " All",
      events: [],
      typesSet: new Set(),
      icon:"arrow-clockwise"
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
      const apiObj = GET_STREAMS_API.GET_STREAMS_API;
      apiObj[0].params = { state: "all" }; //todo remove state all
      try {
        const result = await connection.api(apiObj);
        if (result) {
          var loadStreams = [];
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
      if(stream.children && stream.children.length === 0)
        loadStreams.push(stream)
      if (stream.children && stream.children.length > 0) {
        loadStreams.push(stream)
        stream.children.forEach(streamChild => {
          return this.addStream(apiEndpoint, streamChild, loadStreams);
        });
      }
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
        this.addEventsToStore(connection)
      )
        if (this.currentRouteName() === "Login") this.$router.push("events");
    },
  },
};
</script>