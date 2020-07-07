<template>
    <div class="bg-white shadow h-100 w-100 d-flex justify-content-center" >
        <div class="bg-white py-2" style="width: 80%;">
            <div class="card-style" style="border: none;padding: 0.5%;text-align: left;">
                <h4>Events Panel</h4>
            </div>
            <div>
            <b-card no-body>
                <PryvAlert v-if="fetchData.length == 0" :show="show" :message="message" ></PryvAlert>
                <b-tabs card>
                    <b-tab title="JSON VIEW" active>
                        <b-card-text style="text-align: left">
                            <vue-json-pretty
                                    :path="'res'"
                                    :data="this.displayJSON"
                                    @click="handleClick">
                            </vue-json-pretty>
                        </b-card-text>
                    </b-tab>
                    <b-tab title="TABLE VIEW">
                        <b-card-text>
                            <div>
                                <b-table responsive striped hover :items="fetchData"></b-table>
                            </div>
                        </b-card-text>
                    </b-tab>
                </b-tabs>
            </b-card>
    </div>
        </div>
    </div>
</template>

<script>
    import ACCESS_EVENTS_API from "../utilities/api"
    import { mapState } from 'vuex';
    import VueJsonPretty from 'vue-json-pretty'
    import PryvAlert from "../components/shared/PryvAlert";
    export default {
        name: "Access.vue",
        components: {
            PryvAlert,
            VueJsonPretty
        },
        data()
        {
            return {
                fetchData : [],
                show:true,
                message:"No info available to display."
            }
        },
        computed:{
            ...mapState(['selected']),
            displayJSON(){
                const display = (this.fetchData.length > 0) ? this.fetchData : "No events to display";
                return display;

            }
        },
        async created() {
            this.displayEvents();
        },
        watch: {
           selected()
           {
               this.displayEvents();
           },
        },
        methods:{
            async displayEvents()
            {
                var connectionArr = JSON.parse(this.$sessionStorage.connection_arr);
                var events = [];
                if(!this.selected)
                {
                    this.fetchData= events;
                    return;
                }
                for (var i=0; i<connectionArr.length; i++) {
                    if(this.selected.includes(connectionArr[i].key))
                    {
                        const connObj = connectionArr[i].val;
                        var url = connObj.endpoint.replace(/(^\w+:|^)\/\//, '');
                        var endpoint = 'https://'+connObj.token+'@'+url
                        const connection =  new this.$pryv.Connection(endpoint);
                        //let connection = new $pryv.connection(connObj);
                        const result = await connection.api(ACCESS_EVENTS_API.ACCESS_EVENTS_API);
                       /* let events_arr = result[0].events.map((event) => {
                            return event;
                        });

                        events.push(events_arr);*/
                        //var t = [1,2,3,4];
                        //console.log(t);
                        //console.log(result[0].events)
                        //events.push(result[0].events);
                        events.concat(result[0].events)
                        Array.prototype.push.apply(events,result[0].events);
                    }
                }
                this.fetchData= events;
            }
        }
    }

</script>

<style scoped>

</style>