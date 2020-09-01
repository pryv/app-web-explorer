<template>
  <div class="text-left"><span id="pryv-button"></span><br /></div>
</template>

<script>
import Pryv from "pryv";
import { mapState } from "vuex";
export default {
  name: "WebButton",
  computed: {
    ...mapState(["serviceInfoMap"]),
  },
  async mounted() {
    await this.loadButton();
  },
  methods: {
    async loadButton() {
      await Pryv.Browser.setupAuth(loadSettings.call(this), this.serviceInfoMap["web"]);
    },
  },
};

async function pryvAuthStateChange(state) {
  let connection = null;
  if (state.id === Pryv.Browser.AuthStates.AUTHORIZED) {
    connection = new Pryv.Connection(state.apiEndpoint);
    connection
      ? this.$emit("authenticated", connection, true)
      : console.log("Error with Web Login");
  }
  if (state.id === Pryv.Browser.AuthStates.INITIALIZED) {
    connection = null;
  }
}

function loadSettings() {
  return {
    spanButtonID: "pryv-button", // span id the DOM that will be replaced by the Service specific button
    onStateChange: pryvAuthStateChange.bind(this), // event Listener for Authentication steps
    authRequest: {
      requestingAppId: "web-app-explorer",
      requestedPermissions: [
        {
          streamId: "*",
          level: "manage",
        },
      ],
      clientData: {
        "app-web-auth:description": {
          type: "note/txt",
          content: "This is a consent message.",
        },
      },
    },
  };
}
</script>