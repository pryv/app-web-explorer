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
              v-if="infoJSON"
              @click="backToEvents"
              class="mt-0"
              :content="btnContent"
            ></PryvBtn>
          </b-col>
        </b-row>
      </div>
      <div>
        <b-card class="text-info" v-if="infoJSON">
          <vue-json-pretty :path="'res'" :data="infoJSON"></vue-json-pretty>
          <b-row class="justify-content-center">
            <PryvBtn
              class="mt-0"
              @click="edit"
              :content="btnContentEdit"
            ></PryvBtn>
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

export default {
  name: "Stream",
  computed: {
    ...mapState(["viewStreamInfo"]),
    ...mapState(["streamsMap"]),
    infoJSON: {
      get: function() {
        const obj = this.streamsMap[this.viewStreamInfo.endpoint].find(
          key => key.id === this.viewStreamInfo.id
        );
        return obj;
      },
    },
  },
  components: {
    PryvBtn,
    VueJsonPretty,
  },
  data() {
    return {
      btnContent: "Back",
      message: "Please select an endpoint to view the access data",
      btnContentEdit: "Edit",
    };
  },
  methods: {
    currentRouteName() {
      return this.$route.name;
    },
    backToEvents() {
      if (this.currentRouteName !== "events") {
        this.$router.push("events");
      }
    },
    edit() {},
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
</style>
