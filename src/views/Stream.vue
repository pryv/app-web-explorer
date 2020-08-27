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
      <LoadStreamsBtn ref="reloadStreams" class="invisible"></LoadStreamsBtn>
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
import LoadStreamsBtn from "../components/load/LoadStreamsBtn";
export default {
  name: "Stream",
  components: {
    LoadStreamsBtn,
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
          if (this.viewStreamInfoObj[k] !== this.computedStreamInfo[k])
            if (k !== "children") obj[k] = this.computedStreamInfo[k];
      });
      return obj;
    },
    async save() {
      const updateObj = this.getUpdatedProps();
      if (Object.keys(updateObj).length === 0) {
        alert("No changes for the existing stream is detected");
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
        await this.addStreamsToStore(endpoint, result[0].stream);
        if (result && result[0] && result[0].error) {
          alert(result[0].error.id + " - " + result[0].error.message);
        }
      } catch (e) {
        console.log("Error occurred when creating events" + e);
      }
    },
    async addStreamsToStore(endpoint, stream) {
      stream.children = this.viewStreamInfoObj.children;
      const clonedStreams = Object.assign({}, this.streamsMap);
      const streamIndex = clonedStreams[this.viewStreamInfo.endpoint].findIndex(
        key => key.id === this.viewStreamInfo.id
      );
      clonedStreams[endpoint][streamIndex] = stream;
      //this.removeChild(clonedStreams);
      this.updateParent(clonedStreams, stream);
      this.viewStreamInfoObj = stream;
      this.streamsMap = clonedStreams;
      this.saveDisable = true;
      this.editable = false;
    },
    removeChild(clonedStreams, stream) {
      if (stream.parentId !== null) {
        const index = this.getParentIndex(clonedStreams, stream);
        const parentStream = clonedStreams[this.viewStreamInfo.endpoint][index];
        let findChild = false;
        if (parentStream.children) {
          parentStream.children.forEach((child) => {
            if (child.id === stream.id) {
              findChild = true;
            }
          });
          if(findChild === true)
          {
            parentStream.children.filter(child => child.child.id != stream.id)
          }
          if(findChild === false)
          {
            parentStream.children.every((child, id) => {
              this.removeChild(clonedStreams,child)
              console.log(id)
            });
          }
        }
      }
      //if(this.viewStreamInfoObj.)
    },
    updateParent(clonedStreams, stream) {
      if (stream.parentId !== null) {
        const index = this.getParentIndex(clonedStreams, stream);
        const parentStream = clonedStreams[this.viewStreamInfo.endpoint][index];
        let findChild = null;
        if (parentStream.children) {
          parentStream.children.forEach((child, id) => {
            if (child.id === stream.id) {
              findChild = stream;
              clonedStreams[this.viewStreamInfo.endpoint][index].children[
                id
              ] = stream;
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
          await this.addStreamsToStore(endpoint, stream);
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