<template>
  <div class="bg-white shadow h-100 w-100">
    <h1>Login</h1>
    <div>
      <b-button @click="loginAPIEndpoint">API ENDPOINT - Login</b-button>
    </div>
    <br>
    <div>
      <span id="pryv-button"></span>
      <b-button @click="loginWebButton">Web Button - Login</b-button>
    </div>
    <br>
    <div>
      <b-button @click="loginUsernamePassword">Username,Password - Login</b-button>
    </div>
    <br>
  </div>
</template>

<script>
  import Pryv from "pryv";
  export default {
    methods: {
      loginAPIEndpoint : function()
      {
        const apiEndpoint = 'https://ck6bwmcar00041ep87c8ujf90@drtom.pryv.me';
        const connection = new Pryv.Connection(apiEndpoint);
        console.log(connection);
        alert(connection);
      },
      loginWebButton : function () {

      },

      async loginUsernamePassword() {
        const serviceInfoUrl = 'https://reg.pryv.me/service/info';
        const service = new Pryv.Service(serviceInfoUrl);
        var username = "yasara94";
        var password = "qY8uaambYQ2d7j5";
        const appId = 'app-web-access-test';
        const connection = await service.login(username, password, appId);
        console.log(connection);
        alert(connection);
      }

    },
  }
</script>
