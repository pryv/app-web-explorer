<template>
    <div class="bg-white shadow h-100 w-100 d-flex justify-content-center align-items-center" >
        <div class="bg-white py-2" style="width: 80%;">
            <div class="card-style" style="border: none;padding: 0.5%;text-align: left;">
                <h4>Login Panel</h4>
            </div>
            <b-card class="card-style shadow">
                <Label :parent-data="APILogin"></Label>
                <APILogin></APILogin>
            </b-card>
            <b-card class="card-style shadow">
                <Label :parent-data="ButtonLogin"></Label>
                <WebButton></WebButton>
            </b-card>
            <b-card class="card-style shadow">
                <Label :parent-data="PasswordLogin"></Label>
                <UsernameLogin></UsernameLogin>
            </b-card>
            <b-card class="card-style shadow" style="border: none">
                <Label :parent-data="ServiceInfoURL"></Label>
                <ServiceInfo></ServiceInfo>
            </b-card>
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
                ServiceInfoURL : "Service Info URL"
            }
        },
        methods: {
            loginAPIEndpoint : function()
            {
                const apiEndpoint = 'https://ck6bwmcar00041ep87c8ujf90@drtom.pryv.me';
                const connection =  new this.$pryv.Connection(apiEndpoint);
                sessionStorage.setItem("token", connection.token);
                console.log(connection);
            },
            loginWebButton : function () {

            },

            async loginUsernamePassword() {
                const serviceInfoUrl = 'https://reg.pryv.me/service/info';
                const service = new this.$pryv.Service(serviceInfoUrl);
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
</style>