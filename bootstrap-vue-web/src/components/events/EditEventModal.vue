<template>
  <b-modal :id="data.id">
    <template v-slot:modal-header>
      <h5>Edit event - {{ data.id }}</h5>
    </template>
    <template v-slot:default>
      <label for="input-connection-list">Connection</label>
      <b-form-input
        :value="selectedConnectionComputed"
        disabled
        list="input-connection-list"
        id="input-connection-list-id"
      ></b-form-input>
      <label for="input-stream-list">Select Stream</label>
      <b-form-input
        v-model="selectedStreamComputed"
        list="input-stream-list"
        id="input-stream-list-id"
      ></b-form-input>
      <b-form-datalist
        id="input-stream-list"
        :options="streamNames"
      ></b-form-datalist>
      <label for="input-stream-list">Select Type</label>
      <b-form-input
        :value="selectedTypeComputed"
        @input="setTypeObject"
        list="input-type-list"
        id="input-type-list-id"
      ></b-form-input>
      <b-form-datalist
        id="input-type-list"
        :options="typeNames"
      ></b-form-datalist>
      <div
        :key="`attr-${index}`"
        v-for="(obj, index) in contentNames"
        class="mt-2"
      >
        <label>{{ obj.label }}</label>
        <Dropbox
          v-if="obj.type === 'enum'"
          :options="obj.enum"
          :valueSelected="obj.val"
          @input="updateValue(obj, $event)"
          style="font-size: 1rem;"
        >
        </Dropbox>
        <b-form-group :value="obj.val" v-else-if="obj.type === 'attachment'">
          <b-form-file
            @input="updateValue(obj, $event)"
            id="file-small"
            size="sm"
          ></b-form-file>
        </b-form-group>
        <PryvInput
          v-else
          :type="obj.type === 'string' ? 'text' : obj.type"
          :value="obj.val"
          :id="obj.label"
          :placeholder="obj.type"
          @textInput="updateValue(obj, $event)"
        ></PryvInput>
      </div>
    </template>
    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button @click="editEvent(ok)" size="sm" variant="success">
        OK
      </b-button>
      <b-button @click="cancelEdit(cancel)" size="sm" variant="danger">
        Cancel
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapState } from "vuex";
import UPDATE_EVENT_API from "../../utilities/api";
import PryvInput from "../shared/PryvInput";
import Dropbox from "../shared/Dropbox";

