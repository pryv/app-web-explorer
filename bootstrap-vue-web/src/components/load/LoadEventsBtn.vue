<template>
  <PryvBtn
    icon="arrow-clockwise"
    content=" Events"
    @click="loadEvents"
    id="submitBtn"
  ></PryvBtn>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";
import { mapState } from "vuex";
export default {
  name: "LoadEventsBtn",
  components: { PryvBtn },
  data() {
    return {
      events: [],
      typesSet: new Set(),
    };
  },
  computed: {
    ...mapState(["connectionsMap"]),
    ...mapState(["selectedFilters"]),
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
    loadEvents() {
      let existing = this.$sessionStorage.endpoint_arr;
      existing = existing ? JSON.parse(existing) : [];
      existing.forEach(obj => {
        const connection = this.connectionsMap[obj.key];
        if (connection) this.addEventsToStore(connection);
      });
      if (this.currentRouteName() !== "Events") this.$router.push("events");
    },
    currentRouteName() {
      return this.$route.name;
    },
    async addEventsToStore(connection) {
      this.events = [];
      let modified = this.modifiedSinceMap[connection.apiEndpoint];

      let queryParams = { modifiedSince: modified * 1000 };
      try {
        const result = await connection.getEventsStreamed(
          queryParams,
          this.addEachEvent
        );
        this.modifiedSinceMap = [
          connection.apiEndpoint,
          result.meta.serverTime / 1000,
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
      }
    },
    addEachEvent(event) {
      this.events.push(event);
      this.typesSet.add(event.type);
      this.types = this.typesSet;
    },
  },
};
</script>