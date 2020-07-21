<template>
    <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
        <div class="bg-white py-2" style="width: 80%;">
            <div class="card-style" style="border: none;padding: 0.5%;text-align: left;">
                <b-row>
                    <b-col cols="10">
                        <h4>Access Info Panel</h4>
                    </b-col>
                    <b-col cols="1">
                        <PryvBtn
                                v-if="infoJSON"
                                @click="backToEvents"
                                style="margin-top: 0;"
                                :content="btncontent"
                        ></PryvBtn>
                    </b-col>
                </b-row>
            </div>
            <div>
                <b-card style="text-align: left" v-if="infoJSON">
                    <vue-json-pretty
                            :path="'res'"
                            :data="this.infoJSON"
                    ></vue-json-pretty>
                    <b-row class="justify-content-center">
                        <PryvBtn
                                v-if="infoJSON"
                                @click="logout"
                                style="margin-top: 0;"
                                :content="btncontentDisconnect"
                        ></PryvBtn>
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
            connections_map: {
                get() {
                    return this.$store.state.connections_map
                },
                set(value) {
                    this.$store.commit('DELETE_CONNECTIONS_MAP', value)
                }
            },
            streams_map: {
                get() {
                    return this.$store.state.streams_map
                },
                set(value) {
                    this.$store.commit('DELETE_STREAMS_MAP', value)
                }
            },
            access_info_map: {
                get() {
                    return this.$store.state.access_info_map
                },
                set(value) {
                    this.$store.commit('DELETE_ACCESS_INFO_MAP', value)
                }
            },
            events_map: {
                get() {
                    return this.$store.state.events_map
                },
                set(value) {
                    this.$store.commit('DELETE_EVENTS_MAP', value)
                }
            },
            infoJSON: {
                get: function () {
                    for (const [key, value] of Object.entries(this.access_info_map)) {
                        if(key === this.accessInfo)
                            return value;
                    }
                    return ""
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
                for (const [key, value] of Object.entries(this.access_info_map)) {
                    if (key.includes(this.accessInfo))
                        this.infoJSON = value;
                }
            },
            currentRouteName() {
                return this.$route.name;
            },
            backToEvents()
            {
                if (this.currentRouteName != "events") {
                    this.$router.push("events")
                }
            },
            //todo restructure the logout funcitionality
            logout()
            {
                var endpointArr = JSON.parse(this.$sessionStorage.endpoint_arr);
                let obj = endpointArr.find(o => o.key === this.accessInfo);
                if(obj.cookie)
                {
                    var test = this.$cookies.remove('pryv-libjs-web-app-explorer', '/',{domain: '.l.rec.la'});
                    console.log("remove cookies")
                    console.log(test);
                }
                endpointArr = endpointArr.filter( obj  => obj.key != this.accessInfo);
                this.$sessionStorage.endpoint_arr = JSON.stringify(endpointArr);

                var connections_map_cloned = Object.assign({}, this.connections_map);
                delete connections_map_cloned[this.accessInfo]
                this.connections_map = connections_map_cloned;

                var access_info_map_cloned = Object.assign({}, this.access_info_map);
                delete access_info_map_cloned[this.accessInfo]
                this.access_info_map = access_info_map_cloned;

                var streams_map_cloned = Object.assign({}, this.streams_map);
                delete streams_map_cloned[this.accessInfo]
                this.streams_map = streams_map_cloned;

                var events_map_cloned = Object.assign({}, this.events_map);
                delete events_map_cloned[this.accessInfo]
                this.events_map = events_map_cloned;
                if(Object.keys(this.connections_map).length === 0)
                    this.$router.push("login");
                else
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