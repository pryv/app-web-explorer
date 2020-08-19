<template>
  <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
    <div class="bg-white py-2 w-90">
      <div class="card-style login-card">
        <b-row>
          <b-col cols="10">
            <h4>Login Panel</h4>
          </b-col>
          <b-col cols="1">
            <PryvBtn
              v-if="showBtn"
              @click="backToEvents"
              class="mt-0"
              :content="btnContent"
            ></PryvBtn>
          </b-col>
        </b-row>
      </div>
      <div>
        <b-tabs content-class="mt-3" fill>
          <b-tab title="Token Based Login" active>
            <b-card-text>
              <b-card class="card-style shadow min-height-card">
                <PryvLabel
                  :href="href_web"
                  :parentData="ButtonLogin"
                ></PryvLabel>
                <WebButton @authenticated="updateSessionStorage"></WebButton>
                <br />
                <div class="text-left">
                  <b-button
                    class="pryv-btn-collapse"
                    v-b-toggle.collapse-1
                    variant="primary"
                    >View Service Info
                  </b-button>
                  <b-collapse id="collapse-1" class="mt-2">
                    <b-card class="card-style shadow border-0">
                      <PryvLabel
                        :href="href_service_info"
                        :parentData="ServiceInfoURL"
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
                  :href="href_manual"
                  :parentData="PasswordLogin"
                ></PryvLabel>
                <UsernameLogin
                  @authenticated="updateSessionStorage"
                ></UsernameLogin>
                <br />
                <div style="text-align: left">
                  <b-button
                    class="pryv-btn-collapse"
                    v-b-toggle="'collapse-2'"
                    variant="primary"
                    >View Service Info
                  </b-button>
                  <b-collapse id="collapse-2" class="mt-2">
                    <b-card class="card-style shadow border-0">
                      <PryvLabel
                        :href="href_service_info"
                        :parentData="ServiceInfoURL"
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
                <PryvLabel :href="href_api" :parentData="APILogin"></PryvLabel>
                <APILogin @authenticated="updateSessionStorage"></APILogin>
              </b-card>
            </b-card-text>
          </b-tab>
        </b-tabs>
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
        let streamArr = null;
        if (this.streamsMap[key]) {
          streamArr = this.streamsMap[key];
        } else {
          streamArr = [];
        }
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
        if (!this.eventsMap[key]) {
          this.$store.commit("ADD_EVENTS_MAP", [key, value]);
        }
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
      APILogin: "Login Using API",
      ButtonLogin: "Login using Web Button",
      PasswordLogin: "Login using Username, Password",
      ServiceInfoURL: "Service Info URL",
      href_api: "https://github.com/pryv/lib-js#using-an-api-endpoint",
      href_web:
        "https://github.com/pryv/lib-js#within-a-webpage-with-a-login-button",
      href_manual:
        "https://github.com/pryv/lib-js#using-servicelogin-trusted-apps-only",
      href_service_info: "https://github.com/pryv/lib-js#usage-of-pryvservice",
      events: [],
      typesSet: new Set(),
      btnContent: "Back",
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
      apiObj[0].params = { state: "all" }; //todo remove state all
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
    async addStream(apiEndpoint, stream) {
      //this.streamsMap = [apiEndpoint, stream];
      if(stream.children && stream.children.length === 0)
        this.streamsMap = [apiEndpoint, stream];
      if (stream.children && stream.children.length > 0) {
        this.streamsMap = [apiEndpoint, stream];
        stream.children.forEach(streamChild => {
          return this.addStream(apiEndpoint, streamChild);
        });
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
      let queryParams = {};
      try {
        const result = await connection.getEventsStreamed(
          queryParams,
          this.forEachEvent
        );
        console.log(result);
        this.eventsMap = [connection.apiEndpoint, this.events];
      } catch (e) {
        console.log("Error occurred when retrieving events " + e);
        return false;
      }
      return true;
    },
    forEachEvent(event) {
      this.events.push(event);
      this.typesSet.add(event.type);
      this.types = this.typesSet;
    },
    updateStore(connection) {
      if (
        this.addConnectionToStore(connection) &&
        this.addStreamsToStore(connection) &&
        this.addAccessInfoToStore(connection) &&
        this.addEventsToStore(connection)
      ) {
        console.log("successfully loaded");
        return true;
      }
      return false;
    },
    updateSessionStorage(connection, cookie) {
      if (this.addAPIEndpointsToSessionStorage(connection, cookie)) {
        this.updateStore(connection)
          ? this.$router.push("events")
          : console.log("Some error occured when loading");
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
<style scoped>
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
