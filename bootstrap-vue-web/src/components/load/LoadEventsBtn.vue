<template>
  <PryvBtn
    :icon="icon"
    :content="btnContent"
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
      btnContent: " Events",
      events: [],
      typesSet: new Set(),
      icon: "arrow-clockwise",
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
      let queryParams = { modifiedSince: modified };
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
    addEachEvent(event) {
      this.events.push(event);
      //todo check the types
      this.typesSet.add(event.type);
      this.types = this.typesSet;
    },
  },
};
</script>
