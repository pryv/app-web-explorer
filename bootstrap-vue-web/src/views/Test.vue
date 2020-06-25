<template>
    <div class="bg-white shadow h-100 w-100">
        <br>

        <div>
            <br><br>
            <span id="pryv-button"></span><br>
            <br>
        </div>
    </div>
</template>

<script>
    import Pryv from 'pryv';
    import PryvModel from '@/models/pryv';
    export default {
        data () {
            return {
                pryvModel: new PryvModel(),
                serviceInfoUrl : 'https://reg.pryv.me/service/info',
                connection:null,

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
                //const pryvDomain = 'pryv.me';

                var service = await Pryv.Browser.setupAuth(loadSettings(), this.serviceInfoUrl);
                console.log(service);
            },

        }
    }

    function pryvAuthStateChange(state) { // called each time the authentication state changed
        console.log('##pryvAuthStateChange', state);
        if (state.id === Pryv.Browser.AuthStates.AUTHORIZED) {
            this.connection = new Pryv.Connection(state.apiEndpoint);
        }
        if (state.id === Pryv.Browser.AuthStates.LOGOUT) {
            this.connection = null;
        }
    }

    function loadSettings() {
        return{
            authSettings : {
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
                spanButtonID: 'pryv-button',
                onStateChange: pryvAuthStateChange, // event Listener for Authentication steps
            }
        }
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