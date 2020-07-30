<template>
  <div style="text-align: left;">
    <b-form-checkbox-group
      style="padding-left: 0;"
      id="flavors"
      class="ml-4"
      stacked
      v-model="selectedStreamsObjectArrayLocal"
    >
      <b-row class="px-3">
        <div cols="10">
          <b-form-checkbox
            :key="endpoint"
            :value="endpoint"
            @change="checkAll($event, endpoint, endpoint)"
            class="font-weight-bold main"
            >{{ accessInfoName }}
          </b-form-checkbox>
        </div>
        <div cols="2">
          <span :endpoint="endpoint" @click="viewAccessInfo(endpoint)">
            <b-icon-info-square-fill class="info-btn"> </b-icon-info-square-fill
          ></span>
        </div>
      </b-row>
      <b-form-checkbox
        v-for="stream in displayStreams"
        :key="stream.streamId"
        :value="stream.streamId"
        @change="checkAll($event, stream.streamId, endpoint)"
        >{{ stream.streamName }}
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
    accessInfoObject: {
      type: Array,
    },
    endpoint: {
      type: String,
    },
  },
  computed: {
    accessInfoName() {
      if (this.accessInfoObject && this.accessInfoObject[0]) {
        return this.accessInfoObject[0].accessInfoName;
      } else return "";
    },
    displayStreams: function() {
      return this.accessInfoObject.filter(i => i.streamName);
    },
    currentRouteName() {
      return this.$route.name;
    },
    selectedStreamsObjectArrayLocal: {
      get: function() {
        return this.selectedStreamsObjectArray;
      },
      set: function(value) {
        var payload={};
        payload["endpoint"] = this.endpoint;
        payload["streams"]  = value;
        this.$emit("selectedStreamsObjectArrayUpdate", payload);
      },
    },
  },
  methods: {
    checkAll(e, val, index) {
      var payload = {};
      payload["event"] = e;
      payload["value"] = val;
      payload["key"] = index;
      this.$emit("clickAll", payload);
    },
    viewAccessInfo(val) {
      if (this.currentRouteName != "Info") {
        this.$router.push("info");
      }
      this.$store.commit("SET_ACCESS_INFO", val);
    }
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
}

.main {
  padding-left: 0 !important;
}

.info-btn {
  float: right;
  margin-top: 0.2em;
  cursor: pointer;
}
</style>
