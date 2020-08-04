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
import CREATE_EVENT_API from "../../utilities/api";
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
    ...mapState(["connectionsMap"]),
    ...mapState(["accessInfoMap"]),
    ...mapState(["streamsMap"]),
    connectionNames() {
      let result = Object.keys(this.accessInfoMap).map(key => {
        const payload = {
          "value" : this.accessInfoMap[key].name,
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
        const filteredObj = Object.keys(this.streamsMap).filter(key => key === this.selectedEndpoint);
        const array = this.streamsMap[filteredObj].map(obj => {
          const payload = {
            "value":obj.id,
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
    async addEvent(ok) {
      if(this.selectedEndpoint === null)
        return;
      const connection = this.connectionsMap[this.selectedEndpoint];
      try {
        const apiObj =  CREATE_EVENT_API.CREATE_EVENT_API;
        apiObj[0].params = {"streamId": this.selectedStream, "type": this.type, "content": this.content}
        const result = await connection.api(apiObj);
        if (result && result[0] && result[0].error)
        {
          alert(result[0].error.id + " - "+ result[0].error.message)
          this.clearForm();
          return
        }
      } catch (e) {
        console.log("Error occurred when creating events" + e);
        return;
      }
      ok();
    },
    clearForm()
    {
      this.selectedEndpoint = null;
      this.selectedConnection = null;
      this.selectedStream = null;
    },
    setEndpoint(value)
    {
      this.selectedConnection = value
      if(value)
      {
        const endpointObj = this.connectionNames.find(
                x => x.value === this.selectedConnection
        );
        this.selectedEndpoint = endpointObj.text;
      }
      else
        this.selectedEndpoint = value;

    }
  },
};
</script>

<style scoped></style>
