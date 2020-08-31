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
      const clonedSelectedStreams = Object.assign({}, this.selectedStreamsMap);
      if (e.eventClickedOrUnClicked) {
        if (e.endpointClicked === e.clickedEndpointAndStreamId) {
          clonedSelectedStreams[
            e.endpointClicked
          ] = this.computedAccessInfoObjectArray[e.endpointClicked].map(opt => {
            return opt.streamId;
          });
          clonedSelectedStreams[e.endpointClicked].forEach(obj => {
            const stream = this.streamsMap[e.endpointClicked].filter(
              key => key.id === obj
            );
            this.selectChildStreams(
              stream[0],
              clonedSelectedStreams,
              e.endpointClicked
            );
          });
          clonedSelectedStreams[e.endpointClicked].push(e.endpointClicked);
        } else {
          if (!clonedSelectedStreams[e.endpointClicked])
            clonedSelectedStreams[e.endpointClicked] = [];
          clonedSelectedStreams[e.endpointClicked].push(
            e.clickedEndpointAndStreamId
          );
          const stream = this.streamsMap[e.endpointClicked].filter(
            key => key.id === e.clickedEndpointAndStreamId
          );
          this.selectChildStreams(
            stream[0],
            clonedSelectedStreams,
            e.endpointClicked
          );
        }
      } else {
        if (e.endpointClicked === e.clickedEndpointAndStreamId) {
          clonedSelectedStreams[e.endpointClicked] = [];
        } else {
          clonedSelectedStreams[e.endpointClicked] = clonedSelectedStreams[
            e.endpointClicked
          ].filter(endpointAndStreamId => {
            return endpointAndStreamId !== e.clickedEndpointAndStreamId;
          });
          const stream = this.streamsMap[e.endpointClicked].filter(
            key => key.id === e.clickedEndpointAndStreamId
          );
          this.unselectChildStreams(
            stream[0],
            clonedSelectedStreams,
            e.endpointClicked
          );
        }
      }
      this.selectedStreamsMap = clonedSelectedStreams;
    },
    selectChildStreams(stream, clonedSelectedStreams, endpoint) {
      if (!stream.children) return;
      stream.children.forEach(child => {
        clonedSelectedStreams[endpoint].push(child.id);
        let childObj = this.streamsMap[endpoint].filter(
          stream => child.id === stream.id
        );
        this.selectChildStreams(childObj[0], clonedSelectedStreams, endpoint);
      });
    },
    unselectChildStreams(stream, clonedSelectedStreams, endpoint) {
      if (!stream.children) return;
      const childIds = stream.children.map(key => key.id);
      clonedSelectedStreams[endpoint] = clonedSelectedStreams[endpoint].filter(
        selectedStreamId => !childIds.includes(selectedStreamId)
      );
      stream.children.forEach(child => {
        let childObj = this.streamsMap[endpoint].filter(
          stream => child.id === stream.id
        );
        this.unselectChildStreams(childObj[0], clonedSelectedStreams, endpoint);
      });
    },
    displayStreams() {
      const customUserMap = {};
      for (const [key, accessInfo] of Object.entries(this.accessInfoMap)) {
        customUserMap[key] = [];
        const streams = this.streamsMap[key];
        if (streams) {
          for (let i = 0; i < streams.length; i++) {
            if (!streams[i].parentId || streams[i].parentId === null) {
              customUserMap[key].push(
                this.createPayload(accessInfo, streams[i], key)
              );
            }
          }
        }
      }
      this.accessInfo = customUserMap;
      this.displayAllInitial();
    },
    createPayload(accessInfo, stream, key) {
      const payload = {
        accessInfoName: accessInfo.name,
        accessInfoType: accessInfo.type,
        streamId: stream.id,
        streamName: stream.name,
        trashed: stream.trashed,
      };
      if (stream.children && stream.children.length > 0) {
        let children = [];
        stream.children.forEach(childStream => {
          let childObj = this.streamsMap[key].filter(
            stream => childStream.id === stream.id
          );
          if (childObj.length > 0)
            children.push(this.createPayload(accessInfo, childObj[0], key));
        });
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