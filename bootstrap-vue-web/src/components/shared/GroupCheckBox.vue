<template>
  <div>
    <b-form-group>
      <StreamCheckBox
        v-for="(accessInfoObject, endpoint) in computedAccessInfoObjectArray"
        :key="endpoint"
        :accessInfoObject="accessInfoObject"
        :endpoint="endpoint"
        :selectedStreamsObjectArray="selectedStreamsObjectArray[endpoint]"
        @clickAll="clickAll"
        @selectedStreamsObjectArrayUpdate="setSelectedStreamsObjectArray"
      ></StreamCheckBox>
    </b-form-group>
  </div>
</template>

<script>
import StreamCheckBox from "./StreamCheckBox";
import { mapState } from "vuex";
export default {
  name: "GroupCheckBox",
  components: { StreamCheckBox },
  data() {
    return {
      accessInfoObjectArray: {},
    };
  },
  computed: {
    ...mapState(["streams_map"]),
    ...mapState(["access_info_map"]),
    selectedStreamsObjectArray: {
      get() {
        return this.$store.state.selectedStreams;
      },
      set(value) {
        this.$store.commit("UPDATE_SELECTED_ENDPOINTS", value);
      },
    },
    computedAccessInfoObjectArray() {
      return this.accessInfoObjectArray;
    },
  },
  watch: {
    streams_map() {
      this.displayStreams();
    },
  },
  methods: {
    clickAll(e) {
      var key = e.key; // endpoint token
      var event = e.event; // clicked token or null if unclicked
      var value = e.value; // clicked token or clicked token + stream id
      var clonedSelectedStreamsObjectArray = Object.assign(
        {},
        this.selectedStreamsObjectArray
      );
      if (event) {
        if (key === value) {
          clonedSelectedStreamsObjectArray[
            key
          ] = this.computedAccessInfoObjectArray[key].map(opt => {
            return opt.streamId;
          });
          clonedSelectedStreamsObjectArray[key].push(key);
        } else {
          if (!clonedSelectedStreamsObjectArray[key])
            clonedSelectedStreamsObjectArray[key] = [];
          clonedSelectedStreamsObjectArray[key].push(value);
        }
      } else {
        if (key === value) {
          clonedSelectedStreamsObjectArray[key] = [];
        } else {
          clonedSelectedStreamsObjectArray[
            key
          ] = this.selectedStreamsObjectArray[key]
            .filter(opt => opt != value);
        }
      }
      this.selectedStreamsObjectArray = Object.assign(
        {},
        clonedSelectedStreamsObjectArray
      );
    },
    displayStreams() {
      var customUserObjectArray = {};
      for (const [key, value] of Object.entries(this.access_info_map)) {
        customUserObjectArray[key] = [];
        const streams = this.streams_map[key];
        if (streams) {
          for (let i = 0; i < streams.length; i++) {
            const payload = {};
            payload["accessInfoName"] = value.name;
            payload["accessInfoType"] = value.type;
            payload["streamId"] = streams[i].id;
            payload["streamName"] = streams[i].name;
            customUserObjectArray[key].push(payload);
          }
        }
      }
      this.accessInfoObjectArray = customUserObjectArray;
    },
    setSelectedStreamsObjectArray(payload) {
      this.selectedStreamsObjectArray[payload.endpoint] = payload.streams;
    },
  },
};
</script>