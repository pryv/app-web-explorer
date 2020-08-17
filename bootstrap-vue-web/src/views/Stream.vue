<template>
  <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
    <div class="bg-white py-2 w-80">
      <div class="card-style info-card">
        <b-row>
          <b-col cols="10">
            <h4>Stream Info Panel - {{ viewStreamInfo.id }}</h4>
          </b-col>
          <b-col cols="1">
            <PryvBtn
              v-if="viewStreamInfoObj"
              @click="backToEvents"
              class="mt-0"
              :content="btnContent"
            ></PryvBtn>
          </b-col>
        </b-row>
      </div>
      <div>
        <b-card class="text-info" v-if="viewStreamInfoObj">
          <b-row class="float-right">
            <b-icon
              v-if="
                viewStreamInfoObj.trashed &&
                  viewStreamInfoObj.trashed === true &&
                  editable === false
              "
              icon="trash-fill"
              font-scale="3"
            ></b-icon>
          </b-row>
          <vue-json-pretty
            v-if="editable === false"
            :path="'res'"
            :data="viewStreamInfoObj"
          ></vue-json-pretty>
          <v-jsoneditor
            v-else
            v-model="viewStreamInfoObj"
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
            }"
          ></v-jsoneditor>
          <b-row v-if="editable === true" class="justify-content-center">
            <PryvBtn
              class="mt-0"
              @click="edit"
              :content="btnContentCancel"
            ></PryvBtn>
            <span class="w-3"></span>
            <PryvBtn
              class="mt-0"
              @click="save"
              :content="btnContentSave"
            ></PryvBtn>
          </b-row>
          <b-row v-else class="justify-content-center">
            <PryvBtn
              class="mt-0"
              @click="edit"
              :content="btnContentEdit"
              icon="check2-square"
            ></PryvBtn>
            <span class="w-3"></span>
            <PryvBtn
              class="mt-0"
              @click="deleteStream"
              :content="btnContentDelete"
              icon="trash-fill"
            ></PryvBtn>
          </b-row>
          <b-row style="visibility: hidden;">
            <LoadStreamsBtn ref="loadStreams"></LoadStreamsBtn>
          </b-row>
        </b-card>
        <b-card class="text-info" v-else>
          {{ message }}
        </b-card>
      </div>
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
      btnContent: "Back",
      message: "Please select an endpoint to view the access data",
      btnContentEdit: "Edit",
      btnContentSave: "Save",
      btnContentCancel: "Cancel",
      btnContentDelete: "Delete",
      editable: false,
    };
  },
  computed: {
    ...mapState(["viewStreamInfo"]),
    ...mapState(["viewStreamInfoObj"]),
    ...mapState(["connectionsMap"]),
    viewStreamInfoObj: {
      get() {
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
  },
  methods: {
    isJSON: function(text) {
      try {
        JSON.parse(text);
      } catch (e) {
        return false;
      }
      return true;
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
    async save() {
      console.log(this.viewStreamInfoObj);
      const endpoint = this.viewStreamInfo.endpoint;
      const connection = this.connectionsMap[endpoint];
      try {
        const apiObj = UPDATE_STREAM_API.UPDATE_STREAM_API;
        apiObj[0].params = {
          id: this.viewStreamInfoObj.id,
          update: this.viewStreamInfoObj,
        };
        const result = await connection.api(apiObj);
        if (result && result[0] && result[0].stream) {
          await this.addStreamsToStore(endpoint, result[0].stream);
        }
        this.reset();
        if (result && result[0] && result[0].error) {
          alert(result[0].error.id + " - " + result[0].error.message);
          return;
        }
      } catch (e) {
        console.log("Error occurred when creating events" + e);
        return;
      }
      console.log(connection);
      this.reset();
    },
    async addStreamsToStore(endpoint, stream) {
      const clonedStreams = Object.assign({}, this.streamsMap);
      const streamIndex = clonedStreams[this.viewStreamInfo.endpoint].findIndex(
        key => key.id === this.viewStreamInfo.id
      );
      clonedStreams[endpoint][streamIndex] = stream;
      this.viewStreamInfoObj = stream;
      this.streamsMap = clonedStreams;
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
          mergeEventsWithParent: true,
        };
        const result = await connection.api(apiObj);
        if (result && result[0] && result[0].stream) {
          await this.addStreamsToStore(endpoint, result[0].stream);
        }
        console.log(this.streamsMap);
        if (result && result[0] && result[0].error) {
          alert(result[0].error.id + " - " + result[0].error.message);
          return;
        }
      } catch (e) {
        console.log("Error occurred when creating modals" + e);
        return;
      }
    },
  },
};
</script>

<style scoped>
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

</style>
