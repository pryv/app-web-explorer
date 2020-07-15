<template>
    <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
        <div class="bg-white py-2" style="width: 80%;">
            <div class="card-style" style="border: none;padding: 0.5%;text-align: left;">
                <b-row>
                    <b-col cols="10">
                        <h4>Access Info Panel</h4>
                    </b-col>
                    <b-col cols="1">
                        <PryvBtn v-if="infoJSON" @click="backToEvents" style="margin-top: 0;" :content="btncontent"></PryvBtn>
                    </b-col>
                </b-row>
            </div>
            <div>
                <b-card style="text-align: left" v-if="infoJSON">
                    <vue-json-pretty
                            :path="'res'"
                            :data="this.infoJSON"
                    >
                    </vue-json-pretty>
                    <b-row class="justify-content-center">
                        <PryvBtn v-if="infoJSON" @click="logout" style="margin-top: 0;" :content="btncontentDisconnect">
                        </PryvBtn>
                    </b-row>
                </b-card>
                <b-card style="text-align: left" v-else>
                    {{message}}
                </b-card>

            </div>

        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import VueJsonPretty from 'vue-json-pretty'
    import PryvBtn from "../components/shared/PryvBtn";

    export default {
        name: "Info",
        computed: {
            ...mapState(['accessInfo']),
            infoJSON: {
                get: function () {
                    var accessInfoArr = JSON.parse(this.$sessionStorage.access_info_arr);
                    let obj = accessInfoArr.find(o => o.key === this.accessInfo);
                    if(obj === null)
                        return "";
                    return obj.val;
                }
            },
        },
        components: {
            PryvBtn,
            VueJsonPretty
        },
        data() {
            return {
                btncontent: "Back",
                message: "Please select an endpoint to view the access data",
                btncontentDisconnect : 'Disconnect'
            }
        },
        methods: {
            displayAccessData() {
                var accessInfoArr = JSON.parse(this.$sessionStorage.access_info_arr);
                let obj = accessInfoArr.find(o => o.key === this.accessInfo);
                this.infoJSON = obj.val;
                console.log(obj);
            },
            backToEvents()
            {
                this.$router.push("events");
            },
            logout()
            {
                var accessInfoArr = JSON.parse(this.$sessionStorage.access_info_arr).filter( obj  => obj.key != this.accessInfo);
                console.log(accessInfoArr);
                var connArr = JSON.parse(this.$sessionStorage.connection_arr);
                let obj = connArr.find(o => o.key === this.accessInfo);
                if(obj.cookie)
                {
                    this.$cookie.delete('pryv-libjs-web-app-explorer');
                }
                connArr = connArr.filter( obj  => obj.key != this.accessInfo);

                this.$sessionStorage.access_info_arr = JSON.stringify(accessInfoArr);
                this.$sessionStorage.connection_arr = JSON.stringify(connArr);
                this.$router.push("events");
            }
        },
        watch: {
            accessInfo() {
                this.displayAccessData();
            },
        },
    }
</script>

<style scoped>

</style>