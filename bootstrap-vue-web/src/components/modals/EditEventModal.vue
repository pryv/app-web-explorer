<template>
  <b-modal :id="data.id" @hidden="resetModal" @ok="handleOk" @show="resetModal">
    <template v-slot:modal-header>
      <h5>Edit event - {{ data.id }}</h5>
    </template>
    <template v-slot:default>
      <form :ref="data.id" @submit.stop.prevent="handleSubmit">
        <b-form-group label="Connection *" label-for="input-connection">
          <b-form-input
            :value="selectedConnectionComputed"
            disabled
            id="input-connection"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Stream *"
          label-for="input-stream"
          invalid-feedback="Stream is required"
          :state="streamState"
        >
          <b-form-input
            :value="selectedStreamComputed"
            placeholder="Select a stream"
            @input="setStream"
            list="input-stream-list"
            id="input-stream"
            required
            :state="streamState"
            autocomplete="off"
          ></b-form-input>
          <b-form-datalist
            id="input-stream-list"
            :options="streamNames"
          ></b-form-datalist>
        </b-form-group>
        <b-form-group
          label="Type *"
          label-for="input-type"
          invalid-feedback="Type is required"
          :state="typeState"
        >
          <b-form-input
            :value="selectedTypeComputed"
            @input="setTypeObject"
            list="input-type-list"
            id="input-type"
            required
            :state="typeState"
            placeholder="Select a type"
            autocomplete="off"
          ></b-form-input>
          <b-form-datalist
            id="input-type-list"
            :options="typeNames"
          ></b-form-datalist>
        </b-form-group>
        <div
          :key="`attr-${index}`"
          v-for="(obj, index) in contentNames"
          class="mt-2"
        >
          <b-form-group
            :label="obj.label"
            :label-for="obj.labelFor"
            :invalid-feedback="obj.feedback"
            :state="contentStates[index]"
          >
            <Dropbox
              v-if="obj.type === 'enum'"
              :options="obj.enum"
              :valueSelected="obj.val"
              @input="updateValue(obj, $event)"
              style="font-size: 1rem;"
              :id="obj.labelFor"
              :required="obj.required"
              :state="contentStates[index]"
            >
            </Dropbox>
            <b-form-file
              :value="obj.val"
              v-else-if="obj.type === 'attachment'"
              @input="updateValue(obj, $event)"
              size="sm"
              :id="obj.labelFor"
              :required="obj.required"
              :state="contentStates[index]"
            ></b-form-file>
            <b-form-input
              v-else
              :type="obj.type === 'string' ? 'text' : obj.type"
              :value="obj.val"
              :id="obj.labelFor"
              :placeholder="obj.type"
              @input="updateValue(obj, $event)"
              :required="obj.required"
              :state="contentStates[index]"
            ></b-form-input>
          </b-form-group>
        </div>
        <b-form-group label="Time" label-for="input-time">
          <b-form-input
            type="text"
            v-model="selectedTimeComputed"
            id="input-time"
            placeholder="Enter Time"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Duration" label-for="input-duration">
          <b-form-input
            type="text"
            v-model="selectedDurationComputed"
            id="input-duration"
            placeholder="Enter Duration"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Description" label-for="input-description">
          <b-form-input
            type="text"
            v-model="selectedDescriptionComputed"
            id="input-description"
            placeholder="Enter Description"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Client Data" label-for="input-client-data">
          <v-jsoneditor
            v-model="selectedClientDataComputed"
            height="200px"
            :plus="false"
            :options="{
              enableTransform: false,
              enableSort: false,
              statusBar: false,
              mainMenuBar: true,
              search: false,
              navigationBar: false,
              mode: 'code',
            }"
          ></v-jsoneditor>
        </b-form-group>
      </form>
    </template>
    <template v-slot:modal-footer="{ ok, cancel }">
      <PryvBtn
        @click="handleOk"
        class="mt-0 float-right"
        content="OK"
        icon="check"
        type="submit"
        variant="success"
      ></PryvBtn>
      <PryvBtn
        @click="cancelEdit(cancel)"
        class="mt-0 float-right"
        content="Cancel"
        icon="x"
      ></PryvBtn>
    </template>
  </b-modal>
</template>

