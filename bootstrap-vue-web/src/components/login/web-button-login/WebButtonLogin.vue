<template>
        <div style="text-align: left;">
            <span id="pryv-button"></span><br>
        </div>
</template>

<script>
    import Pryv from 'pryv';
    import PryvModel from '@/models/pryv';
    import ACCESS_INFO_API from "../../../utilities/api"
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
                var service = await Pryv.Browser.setupAuth(loadSettings(this), this.serviceInfoUrl);
                console.log(service);
            },
        },
    }

    async function pryvAuthStateChange(state) { // called each time the authentication state changed
        console.log('##pryvAuthStateChange', state);
        let connection = null;
        if (state.id === Pryv.Browser.AuthStates.AUTHORIZED) {
            connection = new Pryv.Connection(state.apiEndpoint);
            if(connection)
            {
                const result = await connection.api(ACCESS_INFO_API.ACCESS_INFO_API);
                if(result)
                {
                    this.$emit("authenticated", connection , result[0], true);
                }
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
                //this.$emit("authenticated", false);
                //this.$router.push("home");
            }
        }
    }

    function loadSettings(that) {
        return {
            spanButtonID: 'pryv-button', // span id the DOM that will be replaced by the Service specific button
            // eslint-disable-next-line no-undef
            onStateChange: pryvAuthStateChange.bind(that), // event Listener for Authentication steps
            authRequest: { // See: https://api.pryv.com/reference/#auth-request
                requestingAppId: 'web-app-explorer',
                requestedPermissions: [
                    {
                        streamId: '*',
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