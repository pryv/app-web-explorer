<template>
  <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
    <div class="bg-white py-2 w-90">
      <div class="card-style info-card">
        <b-row>
          <b-col cols="10">
            <h4>Stream Info Panel - {{ viewStreamInfo.id }}</h4>
          </b-col>
          <b-col cols="2" class="text-right">
            <PryvBtn
              v-if="viewStreamInfoObj"
              @click="backToEvents"
              class="mt-0"
              icon="arrow-left"
              content="Back"
            ></PryvBtn>
          </b-col>
        </b-row>
      </div>
      <div>
        <b-card class="text-info" v-if="computedStreamInfo">
          <b-row class="float-right mr-2">
            <b-icon
              v-if="
                computedStreamInfo.trashed &&
                  computedStreamInfo.trashed === true &&
                  editable === false
              "
              icon="trash-fill"
              font-scale="3"
            ></b-icon>
          </b-row>
          <vue-json-pretty
            v-if="editable === false"
            :path="'res'"
            :data="computedStreamInfo"
          ></vue-json-pretty>
          <v-jsoneditor
            v-else
            v-model="computedStreamInfo"
            :plus="false"
            height="500px"
            :options="{
              enableTransform: false,
              enableSort: false,
              statusBar: false,
              mainMenuBar: true,
              search: false,
              navigationBar: false,
              mode: 'code',
              onChangeText: function(jsonText) {
                isJSON(jsonText);
              },
            }"
          ></v-jsoneditor>
          <b-row v-if="editable === true" class="justify-content-center">
            <PryvBtn
              class="mt-0"
              @click="cancelEdit"
              content="Cancel"
            ></PryvBtn>
            <span class="w-3"></span>
            <PryvBtn
              class="mt-0"
              @click="save"
              content="Save"
              :disabled="saveDisable"
            ></PryvBtn>
          </b-row>
          <b-row v-else class="justify-content-center">
            <PryvBtn
              class="mt-0"
              @click="edit"
              content="Edit"
              icon="check2-square"
            ></PryvBtn>
            <span class="w-3"></span>
            <PryvBtn
              class="mt-0"
              @click="
                viewStreamInfoObj.trashed && viewStreamInfoObj.trashed === true
                  ? $bvModal.show(viewStreamInfoObj.id)
                  : deleteStream()
              "
              content="Delete"
              icon="trash-fill"
            ></PryvBtn>
          </b-row>
        </b-card>
        <b-card class="text-info" v-else>
          Please select an endpoint to view the access data
        </b-card>
      </div>
      <b-modal :id="this.viewStreamInfoObj.id" ref="modal">
        <template v-slot:modal-header>
          <h5>Delete a stream</h5>
        </template>
        <template v-slot:default>
          <b-form-checkbox
            id="checkbox-1"
            v-model="merge"
            name="checkbox-1"
            value="accepted"
            unchecked-value="not_accepted"
          >
            Merge events with parents
          </b-form-checkbox>
        </template>
        <template v-slot:modal-footer="{ ok, cancel }">
          <PryvBtn
            @click="deleteStream"
            class="mt-0 float-right"
            content="Delete"
            icon="trash-fill"
            type="submit"
            variant="success"
          ></PryvBtn>
          <PryvBtn
            @click="cancel"
            class="mt-0 float-right"
            content="Cancel"
            icon="x"
          ></PryvBtn>
        </template>
      </b-modal>
      <LoadStreamsForConnection
        ref="reloadStreams"
        class="invisible"
        :merge="merge"
      ></LoadStreamsForConnection>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VueJsonPretty from "vue-json-pretty";
import PryvBtn from "../components/shared/PryvBtn";
import VJsoneditor from "v-jsoneditor";
import UPDATE_STREAM_API from "../utilities/api";
import DELETE_STREAM_API from "../utilities/api";
import { constants } from "../utilities/constants";
import LoadStreamsForConnection from "../components/load/LoadStreamsForConnectionBtn";