<script>
import { mapState } from "vuex";
import UPDATE_EVENT_API from "../../utilities/api";
import Dropbox from "../shared/Dropbox";
import PryvBtn from "../shared/PryvBtn";
export default {
  name: "EditEventModal",
  components: { Dropbox, PryvBtn },
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
      streamState: null,
      typeState: null,
      contentStatesCheck: [],
      contentObjs: null,
      selectedTime: null,
      selectedDuration: null,
      selectedDescription: null,
      clientData: null,
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
    selectedTimeComputed: {
      get() {
        return this.selectedTime ? this.selectedTime : this.data.time;
      },
      set(value) {
        this.selectedTime = value;
      },
    },
    selectedDurationComputed: {
      get() {
        return this.selectedDuration
          ? this.selectedDuration
          : this.data.duration;
      },
      set(value) {
        this.selectedDuration = value;
      },
    },
    selectedDescriptionComputed: {
      get() {
        return this.selectedDescription
          ? this.selectedDescription
          : this.data.description;
      },
      set(value) {
        this.selectedDescription = value;
      },
    },
    selectedClientDataComputed: {
      get() {
        return this.clientData ? this.clientData : this.data.clientData;
      },
      set(value) {
        this.clientData = value;
      },
    },
    connectionNames() {
      return Object.keys(this.accessInfoMap).map(key => ({
        value: this.accessInfoMap[key].name,
        text: key,
      }));
    },
    streamNames() {
      if (
        this.selectedConnectionComputed !== null &&
        this.selectedEndpointComputed !== null
      ) {
        const filteredObj = Object.keys(this.streamsMap).filter(
          key => key === this.selectedEndpointComputed
        );
        return this.streamsMap[filteredObj].map(obj => ({
          value: obj.id,
          text: filteredObj,
        }));
      }
      return null;
    },
    typeNames() {
      return Object.keys(this.typesAll).map(key => ({
        value: key,
        text: this.typesAll[key].type,
      }));
    },
    contentStates() {
      if (this.contentStatesCheck.length === 0) {
        const arr = [];
        for (let i = 0; i < this.contentNames.length; i++) {
          arr.push(null);
        }
        return arr;
      } else {
        return this.contentStatesCheck;
      }
    },
    contentNames() {
      const arr = [];
      if (
        this.selectedTypeObjectComputed === null ||
        !this.selectedTypeObjectComputed
      )
        return;
      if (this.data.type !== this.selectedTypeComputed) {
        if (
          this.selectedTypeObjectComputed.type === "string" &&
          this.selectedTypeObjectComputed.enum
        ) {
          const payload = {
            label: `Content ${
              this.selectedTypeObjectComputed.required ? "*" : ""
            }`,
            type: "enum",
            val: null,
            enum: this.selectedTypeObjectComputed.enum,
            required: !!this.selectedTypeObjectComputed.required,
            labelFor: "input-content-Content",
            feedback: "Content is required",
          };
          arr.push(payload);
        } else if (
          this.selectedTypeObjectComputed.type === "null" &&
          this.selectedTypeObjectComputed.attachmentRequired
        ) {
          const payload = {
            label: "Attachment",
            type: "attachment",
            val: null,
            required: !!this.selectedTypeObjectComputed.required,
            labelFor: "input-content-Attachment",
            feedback: "Attachment is required",
          };
          arr.push(payload);
        } else if (this.selectedTypeObjectComputed.type === "string") {
          const payload = {
            label: `Content ${
              this.selectedTypeObjectComputed.required ? "*" : ""
            }`,
            type: this.selectedTypeObjectComputed.type,
            val: null,
            required: !!this.selectedTypeObjectComputed.required,
            labelFor: "input-content-Content",
            feedback: "Content is required",
          };
          arr.push(payload);
        } else if (this.selectedTypeObjectComputed.type === "number") {
          const payload = {
            label: `Content ${
              this.selectedTypeObjectComputed.required ? "*" : ""
            }`,
            type: this.selectedTypeObjectComputed.type,
            val: null,
            required: !!this.selectedTypeObjectComputed.required,
            labelFor: "input-content-Content",
            feedback: "Content is required",
          };
          arr.push(payload);
        } else if (
          this.selectedTypeObjectComputed.type === "object" ||
          this.selectedTypeObjectComputed.type === "array"
        ) {
          Object.keys(this.selectedTypeObjectComputed.properties).forEach(
            key => {
              const payload = {
                label: `${key}${this.getRequired(key) ? "*" : ""}`,
                type: this.selectedTypeObjectComputed.properties[key].type,
                val: null,
                required: this.getRequired(key),
                labelFor: "input-content-" + key,
                feedback: `${key} is required`,
                labelKey: key,
              };
              arr.push(payload);
            }
          );
        }
      } else {
        if (
          this.selectedTypeObjectComputed.type === "string" &&
          this.selectedTypeObjectComputed.enum
        ) {
          const payload = {
            label: `Content ${
              this.selectedTypeObjectComputed.required ? "*" : ""
            }`,
            type: "enum",
            val: this.data.content,
            enum: this.selectedTypeObjectComputed.enum,
            required: !!this.selectedTypeObjectComputed.required,
            labelFor: "input-content-Content",
            feedback: "Content is required",
          };
          arr.push(payload);
        } else if (
          this.selectedTypeObjectComputed.type === "null" &&
          this.selectedTypeObjectComputed.attachmentRequired
        ) {
          const payload = {
            label: `Attachment ${
              this.selectedTypeObjectComputed.required ? "*" : ""
            }`,
            type: "attachment",
            val: null,
            required: !!this.selectedTypeObjectComputed.required,

            labelFor: "input-content-Attachment",
            feedback: "Attachment is required",
          };
          arr.push(payload);
        } else if (this.selectedTypeObjectComputed.type === "string") {
          const payload = {
            label: `Content ${
              this.selectedTypeObjectComputed.required ? "*" : ""
            }`,
            type: this.selectedTypeObjectComputed.type,
            val: this.data.content.toString(),
            required: !!this.selectedTypeObjectComputed.required,
            labelFor: "input-content-Content",
            feedback: "Content is required",
          };
          arr.push(payload);
        } else if (this.selectedTypeObjectComputed.type === "number") {
          const payload = {
            label: `Content ${
              this.selectedTypeObjectComputed.required ? "*" : ""
            }`,
            type: this.selectedTypeObjectComputed.type,
            val: this.data.content.toString(),
            required: true,
            labelFor: "input-content-Content",
            feedback: "Content is required",
          };
          arr.push(payload);
        } else if (
          this.selectedTypeObjectComputed.type === "object" ||
          this.selectedTypeObjectComputed.type === "array"
        ) {
          Object.keys(this.selectedTypeObjectComputed.properties).forEach(
            key => {
              const payload = {
                label: `${key}${this.getRequired(key) ? "*" : ""}`,
                type: this.selectedTypeObjectComputed.properties[key].type,
                val: this.data.content[key].toString(),
                required: this.getRequired(key),
                labelFor: "input-content-" + key,
                feedback: `${key} is required`,
                labelKey: key,
              };
              arr.push(payload);
            }
          );
        }
      }
      return arr;
    },
    eventsDisplayMap: {
      get() {
        return this.$store.state.eventsDisplayMap;
      },
      set(value) {
        this.$store.commit("UPDATE_DISPLAY_EVENTS_MAP", value);
      },
    },
  },
  methods: {
    getRequired(key) {
      return !!(
        this.selectedTypeObjectComputed.required &&
        this.selectedTypeObjectComputed.required.length > 0 &&
        this.selectedTypeObjectComputed.required.includes(key)
      );
    },
    checkFormValidity() {
      const valid = this.$refs[this.data.id].checkValidity();
      if (this.selectedStream === "") this.streamState = valid;
      if (this.selectedType === "") this.typeState = valid;
      if (this.contentNames) {
        this.contentNames.forEach(obj => {
          let index;
          if (obj.required === true && (obj.val === "" || obj.val === null)) {
            index = this.contentNames.indexOf(obj);
            this.$set(this.contentStatesCheck, index, valid);
          } else {
            index = this.contentNames.indexOf(obj);
            this.$set(this.contentStatesCheck, index, null);
          }
        });
      }
      return valid;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    async handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }
      await this.editEvent();
    },
    async editEvent() {
      const obj = {};
      if (this.data.streamId !== this.selectedStreamComputed)
        obj["streamId"] = this.selectedStreamComputed;
      if (this.data.type !== this.selectedTypeComputed) {
        obj["type"] = this.selectedTypeComputed;
        let content = null;
        if (this.selectedTypeObjectComputed.type === "string") {
          content = this.contentNames[0].val;
        } else if (this.selectedTypeObjectComputed.type === "number") {
          content = +this.contentNames[0].val;
        } else if (
          this.selectedTypeObjectComputed.type === "object" ||
          this.selectedTypeObjectComputed.type === "array"
        ) {
          content = {};
          this.contentNames.forEach(obj => {
            content[obj.labelKey] = obj.type === "number" ? +obj.val : obj.val;
          });
        } else if (this.selectedTypeObjectComputed.type === "attachment") {
          content = null;
        }
        obj["content"] = content;
      } else {
        let content = null;
        if (this.selectedTypeObjectComputed.type === "string") {
          if (this.data.content !== this.contentNames[0].val)
            content = this.contentNames[0].val;
        } else if (this.selectedTypeObjectComputed.type === "number") {
          if (this.data.content !== +this.contentNames[0].val)
            content = +this.contentNames[0].val;
        } else if (
          this.selectedTypeObjectComputed.type === "object" ||
          this.selectedTypeObjectComputed.type === "array"
        ) {
          content = {};
          let modified = false;
          this.contentNames.forEach(obj => {
            let value = obj.type === "number" ? +obj.val : obj.val;
            if (this.data.content[obj.labelKey] !== value) {
              modified = true;
            }
          });
          if (modified === true) {
            this.contentNames.forEach(obj => {
              content[obj.label] = obj.type === "number" ? +obj.val : obj.val;
            });
          }
        } else if (this.selectedTypeObjectComputed.type === "attachment") {
          content = null;
        }
        if (content !== null) obj["content"] = content;
        if (this.data.time !== this.selectedTimeComputed)
          obj["time"] = this.selectedTimeComputed;
        if (this.data.duration !== this.selectedDurationComputed)
          obj["duration"] = this.selectedTimeComputed;
        if (this.data.description !== this.selectedDescriptionComputed)
          obj["description"] = this.selectedDescriptionComputed;
        if (this.data.clientData !== this.selectedClientDataComputed)
          obj["clientData"] = this.selectedClientDataComputed;
      }
      if (Object.keys(obj).length === 0) {
        alert(
          "No changes to the event. Please cancel if you dont want to change the event"
        );
        return;
      }
      const connection = this.connectionsMap[this.selectedEndpointComputed];
      try {
        const apiObj = UPDATE_EVENT_API.UPDATE_EVENT_API;
        apiObj[0].params = {
          id: this.data.id,
          update: obj,
        };
        const result = await connection.api(apiObj);
        if (result && result[0] && result[0].error) {
          alert(result[0].error.id + " - " + result[0].error.message);
          this.resetModal();
          return;
        }
        await this.addEventsToStore(result[0].event);
      } catch (e) {
        console.log("Error occurred when creating modals" + e);
      }
    },
    async addEventsToStore(event) {
      const clonedEvents = Object.assign({}, this.eventsDisplayMap);
      const editedEventIndex = clonedEvents[this.data.apiEndpoint].findIndex(
        key => key.id === event.id
      );
      clonedEvents[this.data.apiEndpoint][editedEventIndex] = event;
      const editedDisplayEventIndex = this.eventsDisplayMap[
        this.data.apiEndpoint
      ].findIndex(key => key.id === event.id);
      this.eventsDisplayMap[this.data.apiEndpoint][
        editedDisplayEventIndex
      ] = event;
      this.eventsDisplayMap = clonedEvents;
      this.$bvModal.hide(this.data.id);
    },
    resetModal() {
      this.selectedEndpoint = this.data.apiEndpoint;
      this.selectedConnection = this.accessInfoMap[this.data.apiEndpoint].name;
      this.selectedStream = this.data.streamId;
      this.selectedType = this.data.type;
      this.selectedTypeObject = this.typesAll[this.selectedType];
      this.selectedTime = this.data.time;
      this.selectedDuration = this.data.duration;
      this.selectedDescription = this.data.description;
      this.clientData = this.data.clientData;
      //reset states
      this.streamState = null;
      this.typeState = null;
      this.contentStatesCheck = [];
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
      this.typeState = null;
      value
        ? (this.selectedTypeObjectComputed = this.typesAll[
            this.selectedTypeComputed
          ])
        : (this.selectedTypeObjectComputed = null);
    },
    updateValue(obj, value) {
      obj.val = value;
      this.$set(this.contentStatesCheck, this.contentNames.indexOf(obj), null);
    },
    cancelEdit(cancel) {
      this.resetModal();
      cancel();
    },
    setStream(value) {
      this.streamState = null;
      this.selectedStreamComputed = value;
    },
  },
};
</script>

<style scoped></style>