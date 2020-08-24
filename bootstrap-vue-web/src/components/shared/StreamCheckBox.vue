<template>
  <b-col cols="12">
    <b-form-checkbox-group
      id="flavors"
      class="pl-0"
      stacked
      v-model="selectedStreamsObjectArrayLocal"
    >
      <b-row class="border-access">
        <b-col cols="2">
          <span v-b-toggle="`${endpoint}`">
            <b-icon
              icon="arrow-down-square-fill"
              class="when-closed"
              font-scale="1"
            ></b-icon>
            <b-icon
              icon="arrow-up-square-fill"
              class="when-opened"
              variant="danger"
              font-scale="1"
            ></b-icon>
          </span>
        </b-col>
        <b-col cols="8">
          <b-form-checkbox
            :key="endpoint"
            :value="endpoint"
            @change="checkBoxClicked($event, endpoint, endpoint)"
            class="font-weight-bold main text-left access_font"
            @click.stop
            >{{ accessInfoName }}
          </b-form-checkbox>
        </b-col>
        <b-col cols="2">
          <span :endpoint="endpoint" @click="viewAccessInfoFunc(endpoint)">
            <b-icon-info-square-fill variant="secondary" class="info-btn">
            </b-icon-info-square-fill
          ></span>
        </b-col>
        <b-col cols="12">
          <b-collapse :id="`${endpoint}`" class="mt-2" visible>
            <b-card>
              <RecursiveCheckbox
                :endpoint="endpoint"
                @viewStreamInfo="viewStreamInfoFunc"
                @checkBoxClicked="$emit('checkBoxClicked', $event)"
                :displayStreams="displayStreams"
              ></RecursiveCheckbox>
            </b-card>
          </b-collapse>
        </b-col>
      </b-row>
    </b-form-checkbox-group>
  </b-col>
</template>

<script>
import { mapState } from "vuex";
import RecursiveCheckbox from "./RecursiveCheckbox";
export default {
  name: "StreamCheckBox",
  components: { RecursiveCheckbox },
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
    ...mapState(["streamsMap"]),
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
    viewStreamInfoObj: {
      get() {
        return this.$store.state.viewStreamInfoObj;
      },
      set(value) {
        this.$store.commit("UPDATE_STREAM_INFO_OBJ", value);
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
      if (this.currentRouteName !== "Info") {
        this.$router.push("info");
      }
      this.viewAccessInfo = endpoint;
    },
    viewStreamInfoFunc(payload) {
      let streamId = payload.streamId;
      let endpoint = payload.endpoint;
      const obj = {
        endpoint: endpoint,
        id: streamId,
      };
      this.viewStreamInfo = obj;
      this.viewStreamInfoObj = this.streamsMap[obj.endpoint].find(
        key => key.id === this.viewStreamInfo.id
      );
      if (this.currentRouteName !== "Stream") {
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
  padding-left: 0 !important;
  margin-bottom: 0;
  vertical-align: middle;
  font-size: 0.75rem !important;
  width: auto;
}

.custom-control {
  padding-left: 0 !important;
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

.trashed {
  color: gray;
  font-weight: bold;
}

.not-trashed {
  color: black;
  font-weight: bold;
}

.card-body {
  padding-left: 0.125rem;
  padding-right: 0.125rem;
  padding-top: 0.3rem;
  padding-bottom: 0.125rem;
}
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
.border-access {
  padding-top: 2%;
  padding-bottom: 2%;
  border-width: unset;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  margin-bottom: 2%;
  border-radius: 4px;
}
</style>