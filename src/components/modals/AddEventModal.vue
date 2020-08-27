<template>
  <b-modal
    id="modal-scoped-event"
    ref="modal"
    @hidden="resetModal"
    @ok="handleOk"
    @show="resetModal"
  >
    <template v-slot:modal-header>
      <h5>Add a new event</h5>
    </template>
    <template v-slot:default>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Connection *"
          label-for="input-connection"
          invalid-feedback="Connection is required"
          :state="connectionState"
        >
          <b-form-input
            :value="selectedConnection"
            placeholder="Select a endpoint"
            @input="setEndpoint"
            list="input-connection-list"
            id="input-connection"
            :state="connectionState"
            required
            autocomplete="off"
          ></b-form-input>
          <b-form-datalist
            id="input-connection-list"
            :options="connectionNames"
          ></b-form-datalist>
        </b-form-group>
        <b-form-group
          label="Stream *"
          label-for="input-stream"
          invalid-feedback="Stream is required"
          :state="streamState"
        >
          <b-form-input
            :value="selectedStream"
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
            :value="selectedType"
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
              v-else-if="obj.type === 'number'"
              type="number"
              :value="obj.val"
              :id="obj.labelFor"
              :placeholder="obj.type"
              @input="updateValue(obj, $event)"
              :required="obj.required"
              :state="contentStates[index]"
            ></b-form-input>
            <b-form-input
              v-else-if="obj.type === 'string'"
              type="text"
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
            v-model="selectedTime"
            id="input-time"
            placeholder="Enter Time"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Duration" label-for="input-duration">
          <b-form-input
            type="text"
            v-model="selectedDuration"
            id="input-duration"
            placeholder="Enter Duration"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Description" label-for="input-description">
          <b-form-input
            type="text"
            v-model="selectedDescription"
            id="input-description"
            placeholder="Enter Description"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Client Data" label-for="input-client-data">
          <v-jsoneditor
            v-model="clientData"
            :plus="false"
            height="200px"
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
        @click="cancel()"
        class="mt-0 float-right"
        content="Cancel"
        icon="x"
      ></PryvBtn>
    </template>
  </b-modal>
</template>

