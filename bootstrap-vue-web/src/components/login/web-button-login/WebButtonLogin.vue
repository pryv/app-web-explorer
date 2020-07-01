<template>
        <div style="text-align: left;">
            <span id="pryv-button"></span><br>
        </div>
</template>

<script>
    import Pryv from 'pryv';
    import PryvModel from '@/models/pryv';

    export default {
        name: 'WebButton',
        data () {
            return {
                pryvModel: new PryvModel(),
                serviceInfoUrl : 'https://reg.pryv.me/service/info'
            }
        },
        async created() {
            await this.pryvModel.fetchServiceInfo();
            this.loadButton();
        },

        methods : {
            async create() {
                await this.pryvModel.fetchServiceInfo();
            },
            async loadButton() {
                var service = await Pryv.Browser.setupAuth(loadSettings(), this.serviceInfoUrl);
                console.log(service);
            }
        },
    }

    function pryvAuthStateChange(state) { // called each time the authentication state changed
        console.log('##pryvAuthStateChange', state);
        let connection = null;
        if (state.id === Pryv.Browser.AuthStates.AUTHORIZED) {
            connection = new Pryv.Connection(state.apiEndpoint);
            if(connection)
            {
                //this.$sessionStorage.token = connection.token;this.$sessionStorage.connection = connection;
                sessionStorage.setItem("token", connection.token);
                sessionStorage.setItem("connection", connection);

                //self.$router.push("access");
            }
            else
            {
                console.log("Error with Web Login");
            }
        }
        if (state.id === Pryv.Browser.AuthStates.INITIALIZED) {
            connection = null;
            if(connection)
            {
                //this.$sessionStorage.token = null;
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("session");
                //this.$emit("authenticated", false);
                //this.$router.push("home");
            }
        }
    }

    function loadSettings() {
        return {
            spanButtonID: 'pryv-button', // span id the DOM that will be replaced by the Service specific button
            // eslint-disable-next-line no-undef
            onStateChange: pryvAuthStateChange, // event Listener for Authentication steps
            authRequest: { // See: https://api.pryv.com/reference/#auth-request
                requestingAppId: 'web-app-explorer',
                languageCode: 'fr', // optional (default english)
                requestedPermissions: [
                    {
                        streamId: 'test',
                        defaultName: 'test',
                        level: 'manage'
                    }
                ],
                clientData: {
                    'app-web-auth:description': {
                        'type': 'note/txt', 'content': 'This is a consent message.'
                    }
                },
                // referer: 'my test with lib-js', // optional string to track registration source
            }
        };
    }
</script>

<!-- styling for the component -->
<style>
    #InvitationDisplay {
        width:100%;
        height:100%;
    }
    table {
        margin: 0 auto; /* or margin: 0 auto 0 auto */
    }
</style>