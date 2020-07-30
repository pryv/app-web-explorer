<template>
  <div>
    <b-form-group>
      <StreamCheckBox
        v-for="(streamObjectArray, endpoint) in computedAccessInfoObjectArray"
        :key="endpoint"
        :streamObjectArray="streamObjectArray"
        :endpoint="endpoint"
        :selectedStreamsObjectArray="selectedStreamsObjectArray[endpoint]"
        @checkBoxClicked="checkBoxClicked"
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
    access_info_map() {
      this.displayStreams();
    },
  },
  methods: {
    checkBoxClicked(e) {
      const clonedSelectedStreamsObjectArray = Object.assign(
        {},
        this.selectedStreamsObjectArray
      );
      if (e.eventClickedOrUnClicked) {
        if (e.endpointClicked === e.clickedEndpointAndStreamId) {
          clonedSelectedStreamsObjectArray[
            e.endpointClicked
          ] = this.computedAccessInfoObjectArray[e.endpointClicked].map(opt => {
            return opt.streamId;
          });
          clonedSelectedStreamsObjectArray[e.endpointClicked].push(
            e.endpointClicked
          );
        } else {
          if (!clonedSelectedStreamsObjectArray[e.endpointClicked])
            clonedSelectedStreamsObjectArray[e.endpointClicked] = [];
          clonedSelectedStreamsObjectArray[e.endpointClicked].push(
            e.clickedEndpointAndStreamId
          );
        }
      } else {
        if (e.endpointClicked === e.clickedEndpointAndStreamId) {
          clonedSelectedStreamsObjectArray[e.endpointClicked] = [];
        } else {
          clonedSelectedStreamsObjectArray[
            e.endpointClicked
          ] = this.selectedStreamsObjectArray[e.endpointClicked].filter(
            endpointAndStreamId =>
              endpointAndStreamId != e.clickedEndpointAndStreamId
          );
        }
      }
      this.selectedStreamsObjectArray = Object.assign(
        {},
        clonedSelectedStreamsObjectArray
      );
    },
    displayStreams() {
      const customUserObjectArray = {};
      for (const [key, accessInfo] of Object.entries(this.access_info_map)) {
        customUserObjectArray[key] = [];
        const streams = this.streams_map[key];
        if (streams) {
          for (let i = 0; i < streams.length; i++) {
            const payload = {
              accessInfoName: accessInfo.name,
              accessInfoType: accessInfo.type,
              streamId: streams[i].id,
              streamName: streams[i].name,
            };
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
