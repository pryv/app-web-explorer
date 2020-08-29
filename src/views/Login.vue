<template>
  <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
    <div class="bg-white py-2 w-90">
      <div class="card-style login-card">
        <b-row>
          <b-col cols="10">
            <h4>Login Panel</h4>
          </b-col>
          <b-col cols="2" class="text-right">
            <PryvBtn
              v-if="showBtn"
              @click="backToEvents"
              class="mt-0"
              content="Back"
              icon="arrow-left"
            ></PryvBtn>
          </b-col>
        </b-row>
      </div>
      <div>
        <b-card no-body>
          <b-tabs content-class="mt-3" fill>
            <b-tab title="Token Based Login" active>
              <b-card-text>
                <b-card class="card-style shadow min-height-card">
                  <PryvLabel
                    href="https://github.com/pryv/lib-js#within-a-webpage-with-a-login-button"
                    parentData="Login using Web Button"
                  ></PryvLabel>
                  <WebButton
                    :key="serviceInfo"
                    @authenticated="updateSessionStorage"
                  ></WebButton>
                  <br />
                  <div class="text-left">
                    <b-button
                      class="pryv-btn-collapse"
                      v-b-toggle.collapse-1
                      variant="secondary"
                      >View Service Info
                    </b-button>
                    <b-collapse id="collapse-1" class="mt-2">
                      <b-card class="card-style border-0">
                        <PryvLabel
                          href="https://github.com/pryv/lib-js#usage-of-pryvservice"
                          parentData="Service Info URL"
                        ></PryvLabel>
                        <ServiceInfo id="Web based Login"></ServiceInfo>
                      </b-card>
                    </b-collapse>
                  </div>
                </b-card>
              </b-card-text>
            </b-tab>
            <b-tab title="Username, Password Login">
              <b-card-text>
                <b-card class="card-style shadow">
                  <PryvLabel
                    href="https://github.com/pryv/lib-js#using-servicelogin-trusted-apps-only"
                    parentData="Login using Username, Password"
                  ></PryvLabel>
                  <UsernameLogin
                    @authenticated="updateSessionStorage"
                  ></UsernameLogin>
                  <br />
                  <div style="text-align: left">
                    <b-button
                      class="pryv-btn-collapse"
                      v-b-toggle="'collapse-2'"
                      variant="secondary"
                      >View Service Info
                    </b-button>
                    <b-collapse id="collapse-2" class="mt-2">
                      <b-card class="card-style shadow border-0">
                        <PryvLabel
                          href="https://github.com/pryv/lib-js#usage-of-pryvservice"
                          parentData="Service Info URL"
                        ></PryvLabel>
                        <ServiceInfo
                          id="Username,Password based Login"
                        ></ServiceInfo>
                      </b-card>
                    </b-collapse>
                  </div>
                </b-card>
              </b-card-text>
            </b-tab>
            <b-tab title="API Endpoint Login">
              <b-card-text>
                <b-card class="card-style shadow">
                  <PryvLabel
                    href="https://github.com/pryv/lib-js#using-an-api-endpoint"
                    parentData="Login Using API"
                  ></PryvLabel>
                  <APILogin @authenticated="updateSessionStorage"></APILogin>
                </b-card>
              </b-card-text>
            </b-tab>
          </b-tabs>
          <b-overlay :show="showOverlay" no-wrap></b-overlay>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import PryvBtn from "../components/shared/PryvBtn";
