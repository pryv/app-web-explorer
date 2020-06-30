<template>
    <div>
        <b-form>
            <b-input-group class="mb-4 mr-sm-4 mb-sm-0">
                <PryvInput
                        :id="id"
                        :placeholder="placeholder"
                        @updateInput="updateServiceInfoUrl"
                ></PryvInput>
            </b-input-group>
        </b-form>
        <div class="pt-2">
            <Label :parent-data="ServiceInfo"></Label>
            <b-card class="card-style" style="border: solid;border-color: gainsboro;max-height: 150px;overflow-y: auto;">
                <div style="text-align: left;font-size: 11px;">
                    "register": "https://reg.pryv.me" <br>
                    "access": "https://access.pryv.me/access" <br>
                    "api": "https://{username}.pryv.me/" <br>
                    "name": "Pryv Lab" <br>
                    "home": "https://www.pryv.com" <br>
                    "support": "https://pryv.com/helpdesk" <br>
                    "terms": "https://pryv.com/pryv-lab-terms-of-use/" <br>
                    "eventTypes": "https://api.pryv.com/event-types/flat.json"<br>
                    "assets": {<br>
                    <span style="margin-left: 5%;">"definitions": "https://pryv.github.io/assets-pryv.me/index.json"</span><br>
                    }
                </div>
            </b-card>
        </div>
    </div>

</template>

<script>
    import PryvInput from "../../shared/PryvInput";
    import Constants from "../../../utilities"
    import Label from "../../shared/PryvLabel";

    export default {
        name: "APILogin",
        components: {Label, PryvInput},
        data() {
            return {
                endpoint: Constants.DEFAULT_SERVICE_INFO_URL,
                btncontent:"Login",
                id:"input-endpoint",
                placeholder:"Enter Service Endpoint",
                ServiceInfo: "Service Info"
            }
        },
        methods :{
            updateServiceInfoUrl : function (val) {
                this.endpoint = val;
            }
        }
    }
</script>