export default {
  name: "EditEventModal",
  components: { Dropbox, PryvInput },
  props: {
    data: { type: Object, required: true, default: null },
  },
  data() {
    return {
      connectionLbl: "Select the Connection",
      selectedConnection: null,
      selectedEndpoint: null,
      selectedStream: null,
      selectedType: null,
      selectedTypeObject: null,
      type: "note/txt",
    };
  },
  computed: {
    ...mapState(["connectionsMap"]),
    ...mapState(["accessInfoMap"]),
    ...mapState(["streamsMap"]),
    ...mapState(["typesAll"]),
    selectedConnectionComputed: {
      get() {
        return this.selectedConnection
          ? this.selectedConnection
          : this.accessInfoMap[this.data.apiEndpoint].name;
      },
      set(value) {
        this.selectedConnection = value;
      },
    },
    selectedEndpointComputed: {
      get() {
        return this.selectedEndpoint
          ? this.selectedEndpoint
          : this.data.apiEndpoint;
      },
      set(value) {
        this.selectedEndpoint = value;
      },
    },
    selectedStreamComputed: {
      get() {
        return this.selectedStream ? this.selectedStream : this.data.streamId;
      },
      set(value) {
        this.selectedStream = value;
      },
    },
    selectedTypeComputed: {
      get() {
        return this.selectedType ? this.selectedType : this.data.type;
      },
      set(value) {
        this.selectedType = value;
      },
    },
    selectedTypeObjectComputed: {
      get() {
        return this.selectedTypeObject
          ? this.selectedTypeObject
          : this.typesAll[this.selectedTypeComputed];
      },
      set(value) {
        this.selectedTypeObject = value;
      },
    },
    connectionNames() {
      let result = Object.keys(this.accessInfoMap).map(key => {
        const payload = {
          value: this.accessInfoMap[key].name,
          text: key,
        };
        return payload;
      });
      return result;
    },
    streamNames() {
      if (
        this.selectedConnectionComputed !== null &&
        this.selectedEndpointComputed !== null
      ) {
        const filteredObj = Object.keys(this.streamsMap).filter(
          key => key === this.selectedEndpointComputed
        );
        const array = this.streamsMap[filteredObj].map(obj => {
          const payload = {
            value: obj.id,
            text: filteredObj,
          };
          return payload;
        });
        return array;
      }
      return null;
    },
    typeNames() {
      return Object.keys(this.typesAll).map(key => {
        const payload = {
          value: key,
          text: this.typesAll[key].type,
        };
        return payload;
      });
    },
    contentNames() {
      var arr = [];
      if (
        this.selectedTypeObjectComputed === null ||
        !this.selectedTypeObjectComputed
      )
        return;
      if (
        this.selectedTypeObjectComputed.type === "string" &&
        this.selectedTypeObjectComputed.enum
      ) {
        const payload = {
          label: "Content",
          type: "enum",
          val: this.data.content,
          enum: this.selectedTypeObjectComputed.enum,
        };
        alert("enum");
        arr.push(payload);
      } else if (
        this.selectedTypeObjectComputed.type === "null" &&
        this.selectedTypeObjectComputed.attachmentRequired
      ) {
        const payload = {
          label: "Attachment",
          type: "attachment",
          val: null,
        };
        alert("attachemnt");
        arr.push(payload);
      } else if (this.selectedTypeObjectComputed.type === "string") {
        const payload = {
          label: "content",
          type: this.selectedTypeObjectComputed.type,
          val: this.data.content.toString(),
        };
        alert("string");
        arr.push(payload);
      } else if (this.selectedTypeObjectComputed.type === "number") {
        const payload = {
          label: "content",
          type: this.selectedTypeObjectComputed.type,
          val: this.data.content.toString(),
        };
        arr.push(payload);
      } else if (
        this.selectedTypeObjectComputed.type === "object" ||
        this.selectedTypeObjectComputed.type === "array"
      ) {
        Object.keys(this.selectedTypeObjectComputed.properties).forEach(key => {
          const payload = {
            label: key,
            type: this.selectedTypeObjectComputed.properties[key].type,
            val: this.data.content[key].toString(),
          };
          arr.push(payload);
        });
      }
      return arr;
    },
    eventsMap: {
      get() {
        return this.$store.state.eventsMap;
      },
      set(value) {
        this.$store.commit("UPDATE_EVENTS_MAP", value);
      },
    },
  },
  methods: {
    async editEvent(ok) {
      const obj = {};
      if (this.data.streamId !== this.selectedStreamComputed)
        obj["streamId"] = this.selectedStreamComputed;
      /*if(this.data.type !== this.selectedTypeComputed)
        obj["type"] = this.selectedTypeComputed
      */
      console.log("edit obj");
      console.log(obj);
      const connection = this.connectionsMap[this.selectedEndpointComputed];
      try {
        const apiObj = UPDATE_EVENT_API.UPDATE_EVENT_API;
        /*let content = null;
        if (this.selectedTypeObjectComputed.type === "string") {
          content = this.contentNames[0].val;
        } else if (this.selectedTypeObjectComputed.type === "number") {
          content = +this.contentNames[0].val;
        } else if (
          this.selectedTypeObjectComputed.type === "object" ||
          this.selectedTypeObjectComputed.type === "array"
        ) {
          content = new Object();
          this.contentNames.forEach(obj => {
            let value = obj.type === "number" ? +obj.val : obj.val;
            content[obj.label] = value;
          });
        } else if (this.selectedTypeObjectComputed.type === "attachment") {
          content = null;
        }*/
        apiObj[0].params = {
          id: this.data.id,
          update: obj,
        };
        const result = await connection.api(apiObj);
        if (result && result[0] && result[0].error) {
          alert(result[0].error.id + " - " + result[0].error.message);
          this.clearForm();
          return;
        }
        this.addEventsToStore(connection, result[0].event);
      } catch (e) {
        console.log("Error occurred when creating events" + e);
        return;
      }
      this.clearForm();
      ok();
    },
    async addEventsToStore(endpoint, event) {
      const clonedEvents = Object.assign({}, this.eventsMap);
      const editedEventIndex = clonedEvents[this.data.apiEndpoint].findIndex(
        key => key.id === event.id
      );
      clonedEvents[this.data.apiEndpoint][editedEventIndex] = event;
      this.eventsMap = clonedEvents;
    },
    clearForm() {
      this.selectedEndpoint = this.data.apiEndpoint;
      this.selectedConnection = this.accessInfoMap[this.data.apiEndpoint].name;
      this.selectedStream = this.data.streamId;
      this.selectedType = this.data.type;
      this.selectedTypeObject = this.typesAll[this.selectedType];
    },
    setEndpoint(value) {
      this.selectedConnectionComputed = value;
      value
        ? (this.selectedEndpointComputed = this.connectionNames.find(
            x => x.value === this.selectedConnectionComputed
          ).text)
        : (this.selectedEndpointComputed = value);
    },
    setTypeObject(value) {
      this.selectedTypeComputed = value;
      value
        ? (this.selectedTypeObjectComputed = this.typesAll[
            this.selectedTypeComputed
          ])
        : (this.selectedTypeObjectComputed = null);
    },
    updateValue(obj, value) {
      obj.val = value;
    },
    cancelEdit(cancel) {
      this.clearForm();
      cancel();
    },
  },
};
</script>

<style scoped></style>
