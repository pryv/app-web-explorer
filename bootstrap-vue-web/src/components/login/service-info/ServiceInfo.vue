<template>
    <div>
        <b-form>
            <b-input-group class="mb-4 mr-sm-4 mb-sm-0">
                <PryvInput
                        :id="id"
                        :placeholder="placeholder"
                        @updateInput="updateServiceInfoUrl"
                        v-model="serviceinfourl"
                        :disabled="disabled"
                ></PryvInput>
            </b-input-group>
        </b-form>
        <div class="pt-2">
            <h6 style="text-align: left;font-size: smaller">{{ServiceInfo}}</h6>
            <b-card class="card-style service-info-container">
                <div class="service-info-content">
                    "register": {{register}} <br>
                    "access": {{access}} <br>
                    "api": {{api_v}} <br>
                    "name": {{name}} <br>
                    "home": {{home}} <br>
                    "support": {{support}} <br>
                    "terms": {{terms}} <br>
                    "eventTypes": {{eventTypes}}<br>
                    "assets-": {{assets}}<br>
                    <!--todo remove this line
                    "assets": {<br>
                    <span style="margin-left: 5%;">"definitions": "https://pryv.github.io/assets-pryv.me/index.json"</span><br>
                    }-->
                </div>
            </b-card>
        </div>
    </div>

</template>

<script>
    import PryvInput from "../../shared/PryvInput";
    import Constants from "../../../utilities"

    export default {
        name: "APILogin",
        components: { PryvInput},
        data() {
            return {
                endpoint: Constants.DEFAULT_SERVICE_INFO_URL,
                btncontent:"Login",
                id:"input-service-info-url",
                placeholder:"Enter Service Endpoint",
                ServiceInfo: "Service Info",
                serviceinfourl : "https://reg.pryv.me/service/info",
                disabled:true,
                register:'',
                access:'',
                api_v:'',
                name:'',
                home:'',
                support:'',
                terms:'',
                eventTypes:'',
                assets:''
            }
        },
        async created() {
            const serviceInfoUrl = 'https://reg.pryv.me/service/info';
            const service = new this.$pryv.Service(serviceInfoUrl);
            const serviceInfo = (await service.info());
            this.register = serviceInfo.register;
            this.access = serviceInfo.access;
            this.api_v = serviceInfo.api;
            this.name = serviceInfo.name;
            this.home = serviceInfo.home;
            this.support = serviceInfo.support;
            this.terms = serviceInfo.terms;
            this.eventTypes = serviceInfo.eventTypes;
            this.assets = serviceInfo.assets;
        },
        methods :{
            updateServiceInfoUrl : function (val) {
                this.endpoint = val;
            }
        }
    }
</script>
<style scoped>
    .card-body{
        padding: 0.5rem !important;
    }
    .service-info-container{
        max-height: 150px;
        overflow-y: auto;
    }

    .service-info-content{
        text-align: left;
        font-size: 11px;
    }
</style>