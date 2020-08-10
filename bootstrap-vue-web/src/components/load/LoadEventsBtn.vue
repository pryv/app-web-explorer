<template>
  <PryvBtn :content="btnContent" @click="loadEvents" id="submitBtn"></PryvBtn>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";

export default {
  name: "LoadEventsBtn",
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
      let connection = null;
      try {
        connection = new this.$pryv.Connection(endPoint);
      } catch (e) {
        console.log("connection retrieved successfully" + e);
        return;
      }
      return connection;
    },
    loadEvents() {
      let existing = this.$sessionStorage.endpoint_arr;
      existing = existing ? JSON.parse(existing) : [];
      existing.forEach(function(obj) {
        const connection = this.apiLogin(obj.key);
        if (connection) this.addEventsToStore(connection);
      });
      this.$router.push("events");
    },
    async addEventsToStore(connection) {
      this.events = [];
      let queryParams = {};
      try {
        const result = await connection.getEventsStreamed(
          queryParams,
          this.addEachEvent
        );
        this.events_map = [connection.token + connection.endpoint, this.events];
        console.log(result);
      } catch (e) {
        console.log("Error occurred when retrieving events" + e);
        return false;
      }
      return true;
    },
    addEachEvent(event) {
      this.events.push(event);
      this.typesSet.add(event.type);
      this.types = this.typesSet;
    },
  },
};
</script>
