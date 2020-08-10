<template>
  <div class="text-left">
    <b-form-checkbox-group
      id="flavors"
      class="ml-4 pl-0"
      stacked
      v-model="selectedStreamsObjectArrayLocal"
    >
      <b-row class="px-3">
        <div cols="10">
          <b-form-checkbox
            :key="endpoint"
            :value="endpoint"
            @change="checkBoxClicked($event, endpoint, endpoint)"
            class="font-weight-bold main"
            @click.stop
            >{{ accessInfoName }}
          </b-form-checkbox>
        </div>
        <div cols="2">
          <span :endpoint="endpoint" @click="viewAccessInfoFunc(endpoint)">
            <b-icon-info-square-fill class="info-btn"> </b-icon-info-square-fill
          ></span>
        </div>
      </b-row>
      <b-form-checkbox
        v-for="stream in displayStreams"
        :key="stream.streamId"
        :value="stream.streamId"
        @change="checkBoxClicked($event, stream.streamId, endpoint)"
        >{{ stream.streamName
        }}<span :endpoint="endpoint">
          <b-icon-pencil-square
            @click="viewStreamInfoFunc(stream.streamId, endpoint, $event)"
            class="pencil-btn"
          >
          </b-icon-pencil-square
        ></span>
      </b-form-checkbox>
    </b-form-checkbox-group>
  </div>
</template>

<script>
export default {
  name: "StreamCheckBox",
  props: {
    selectedStreamsObjectArray: {
      type: Array,
    },
    streamObjectArray: {
      type: Array,
    },
    endpoint: {
      type: String,
    },
  },
  computed: {
    accessInfoName() {
      if (this.streamObjectArray && this.streamObjectArray[0]) {
        return this.streamObjectArray[0].accessInfoName;
      } else return "";
    },
    displayStreams: function() {
      return this.streamObjectArray.filter(e => e.streamName);
    },
    currentRouteName() {
      return this.$route.name;
    },
    selectedStreamsObjectArrayLocal: {
      get: function() {
        return this.selectedStreamsObjectArray;
      },
      set: function(value) {
        const payload = {
          endpoint: this.endpoint,
          streams: value,
        };
        this.$emit("selectedStreamsMapUpdate", payload);
      },
    },
    viewAccessInfo: {
      get() {
        return this.$store.state.viewAccessInfo;
      },
      set(value) {
        this.$store.commit("SET_ACCESS_INFO", value);
      },
    },
    viewStreamInfo: {
      get() {
        return this.$store.state.viewStreamInfo;
      },
      set(value) {
        this.$store.commit("SET_STREAM_INFO", value);
      },
    },
  },
  methods: {
    checkBoxClicked(e, value, index) {
      const payload = {
        eventClickedOrUnClicked: e,
        clickedEndpointAndStreamId: value,
        endpointClicked: index,
      };
      this.$emit("checkBoxClicked", payload);
    },
    viewAccessInfoFunc(endpoint) {
      if (this.currentRouteName != "Info") {
        this.$router.push("info");
      }
      this.viewAccessInfo = endpoint;
    },
    viewStreamInfoFunc(streamId, endpoint, event) {
      event.preventDefault()
      const obj = {
        endpoint: endpoint,
        id: streamId,
      };
      this.viewStreamInfo = obj;
      if (this.currentRouteName != "Stream") {
        this.$router.push("stream");
      }
    },
  },
};
</script>
<style>
.custom-checkbox .custom-control-label::before {
  border-radius: 0rem;
}

.custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: gray;
  background-color: gainsboro;
}

.custom-checkbox
  .custom-control-input:indeterminate
  ~ .custom-control-label::before {
  border-color: gray;
  background-color: gainsboro;
}

.custom-control-label {
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  display: inline-block;
  padding: 2px 6px;
  padding-left: 0 !important;
  margin-bottom: 0;
  vertical-align: middle;
  margin-left: -2%;
  font-size: 0.75rem !important;
  width: 150px;
}

.main {
  padding-left: 0 !important;
}

.info-btn {
  float: right;
  margin-top: 0.2em;
  cursor: pointer;
}

.pencil-btn {
  float: right;
  margin-top: 0.2em;
  cursor: pointer;
  margin-left: 5%;
}
</style>
