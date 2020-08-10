<template>
  <div>
    <b-form-group>
      <StreamCheckBox
        v-for="(streamObjectArray, endpoint) in computedAccessInfoObjectArray"
        :key="endpoint"
        :streamObjectArray="streamObjectArray"
        :endpoint="endpoint"
        :selectedStreamsObjectArray="selectedStreamsMap[endpoint]"
        @checkBoxClicked="checkBoxClicked"
        @selectedStreamsMapUpdate="setSelectedStreamsMapUpdate"
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
      accessInfo: {},
    };
  },
  computed: {
    ...mapState(["streamsMap"]),
    ...mapState(["accessInfoMap"]),
    selectedStreamsMap: {
      get() {
        return this.$store.state.selectedStreams;
      },
      set(value) {
        this.$store.commit("UPDATE_SELECTED_ENDPOINTS", value);
      },
    },
    computedAccessInfoObjectArray() {
      return this.accessInfo;
    },
  },
  watch: {
    streamsMap() {
      this.displayStreams();
    },
    accessInfoMap() {
      this.displayStreams();
    },
  },
  methods: {
    checkBoxClicked(e) {
      const clonedSelectedStreamsObjectArray = Object.assign(
        {},
        this.selectedStreamsMap
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
          ] = this.selectedStreamsMap[e.endpointClicked].filter(
            endpointAndStreamId =>
              endpointAndStreamId !== e.clickedEndpointAndStreamId
          );
        }
      }
      this.selectedStreamsMap = clonedSelectedStreamsObjectArray;
    },
    displayStreams() {
      const customUserObjectArray = {};
      for (const [key, accessInfo] of Object.entries(this.accessInfoMap)) {
        customUserObjectArray[key] = [];
        const streams = this.streamsMap[key];
        if (streams) {
          for (let i = 0; i < streams.length; i++) {
            const payload = {
              accessInfoName: accessInfo.name,
              accessInfoType: accessInfo.type,
              streamId: streams[i].id,
              streamName: streams[i].name,
              trashed : streams[i].trashed,
            };
            customUserObjectArray[key].push(payload);
          }
        }
      }
      this.accessInfo = customUserObjectArray;
    },
    setSelectedStreamsMapUpdate(payload) {
      this.selectedStreamsMap[payload.endpoint] = payload.streams;
    },
  },
};
</script>