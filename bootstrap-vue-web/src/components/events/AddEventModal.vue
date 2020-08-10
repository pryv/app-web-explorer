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
      <label for="input-stream-list">Select Type</label>
      <b-form-input
        :value="selectedType"
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
import PryvInput from "../shared/PryvInput";
import Dropbox from "../shared/Dropbox";

export default {
  name: "AddEventModal",
  components: { Dropbox, PryvInput },
  data() {
    return {
      selectedConnection: null,
      selectedStream: null,
      selectedEndpoint: null,
      selectedType: null,
      selectedTypeObject: null,
      connectionLbl: "Select the Connection",
      type: "note/txt",
      content: null,
    };
  },
  computed: {
    ...mapState(["connectionsMap"]),
    ...mapState(["accessInfoMap"]),
    ...mapState(["streamsMap"]),
    ...mapState(["typesAll"]),
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
      if (this.selectedConnection !== null && this.selectedEndpoint !== null) {
        const filteredObj = Object.keys(this.streamsMap).filter(
          key => key === this.selectedEndpoint
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
      if (this.selectedTypeObject === null || !this.selectedTypeObject) return;
      if (
        this.selectedTypeObject.type === "string" &&
        this.selectedTypeObject.enum
      ) {
        const payload = {
          label: "Content",
          type: "enum",
          val: null,
          enum: this.selectedTypeObject.enum,
        };
        arr.push(payload);
      } else if (
        this.selectedTypeObject.type === "null" &&
        this.selectedTypeObject.attachmentRequired
      ) {
        const payload = {
          label: "Attachment",
          type: "attachment",
          val: null,
        };
        arr.push(payload);
      } else if (
        this.selectedTypeObject.type === "string" ||
        this.selectedTypeObject.type === "number"
      ) {
        const payload = {
          label: "content",
          type: this.selectedTypeObject.type,
          val: null,
        };
        arr.push(payload);
      } else if (
        this.selectedTypeObject.type === "object" ||
        this.selectedTypeObject.type === "array"
      ) {
        Object.keys(this.selectedTypeObject.properties).forEach(key => {
          const payload = {
            label: key,
            type: this.selectedTypeObject.properties[key].type,
            val: null,
          };
          arr.push(payload);
        });
      }
      return arr;
    },
  },
  methods: {
    async addEvent(ok) {
      if (this.selectedEndpoint === null) return;
      if (this.selectedStream === null) return;
      if (this.selectedTypeObject === null) return;

      const connection = this.connectionsMap[this.selectedEndpoint];
      try {
        const apiObj = CREATE_EVENT_API.CREATE_EVENT_API;
        let content = null;
        if (this.selectedTypeObject.type === "string") {
          content = this.contentNames[0].val;
        } else if (this.selectedTypeObject.type === "number") {
          content = +this.contentNames[0].val;
        } else if (
          this.selectedTypeObject.type === "object" ||
          this.selectedTypeObject.type === "array"
        ) {
          content = new Object();
          this.contentNames.forEach(obj => {
            let value = obj.type === "number" ? +obj.val : obj.val;
            content[obj.label] = value;
          });
        } else if (this.selectedTypeObject.type === "attachment") {
          content = null;
        }
        apiObj[0].params = {
          streamId: this.selectedStream,
          type: this.selectedType.toLowerCase(),
          content: content,
        };
        const result = await connection.api(apiObj);
        if (result && result[0] && result[0].error) {
          alert(result[0].error.id + " - " + result[0].error.message);
          this.clearForm();
          return;
        }
      } catch (e) {
        console.log("Error occurred when creating events" + e);
        return;
      }
      ok();
    },
    clearForm() {
      this.selectedEndpoint = null;
      this.selectedConnection = null;
      this.selectedStream = null;
      this.selectedType = null;
      this.selectedTypeObject = null;
    },
    setEndpoint(value) {
      this.selectedConnection = value;
      value
        ? (this.selectedEndpoint = this.connectionNames.find(
            x => x.value === this.selectedConnection
          ).text)
        : (this.selectedEndpoint = value);
    },
    setTypeObject(value) {
      this.selectedType = value;
      value
        ? (this.selectedTypeObject = this.typesAll[this.selectedType])
        : (this.selectedTypeObject = null);
    },
    updateValue(obj, value) {
      obj.val = value;
    },
  },
};
</script>

<style scoped></style>