<script>
import { mapState } from "vuex";
import CREATE_EVENT_API from "../../utilities/api";
import Dropbox from "../shared/Dropbox";
import PryvBtn from "../shared/PryvBtn";
export default {
  name: "AddEventModal",
  components: { PryvBtn, Dropbox },
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
      connectionState: null,
      streamState: null,
      typeState: null,
      contentStatesCheck: [],
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
    ...mapState(["eventsMap"]),
    connectionNames() {
      return Object.keys(this.accessInfoMap).map(key => ({
        value: this.accessInfoMap[key].name,
        text: key,
      }));
    },
    streamNames() {
      if (
        (this.selectedConnection === null && this.selectedEndpoint === null) ||
        (this.selectedConnection === "" && this.selectedEndpoint === "")
      )
        return;
      const filteredObj = Object.keys(this.streamsMap).filter(
        key => key === this.selectedEndpoint
      );
      return this.streamsMap[filteredObj]
        .filter(obj => !obj.trashed)
        .map(obj => ({
          value: `${obj.name} [${obj.id}]`,
          text: filteredObj,
        }));
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
      if (this.selectedTypeObject === null || !this.selectedTypeObject) return;
      if (
        this.selectedTypeObject.type === "string" &&
        this.selectedTypeObject.enum
      ) {
        const payload = {
          label: `Content ${this.selectedTypeObject.required ? "*" : ""}`,
          type: "enum",
          val: null,
          enum: this.selectedTypeObject.enum,
          required: !!this.selectedTypeObject.required,
          labelFor: "input-content-Content",
          feedback: "Content is required",
        };
        arr.push(payload);
      } else if (
        this.selectedTypeObject.type === "null" &&
        this.selectedTypeObject.attachmentRequired
      ) {
        const payload = {
          label: `Attachment ${this.selectedTypeObject.required ? "*" : ""}`,
          type: "attachment",
          val: null,
          required: !!this.selectedTypeObject.required,
          State: null,
          labelFor: "input-content-Attachment",
          feedback: "Attachment is required",
        };
        arr.push(payload);
      } else if (
        this.selectedTypeObject.type === "string" ||
        this.selectedTypeObject.type === "number"
      ) {
        const payload = {
          label: `Content ${
            this.selectedTypeObject.type === "number" ? "*" : ""
          }`,
          type: this.selectedTypeObject.type,
          val: null,
          required: this.selectedTypeObject.type === "number",
          labelFor: "input-content-Content",
          feedback: "Content is required",
        };
        arr.push(payload);
      } else if (
        this.selectedTypeObject.type === "object" ||
        this.selectedTypeObject.type === "array"
      ) {
        Object.keys(this.selectedTypeObject.properties).forEach(key => {
          if (key === "required") return;
          const payload = {
            label: `${key}${this.getRequired(key) ? "*" : ""}`,
            type: this.selectedTypeObject.properties[key].type,
            val: null,
            required: this.getRequired(key),
            labelFor: "input-content-" + key,
            feedback: `${key} is required`,
            labelKey: key,
          };
          arr.push(payload);
        });
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
    modifiedSinceMap: {
      get() {
        return this.$store.state.modifiedSinceMap;
      },
      set([key, value]) {
        this.$store.commit("ADD_MODIFIED_SINCE_MAP", [key, value]);
      },
    },
  },
  methods: {
    getType(obj) {
      // evaluate whatever you need to determine disabled here...
      return obj.type === "string" ? "text" : obj.type;
    },
    getRequired(key) {
      return !!(
        this.selectedTypeObject.required &&
        this.selectedTypeObject.required.length > 0 &&
        this.selectedTypeObject.required.includes(key)
      );
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      if (this.selectedEndpoint === null || this.selectedEndpoint === "")
        this.connectionState = valid;
      if (this.selectedStream === null || this.selectedStream === "")
        this.streamState = valid;
      if (this.selectedType === null || this.selectedType === "")
        this.typeState = valid;
      if (this.contentNames) {
        this.contentNames.forEach((obj, index) => {
          if (obj.required === true && (obj.val === null || obj.val === "")) {
            this.$set(this.contentStatesCheck, index, valid);
          } else {
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
      if (!this.checkFormValidity()) return;
      await this.addEvent();
    },
    async addEvent() {
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
          content = {};
          this.contentNames.forEach(obj => {
            if (obj.type === "number") {
              let val = +obj.val;
              if (!isNaN(val)) content[obj.labelKey] = val;
            } else {
              if (obj.val) content[obj.labelKey] = obj.val;
            }
          });
        }
        if (
          this.selectedTypeObject.type === "null" &&
          this.contentNames.length > 0 &&
          this.contentNames[0].type === "attachment"
        ) {
          let formData = new FormData();
          formData.append("file0", this.contentNames[0].val);
          connection
            .createEventWithFormData(
              {
                type: this.selectedType.toLowerCase(),
                streamId: this.selectedStream
                  .split(" ")[1]
                  .replace(/[[\]]/g, ""),
              },
              formData
            )
            .then(
              function(res, err) {
                if (err) {
                  alert(err);
                  this.resetModal();
                  return;
                }
                if (res.event) {
                  this.addEventsToStore(res.event);
                }
              }.bind(this)
            );
        } else {
          apiObj[0].params = {
            streamId: this.selectedStream.split(" ")[1].replace(/[[\]]/g, ""),
            type: this.selectedType.toLowerCase(),
            content: content,
          };
          if (!(this.selectedTime === null || this.selectedTime === ""))
            apiObj[0].params["time"] = +this.selectedTime;
          if (!(this.selectedDuration === null || this.selectedDuration === ""))
            apiObj[0].params["duration"] = +this.selectedDuration;
          if (this.selectedDescription !== null)
            apiObj[0].params["description"] = this.selectedDescription;
          if (this.clientData !== null)
            apiObj[0].params["clientData"] = this.clientData;
          const result = await connection.api(apiObj);
          if (result && result[0] && result[0].error) {
            alert(result[0].error.id + " - " + result[0].error.message);
            this.resetModal();
          } else {
            await this.addEventsToStore(result[0].event);
          }
        }
      } catch (e) {
        console.log("Error occurred when creating modals" + e);
      }
    },
    async addEventsToStore(event) {
      let clonedEvents = JSON.parse(JSON.stringify(this.eventsDisplayMap));
      clonedEvents[this.selectedEndpoint].unshift(event);
      this.eventsMap[this.selectedEndpoint].unshift(event);
      this.eventsDisplayMap = clonedEvents;
      this.$bvModal.hide("modal-scoped-event");
    },
    resetModal() {
      this.selectedEndpoint = null;
      this.selectedConnection = null;
      this.selectedStream = null;
      this.selectedType = null;
      this.selectedTypeObject = null;
      this.selectedTime = null;
      this.selectedDuration = null;
      this.selectedDescription = null;
      //reset states
      this.connectionState = null;
      this.streamState = null;
      this.typeState = null;
      this.contentStatesCheck = [];
    },
    setEndpoint(value) {
      this.connectionState = null;
      this.selectedConnection = value;
      value
        ? (this.selectedEndpoint = this.connectionNames.find(
            x => x.value === this.selectedConnection
          ).text)
        : (this.selectedEndpoint = value);
    },
    setStream(value) {
      this.streamState = null;
      this.selectedStream = value;
    },
    setTypeObject(value) {
      this.typeState = null;
      this.selectedType = value;
      value
        ? (this.selectedTypeObject = this.typesAll[this.selectedType])
        : (this.selectedTypeObject = null);
    },
    updateValue(obj, value) {
      obj.val = value;
      this.$set(this.contentStatesCheck, this.contentNames.indexOf(obj), null);
    },
  },
};
</script>

<style scoped></style>
