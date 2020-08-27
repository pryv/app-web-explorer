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
export default {
  name: "LoadStreamsForConnection",
  components: { PryvBtn },
  data() {
    return {
      events: [],
      typesSet: new Set(),
    };
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
  },
  methods: {
    loadStreams() {
      const endpoint = this.viewStreamInfo.endpoint;
      const connection = this.connectionsMap[endpoint];
      if (connection)
        if (this.addStreamsToStore(connection))
          if (this.currentRouteName() === "Login") this.$router.push("events");
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
  },
};
</script>