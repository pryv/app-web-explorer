<template>
  <b-modal id="modal-scoped-event">
    <template v-slot:modal-header>
      <h5>Add a new event</h5>
    </template>
    <template v-slot:default>
      <label for="input-connection-list">Select connection</label>
      <b-form-input
        :value="selectedConnection"
        @input="setEndpoint"
        list="input-connection-list"
        id="input-connection-list-id"
      ></b-form-input>
      <b-form-datalist
        id="input-connection-list"
        :options="connectionNames"
      ></b-form-datalist>
      <label for="input-stream-list">Select Stream</label>
      <b-form-input
        v-model="selectedStream"
        list="input-stream-list"
        id="input-stream-list-id"
      ></b-form-input>
      <b-form-datalist
        id="input-stream-list"
        :options="streamNames"
      ></b-form-datalist>
    </template>
    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button @click="addEvent(ok)" size="sm" variant="success">
        OK
      </b-button>
      <b-button @click="cancel()" size="sm" variant="danger">
        Cancel
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "AddEventModal",
  data() {
    return {
      selectedConnection: null,
      selectedStream: null,
      selectedEndpoint : null,
      connectionLbl: "Select the Connection",
      type:"note/txt",
      content:null
    };
  },
  computed: {
    ...mapState(["connections_map"]),
    ...mapState(["access_info_map"]),
    ...mapState(["streams_map"]),
    connectionNames() {
      let result = Object.keys(this.access_info_map).map(key => {
        const payload = {
          "value" : this.access_info_map[key].name,
          "text" : key
        };
        return payload;
      });
      return result;
    },
    streamNames() {
      if (
        this.selectedConnection !== null &&
        this.selectedEndpoint !== null
      ) {
        const filteredObj = Object.keys(this.streams_map).filter(key => key === this.selectedEndpoint);
        const array = this.streams_map[filteredObj].map(obj => {
          const payload = {
            "value":obj.name,
            "text" : filteredObj
          };
          return payload;
        });
        return array;
      }
      return null;
    },
  },
  methods: {
    addEvent(ok) {
      console.log("connecitons map");
      console.log(this.access_info_map);
      console.log("streams_map");
      console.log(this.streams_map);
      if(this.selectedEndpoint === null)
        return;
      const connection = this.connections_map[this.selectedEndpoint];
      console.log("connection obj");
      console.log(connection);
      ok();
    },
    setEndpoint(value)
    {
      this.selectedConnection = value;
      const endpointObj = this.connectionNames.find(
              x => x.value === this.selectedConnection
      );
      this.selectedEndpoint = endpointObj.text;
    }
  },
};
</script>

<style scoped></style>