import APILogin from "../components/login/APILogin";
import PryvLabel from "../components/shared/PryvLabel";
import WebButton from "../components/login/WebButtonLogin";
import UsernameLogin from "../components/login/UsernameLogin";
import ServiceInfo from "../components/login/ServiceInfo";
import GET_STREAMS_API from "../utilities/api";
import ACCESS_INFO_API from "../utilities/api";
import GET_EVENTS_API from "../utilities/api";
import { mapState } from "vuex";
export default {
  components: {
    ServiceInfo,
    UsernameLogin,
    WebButton,
    PryvLabel,
    APILogin,
    PryvBtn,
  },
  computed: {
    ...mapState(["serviceInfo"]),
    connectionsMap: {
      get() {
        return this.$store.state.connectionsMap;
      },
      set([key, value]) {
        if (!this.connectionsMap[key]) {
          this.$store.commit("ADD_CONNECTIONS_MAP", [key, value]);
        }
      },
    },
    streamsMap: {
      get() {
        return this.$store.state.streamsMap;
      },
      set([key, value]) {
        let streamArr = [];
        this.streamsMap[key]
          ? (streamArr = this.streamsMap[key])
          : (streamArr = []);
        streamArr.push(value);
        this.$store.commit("ADD_STREAMS_MAP", [key, streamArr]);
      },
    },
    accessInfoMap: {
      get() {
        return this.$store.state.accessInfoMap;
      },
      set([key, value]) {
        if (!this.accessInfoMap[key]) {
          this.$store.commit("ADD_ACCESS_INFO_MAP", [key, value]);
        }
      },
    },
    eventsMap: {
      get() {
        return this.$store.state.eventsMap;
      },
      set([key, value]) {
        this.$store.commit("ADD_EVENTS_MAP", [key, value]);
      },
    },
    eventsDisplayMap: {
      get() {
        return this.$store.state.eventsDisplayMap;
      },
      set([key, value]) {
        this.$store.commit("ADD_DISPLAY_EVENTS_MAP", [key, value]);
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
    types: {
      get() {
        return this.$store.state.types;
      },
      set(value) {
        this.$store.commit("SET_TYPES", value);
      },
    },
    showBtn: function() {
      return this.connectionsMap
        ? Object.keys(this.connectionsMap).length > 0
        : false;
    },
  },
  data() {
    return {
      events: [],
      displayEvents: [],
      typesSet: new Set(),
      showOverlay: false,
    };
  },
  methods: {
    addAPIEndpointsToSessionStorage(connection, cookie) {
      let existing = this.$sessionStorage.endpoint_arr;
      existing = existing ? JSON.parse(existing) : [];
      if (existing.filter(e => e.key === connection.apiEndpoint).length > 0) {
        return false;
      }
      existing.push({
        key: connection.apiEndpoint,
        cookie: cookie,
      });
      this.$sessionStorage.endpoint_arr = JSON.stringify(existing);
      return true;
    },
    addConnectionToStore(connection) {
      this.connectionsMap = [connection.apiEndpoint, connection];
      return true;
    },
    async addStreamsToStore(connection) {
      const apiObj = GET_STREAMS_API.GET_STREAMS_API;
      apiObj[0].params = { state: "all" };
      try {
        const result = await connection.api(apiObj);
        if (result) {
          result[0].streams.forEach(stream => {
            this.addStream(connection.apiEndpoint, stream);
          });
        }
      } catch (e) {
        console.log("Error occurred when retrieving streams " + e);
        return false;
      }
      return true;
    },
    async addInitialEventsToStore(connection) {
      this.displayEvents = [];
      const apiObj = GET_EVENTS_API.GET_EVENTS_API;
      apiObj[0].params = {};
      try {
        const result = await connection.api(apiObj);
        this.modifiedSinceMap = [connection.apiEndpoint, Date.now() / 1000];
        if (result) {
          result[0].events.forEach(event => {
            this.forEachDisplayEvent(event);
          });
          this.eventsDisplayMap = [connection.apiEndpoint, this.displayEvents];
        }
      } catch (e) {
        console.log("Error occurred when retrieving streams " + e);
        return false;
      }
      return true;
    },
    async addStream(apiEndpoint, stream) {
      if (stream.children && stream.children.length === 0)
        this.streamsMap = [apiEndpoint, stream];
      if (stream.children && stream.children.length > 0) {
        this.streamsMap = [apiEndpoint, stream];
        stream.children.forEach(streamChild =>
          this.addStream(apiEndpoint, streamChild)
        );
      }
    },
    async addAccessInfoToStore(connection) {
      try {
        const result = await connection.api(ACCESS_INFO_API.ACCESS_INFO_API);
        if (result) {
          this.accessInfoMap = [connection.apiEndpoint, result[0]];
        }
      } catch (e) {
        console.log("Error occurred when retrieving access info " + e);
        return false;
      }
      return true;
    },
    async addEventsToStore(connection) {
      this.events = [];
      let queryParams = { limit: 1000000 };
      try {
        const result = await connection.getEventsStreamed(
          queryParams,
          this.forEachEvent
        );
        this.modifiedSinceMap = [
          connection.apiEndpoint,
          result.meta.serverTime,
        ];
        this.eventsMap = [connection.apiEndpoint, this.events];
      } catch (e) {
        console.log("Error occurred when retrieving events " + e);
        return false;
      }
      return true;
    },
    forEachEvent(event) {
      this.events.push(event);
    },
    forEachDisplayEvent(event) {
      this.displayEvents.push(event);
      this.typesSet.add(event.type);
      this.types = this.typesSet;
    },
    async updateStore(connection) {
      this.showOverlay = true;
      const conn = await this.addConnectionToStore(connection);
      const str = await this.addStreamsToStore(connection);
      const acc = await this.addAccessInfoToStore(connection);
      const eve = await this.addInitialEventsToStore(connection);
      if (conn && str && acc && eve) {
        this.showOverlay = false;
        return true;
      }
      return false;
    },
    async updateSessionStorage(connection, cookie) {
      const sessionAdded = await this.addAPIEndpointsToSessionStorage(
        connection,
        cookie
      );
      if (sessionAdded === false && cookie === false) {
        alert("Account already exists");
      }
      if (sessionAdded === true) {
        await this.updateStore(connection)
          .then(
            async function(response_update_store) {
              if (response_update_store) {
                this.$router.push("events");
              }
              this.addEventsToStore(connection);
            }.bind(this)
          )
          .catch(function(error) {
            alert(error);
          });
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
  },
};
</script>
<style>
.card-body {
  padding: 0.75em !important;
}

.card-style {
  background-color: white;
  padding: 1%;
  margin: 1.5%;
}

.shadow {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
}

.pryv-btn-collapse {
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 20px;
  width: 100%;
  color: white;
  text-align: center;
  text-decoration: none;
  padding: 5px 6px;
  margin-bottom: 0;
  cursor: pointer;
  background-color: lightgrey;
  border: none;
  border-radius: 0;
}
.login-card {
  border: none;
  padding: 0.5%;
  text-align: left;
}
</style>