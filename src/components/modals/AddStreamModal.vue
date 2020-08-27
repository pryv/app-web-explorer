<template>
  <b-modal
    id="modal-scoped-stream"
    ref="modal"
    @hidden="resetModal"
    @ok="handleOk"
    @show="resetModal"
  >
    <template v-slot:modal-header>
      <h5>Add a new stream</h5>
    </template>
    <template v-slot:default>
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group label="ID" label-for="isnput-id">
          <b-form-input
            type="text"
            v-model="selectedId"
            id="input-id"
            placeholder="Enter ID"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Parent *" label-for="input-stream">
          <b-form-input
            placeholder="Select a stream"
            v-model="selectedParentId"
            list="input-stream-list"
            id="input-stream"
            autocomplete="off"
          ></b-form-input>
          <b-form-datalist
            id="input-stream-list"
            :options="streamNames"
          ></b-form-datalist>
        </b-form-group>
        <b-form-group
          label="Name *"
          label-for="input-name"
          :state="nameState"
          invalid-feedback="Name is required"
        >
          <b-form-input
            type="text"
            :value="selectedName"
            @input="setName"
            id="input-name"
            placeholder="Enter name"
            required
            :state="nameState"
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
import PryvBtn from "../shared/PryvBtn";
import CREATE_STREAM_API from "../../utilities/api";

export default {
  name: "AddStreamModal",
  components: { PryvBtn },
  data() {
    return {
      selectedId: null,
      selectedParentId: null,
      selectedName: null,
      clientData: null,
      nameState: null,
    };
  },
  computed: {
    ...mapState(["viewAccessInfo"]),
    ...mapState(["connectionsMap"]),
    streamsMap: {
      get() {
        return this.$store.state.streamsMap;
      },
      set(value) {
        this.$store.commit("UPDATE_STREAMS_MAP", value);
      },
    },
    streamNames() {
      const filteredObj = Object.keys(this.streamsMap).filter(
        key => key === this.viewAccessInfo
      );
      return this.streamsMap[filteredObj].map(obj => ({
        value: `${obj.name} [${obj.id}]`,
        text: filteredObj,
      }));
    },
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      if (this.selectedName === null || this.selectedName === "")
        this.nameState = valid;
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
      await this.addStream();
    },
    setName(value) {
      this.selectedName = value;
      this.nameState = null;
    },
    async addStream() {
      const connection = this.connectionsMap[this.viewAccessInfo];
      try {
        const apiObj = CREATE_STREAM_API.CREATE_STREAM_API;
        apiObj[0].params = {
          name: this.selectedName,
        };
        if (this.selectedId !== null) apiObj[0].params["id"] = this.selectedId;
        if (this.selectedParentId !== null)
          apiObj[0].params["parentId"] = this.selectedParentId
            .split(" ")[1]
            .replace(/[[\]]/g, "");
        if (this.clientData !== null)
          apiObj[0].params["clientData"] = this.clientData;
        const result = await connection.api(apiObj);
        if (result && result[0] && result[0].error) {
          alert(result[0].error.id + " - " + result[0].error.message);
          this.resetModal();
        } else {
          await this.addStreamsToStore(result[0].stream);
        }
      } catch (e) {
        console.log("Error occurred when creating modals" + e);

      }
    },
    async addStreamsToStore(stream) {
      let clonedStreams = JSON.parse(JSON.stringify(this.streamsMap));
      clonedStreams[this.viewAccessInfo].push(stream);
      this.updateParent(clonedStreams, stream);
      this.streamsMap = clonedStreams;
      this.$bvModal.hide("modal-scoped-stream");
      this.resetModal();
    },
    updateParent(clonedStreams, stream) {
      if (stream.parentId !== null) {
        const index = this.getParentIndex(clonedStreams, stream);
        const parentStream = clonedStreams[this.viewAccessInfo][index];
        let findChild = null;
        if (parentStream.children) {
          parentStream.children.forEach((child, id) => {
            if (child.id === stream.id) {
              findChild = stream;
              clonedStreams[this.viewAccessInfo][index].children[id] = stream;
            }
          });
        }
        if (findChild === null) {
          if (!parentStream.children) parentStream["children"] = [];
          parentStream.children.push(stream);
        }
        this.updateParent(clonedStreams, parentStream);
      }
    },
    getParentIndex(clonedStreams, stream) {
      return clonedStreams[this.viewAccessInfo].findIndex(
        key => key.id === stream.parentId
      );
    },
    resetModal() {
      this.selectedName = null;
      this.selectedParentId = null;
      this.selectedId = null;
      this.clientData = null;
      this.nameState = null;
    },
  },
};
</script>
