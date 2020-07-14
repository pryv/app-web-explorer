<template>
    <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
        <div class="bg-white py-2" style="width: 80%;">
            <div class="card-style" style="border: none;padding: 0.5%;text-align: left;">
                <b-row>
                    <b-col cols="10">
                        <h4>Access Info Panel</h4>
                    </b-col>
                    <b-col cols="2">
                        <PryvBtn v-if="infoJSON" style="margin-top: 0;" :content="btncontent"></PryvBtn>
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
        },
        components: {
            PryvBtn,
            VueJsonPretty
        },
        data() {
            return {
                infoJSON: "",
                btncontent: "DISCONNECT",
                message: "Please select an endpoint to view the access data"
            }
        },
        methods: {
            displayAccessData() {
                var accessInfoArr = JSON.parse(this.$sessionStorage.access_info_arr);
                let obj = accessInfoArr.find(o => o.key === this.accessInfo);
                this.infoJSON = obj.val;
                console.log(obj);
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