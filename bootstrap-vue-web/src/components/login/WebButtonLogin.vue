<template>
  <div style="text-align: left;"><span id="pryv-button"></span><br /></div>
</template>

<script>
import Pryv from "pryv";
import { mapState } from "vuex";
export default {
  name: "WebButton",
  computed: {
    ...mapState(["serviceInfo"]),
  },
  async mounted() {
    this.loadButton();
  },

  methods: {
    async loadButton() {
      var service = await Pryv.Browser.setupAuth(
        loadSettings(this),
        this.serviceInfo
      );
      console.log(service);
    },
  },
};

async function pryvAuthStateChange(state) {
  console.log("##pryvAuthStateChange", state);
  let connection = null;
  if (state.id === Pryv.Browser.AuthStates.AUTHORIZED) {
    connection = new Pryv.Connection(state.apiEndpoint);
    if (connection) {
      this.$emit("authenticated", connection, true);
    } else {
      console.log("Error with Web Login");
    }
  }
  if (state.id === Pryv.Browser.AuthStates.INITIALIZED) {
    connection = null;
    if (connection) {
      //todo logout
    }
  }
}

function loadSettings(that) {
  return {
    spanButtonID: "pryv-button", // span id the DOM that will be replaced by the Service specific button
    // eslint-disable-next-line no-undef
    onStateChange: pryvAuthStateChange.bind(that), // event Listener for Authentication steps
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
