<template>
    <div class="bg-white shadow h-100 w-100 d-flex justify-content-center" >
        <div class="bg-white py-2" style="width: 80%;">
            <div class="card-style" style="border: none;padding: 0.5%;text-align: left;">
                <h4>Login Panel</h4>
            </div>
            <div>
                <b-tabs content-class="mt-3" fill>
                    <b-tab title="Token Based Login" active><b-card-text>
                        <b-card class="card-style shadow min-height-card">
                            <Label :href="href_web" :parent-data="ButtonLogin"></Label>
                            <WebButton @authenticated="updateSessionStorage"></WebButton>
                            <br>
                            <div style="text-align: left">
                                <b-button class="pryv-btn-collapse"  v-b-toggle.collapse-1 variant="primary">View Service Info</b-button>
                                <b-collapse id="collapse-1" class="mt-2">
                                    <b-card class="card-style shadow" style="border: none">
                                        <Label :href="href_service_info" :parent-data="ServiceInfoURL"></Label>
                                        <ServiceInfo></ServiceInfo>
                                    </b-card>
                                </b-collapse>
                            </div>
                        </b-card>
                    </b-card-text></b-tab>
                    <b-tab title="Username, Password Login"><b-card-text>
                        <b-card class="card-style shadow">
                            <Label :href="href_manual" :parent-data="PasswordLogin"></Label>
                            <UsernameLogin @authenticated="updateSessionStorage"></UsernameLogin>
                            <br>
                            <div style="text-align: left">
                                <b-button class="pryv-btn-collapse"  v-b-toggle="'collapse-2'" variant="primary">View Service Info</b-button>
                                <b-collapse id="collapse-2" class="mt-2">
                                    <b-card class="card-style shadow" style="border: none">
                                        <Label :href="href_service_info" :parent-data="ServiceInfoURL"></Label>
                                        <ServiceInfo></ServiceInfo>
                                    </b-card>
                                </b-collapse>
                            </div>
                        </b-card>
                    </b-card-text></b-tab>
                    <b-tab title="API Endpoint Login"><b-card-text>
                        <b-card class="card-style shadow">
                        <Label :href="href_api" :parent-data="APILogin"></Label>
                        <APILogin @authenticated="updateSessionStorage"></APILogin>
                    </b-card></b-card-text></b-tab>
                </b-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import APILogin from "../components/login/api-login/APILogin";
    import Label from "../components/shared/PryvLabel";
    import WebButton from "../components/login/web-button-login/WebButtonLogin";
    import UsernameLogin from "../components/login/username-password-login/UsernameLogin";
    import ServiceInfo from "../components/login/service-info/ServiceInfo";
    export default {
        components: {ServiceInfo, UsernameLogin, WebButton, Label, APILogin},
        data(){
            return {
                APILogin:"Login Using API",
                ButtonLogin : "Login using Web Button",
                PasswordLogin : "Login using Username, Password",
                ServiceInfoURL : "Service Info URL",
                href_api:"https://github.com/pryv/lib-js#using-an-api-endpoint",
                href_web:"https://github.com/pryv/lib-js#within-a-webpage-with-a-login-button",
                href_manual:"https://github.com/pryv/lib-js#using-servicelogin-trusted-apps-only",
                href_service_info : "https://github.com/pryv/lib-js#usage-of-pryvservice"
            }
        },
        methods:{
            addToSessionStorageConnectionArray(id, value) {
                var existing = this.$sessionStorage.connection_arr;
                existing = existing ? JSON.parse(existing) : [];
                if (existing.filter(e => e.key === id).length > 0) {
                    return false;
                }
                existing.push({
                    key:id,
                    val:value
                });
                // Save back to session
                this.$sessionStorage.connection_arr = JSON.stringify(existing);
                return true;
            },
            addToSessionStorageAccessInfoArray(id, value) {
                var existing = this.$sessionStorage.access_info_arr;
                existing = existing ? JSON.parse(existing) : [];

                if (existing.filter(e => e.key === id).length > 0) {
                    return false;
                }

                existing.push({
                    key:id,
                    val:value
                });
                // Save back to session
                this.$sessionStorage.access_info_arr = JSON.stringify(existing);
                return true
            },
            updateSessionStorage(connection, access_info)
            {

                if(this.addToSessionStorageConnectionArray(connection.token,connection) &&
                    this.addToSessionStorageAccessInfoArray(connection.token,access_info))
                    this.$router.push("access");

            }
        }
    }
</script>
<style scoped>
    .card-body{
        padding: 0.75em !important;
    }

    .card-style{
        background-color: white;
        padding: 1%;
        margin: 1.5%;
    }
    .shadow{
        box-shadow: 0 .5rem 1rem rgba(0,0,0,.1)!important;
    }

    .min-height-card{
        /*min-height: 500px;*/
    }

    .pryv-btn-collapse{
        font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
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

    .btn-primary:not(:disabled):not(.disabled).active, .btn-primary:not(:disabled):not(.disabled):active, .show>.btn-primary.dropdown-toggle {
        color: #fff;
        background-color: dimgray;
        border: none;
        border-color: lightgrey;
        border-radius: 0;
    }

    primary:not(:disabled):not(.disabled).active:focus, .btn-primary:not(:disabled):not(.disabled):active:focus, .show>.btn-primary.dropdown-toggle:focus {
        box-shadow: 0 0 0 0.2rem white !important;
    }

    .btn-primary.focus, .btn-primary:focus {
        box-shadow: 0 0 0 0.2rem white !important;
    }

    tab-style {
        color: #BD1727;
        text-decoration: none;
        background-color: transparent;
    }
</style>