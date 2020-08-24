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
    displayAllInitial() {
      Object.keys(this.accessInfo).forEach(apiEndpoint => {
        const payload = {
          eventClickedOrUnClicked: true,
          clickedEndpointAndStreamId: apiEndpoint,
          endpointClicked: apiEndpoint,
        };
        this.checkBoxClicked(payload);
      });
    },
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
          clonedSelectedStreamsObjectArray[e.endpointClicked].forEach(obj => {
            const stream = this.streamsMap[e.endpointClicked].filter(
              key => key.id === obj
            );
            this.selectChildStreams(
              stream[0],
              clonedSelectedStreamsObjectArray,
              e.endpointClicked
            );
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
          const stream = this.streamsMap[e.endpointClicked].filter(
            key => key.id === e.clickedEndpointAndStreamId
          );
          this.selectChildStreams(
            stream[0],
            clonedSelectedStreamsObjectArray,
            e.endpointClicked
          );
        }
      } else {
        if (e.endpointClicked === e.clickedEndpointAndStreamId) {
          clonedSelectedStreamsObjectArray[e.endpointClicked] = [];
        } else {
          clonedSelectedStreamsObjectArray[
            e.endpointClicked
          ] = clonedSelectedStreamsObjectArray[e.endpointClicked].filter(
            endpointAndStreamId => {
              return endpointAndStreamId !== e.clickedEndpointAndStreamId;
            }
          );
          const stream = this.streamsMap[e.endpointClicked].filter(
            key => key.id === e.clickedEndpointAndStreamId
          );
          this.unselectChildStreams(
            stream[0],
            clonedSelectedStreamsObjectArray,
            e.endpointClicked
          );
        }
      }
      this.selectedStreamsMap = clonedSelectedStreamsObjectArray;
    },
    selectChildStreams(stream, clonedSelectedStreamsObjectArray, endpoint) {
      if (!stream.children) return;
      stream.children.forEach(child => {
        clonedSelectedStreamsObjectArray[endpoint].push(child.id);
        if (child.children && child.children.length > 0)
          this.selectChildStreams(
            child,
            clonedSelectedStreamsObjectArray,
            endpoint
          );
      });
    },
    unselectChildStreams(stream, clonedSelectedStreamsObjectArray, endpoint) {
      if (!stream.children) return;
      const childIds = stream.children.map(key => key.id);
      clonedSelectedStreamsObjectArray[
        endpoint
      ] = clonedSelectedStreamsObjectArray[endpoint].filter(
        selectedStreamId => !childIds.includes(selectedStreamId)
      );
      stream.children.forEach(child => {
        if (child.children && child.children.length > 0)
          this.unselectChildStreams(
            child,
            clonedSelectedStreamsObjectArray,
            endpoint
          );
      });
    },
    displayStreams() {
      const customUserObjectArray = {};
      for (const [key, accessInfo] of Object.entries(this.accessInfoMap)) {
        customUserObjectArray[key] = [];
        const streams = this.streamsMap[key];
        if (streams) {
          for (let i = 0; i < streams.length; i++) {
            if (!streams[i].parentId || streams[i].parentId === null) {
              customUserObjectArray[key].push(
                this.createPayload(accessInfo, streams[i])
              );
            }
          }
        }
      }
      this.accessInfo = customUserObjectArray;
      this.displayAllInitial();
    },
    createPayload(accessInfo, stream) {
      const payload = {
        accessInfoName: accessInfo.name,
        accessInfoType: accessInfo.type,
        streamId: stream.id,
        streamName: stream.name,
        trashed: stream.trashed,
      };
      if (stream.children && stream.children.length > 0) {
        let children = [];
        stream.children.forEach(childStream =>
          children.push(this.createPayload(accessInfo, childStream))
        );
        payload["children"] = children;
      }
      return payload;
    },
    setSelectedStreamsMapUpdate(payload) {
      this.selectedStreamsMap[payload.endpoint] = payload.streams;
    },
  },
};
</script>