export default {
  name: "Stream",
  components: {
    LoadStreamsForConnection,
    PryvBtn,
    VueJsonPretty,
    VJsoneditor,
  },
  data() {
    return {
      editable: false,
      updatedStreamInfo: null,
      merge: "not_accepted",
      saveDisable: true,
    };
  },
  computed: {
    ...mapState(["viewStreamInfo"]),
    ...mapState(["viewStreamInfoObj"]),
    ...mapState(["connectionsMap"]),
    viewStreamInfoObj: {
      get() {
        this.reset();
        return this.$store.state.viewStreamInfoObj;
      },
      set(value) {
        this.$store.commit("UPDATE_STREAM_INFO_OBJ", value);
      },
    },
    streamsMap: {
      get() {
        return this.$store.state.streamsMap;
      },
      set(value) {
        this.$store.commit("UPDATE_STREAMS_MAP", value);
      },
    },
    computedStreamInfo: {
      get() {
        return this.updatedStreamInfo !== null
          ? this.updatedStreamInfo
          : this.$store.state.viewStreamInfoObj;
      },
      set(value) {
        this.updatedStreamInfo = value;
      },
    },
  },
  methods: {
    isJSON: function(text) {
      try {
        JSON.parse(text);
        this.saveDisable = false;
      } catch (e) {
        this.saveDisable = true;
      }
    },
    currentRouteName() {
      return this.$route.name;
    },
    backToEvents() {
      if (this.currentRouteName !== "events") {
        this.$router.push("events");
      }
    },
    edit() {
      this.editable = !this.editable;
    },
    getUpdatedProps() {
      const obj = {};
      Object.keys(this.viewStreamInfoObj).forEach(k => {
        if (k in this.computedStreamInfo)
          if (this.viewStreamInfoObj[k] !== this.computedStreamInfo[k]) {
            if (
              typeof this.viewStreamInfoObj[k] === "object" &&
              k !== "children"
            ) {
              if (
                JSON.stringify(this.viewStreamInfoObj[k]) !==
                JSON.stringify(this.computedStreamInfo[k])
              ) {
                obj[k] = this.computedStreamInfo[k];
              }
            } else {
              if (k !== "children") obj[k] = this.computedStreamInfo[k];
            }
          }
      });
      return obj;
    },
    async save() {
      const updateObj = this.getUpdatedProps();
      if (Object.keys(updateObj).length === 0) {
        alert(
          "No changes for the existing stream is detected. Note : Child streams are not editable"
        );
        return;
      }
      const endpoint = this.viewStreamInfo.endpoint;
      const connection = this.connectionsMap[endpoint];
      try {
        const apiObj = UPDATE_STREAM_API.UPDATE_STREAM_API;
        apiObj[0].params = {
          id: this.viewStreamInfoObj.id,
          update: updateObj,
        };
        const result = await connection.api(apiObj);
        await this.addStreamsToStore(
          endpoint,
          result[0].stream,
          constants.EDIT
        );
        if (result && result[0] && result[0].error) {
          alert(result[0].error.id + " - " + result[0].error.message);
        }
      } catch (e) {
        console.log("Error occurred when creating events" + e);
      }
    },
    async addStreamsToStore(endpoint, stream, action) {
      if (this.viewStreamInfoObj.children)
        stream.children = this.viewStreamInfoObj.children;
      const clonedStreams = Object.assign({}, this.streamsMap);
      const streamIndex = clonedStreams[this.viewStreamInfo.endpoint].findIndex(
        key => key.id === this.viewStreamInfo.id
      );
      if (constants.EDIT === action) {
        const oldStream = clonedStreams[endpoint][streamIndex];
        if (oldStream.parentId !== stream.parentId) {
          this.addChild(clonedStreams, stream);
          this.removeChild(clonedStreams, oldStream);
        } else this.updateChild(clonedStreams, stream);
      } else if (constants.DELETE === action)
        this.updateChild(clonedStreams, stream);
      clonedStreams[endpoint][streamIndex] = stream;
      this.viewStreamInfoObj = stream;
      this.streamsMap = clonedStreams;
      this.saveDisable = true;
      this.editable = false;
    },
    getParent(clonedStreams, parentIndex) {
      if (parentIndex >= 0)
        return clonedStreams[this.viewStreamInfo.endpoint][parentIndex];
      return null;
    },
    removeChild(clonedStreams, oldStream) {
      if (oldStream.parentId === null) return;
      const parentIndex = this.getParentIndex(clonedStreams, oldStream);
      const parentStream = this.getParent(clonedStreams, parentIndex);
      if (parentStream !== null) {
        let clonedParent = Object.assign({}, parentStream);
        clonedParent.children = parentStream.children.filter(
          child => child.id !== oldStream.id
        );
        clonedStreams[this.viewStreamInfo.endpoint][parentIndex] = clonedParent;
      }
    },
    addChild(clonedStreams, stream) {
      if (stream.parentId === null) return;
      const parentIndex = this.getParentIndex(clonedStreams, stream);
      const parentStream = this.getParent(clonedStreams, parentIndex);
      if (parentStream.children) {
        let clonedParent = Object.assign({}, parentStream);
        clonedParent.children.push(stream);
        clonedStreams[this.viewStreamInfo.endpoint][parentIndex] = clonedParent;
      }
    },
    updateChild(clonedStreams, stream) {
      if (stream.parentId === null) return;
      const parentIndex = this.getParentIndex(clonedStreams, stream);
      const parentStream = this.getParent(clonedStreams, parentIndex);
      if (parentStream.children) {
        let childIndex = parentStream.children.findIndex(
          child => child.id === stream.id
        );
        clonedStreams[this.viewStreamInfo.endpoint][parentIndex].children[
          childIndex
        ] = stream;
      }
    },
    getParentIndex(clonedStreams, stream) {
      const parentStreamIndex = clonedStreams[
        this.viewStreamInfo.endpoint
      ].findIndex(key => key.id === stream.parentId);
      return parentStreamIndex;
    },
    reset() {
      Object.assign(this.$data, this.$options.data.call(this));
    },
    async deleteStream() {
      const endpoint = this.viewStreamInfo.endpoint;
      const connection = this.connectionsMap[endpoint];
      try {
        const apiObj = DELETE_STREAM_API.DELETE_STREAM_API;
        apiObj[0].params = {
          id: this.viewStreamInfoObj.id,
          mergeEventsWithParent: this.merge === "accepted",
        };
        const result = await connection.api(apiObj);
        if (result && result[0] && result[0].stream) {
          const stream = result[0].stream;
          await this.addStreamsToStore(endpoint, stream, constants.DELETE);
          stream.children = this.viewStreamInfoObj.children;
          this.viewStreamInfoObj = stream;
        }
        if (result && result[0] && result[0].streamDeletion) {
          this.$refs.reloadStreams.$el.click();
          this.$bvModal.hide(result[0].streamDeletion.id);
          this.backToEvents();
        }
        if (result && result[0] && result[0].error) {
          alert(result[0].error.id + " - " + result[0].error.message);
        }
      } catch (e) {
        console.log("Error occurred when creating modals" + e);
      }
    },
    cancelEdit() {
      this.editable = !this.editable;
      this.updatedStreamInfo = null;
    },
  },
};
</script>

<style>
.info-card {
  border: none;
  padding: 0.5%;
  text-align: left;
}
.text-info {
  text-align: left;
}
.trash {
  background-color: #9d0717;
}
.modal-body {
  padding-left: 2rem;
}
</style>