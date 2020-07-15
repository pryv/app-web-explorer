<template>
    <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
        <div class="bg-white py-2" style="width: 80%;">
            <div class="card-style" style="border: none;padding: 0.5%;text-align: left;">
                <h4>Events Panel</h4>
            </div>
            <FilterPanel></FilterPanel>
            <br>
            <div>
                <b-card no-body>
                    <PryvAlert v-if="fetchData.length == 0" :show="show" :message="message"></PryvAlert>
                    <b-tabs card>
                        <b-tab title="JSON VIEW" active>
                            <b-card-text style="text-align: left">
                                <vue-json-pretty
                                        :path="'res'"
                                        :data="this.displayJSON"
                                >
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
    import {mapState} from 'vuex';
    import VueJsonPretty from 'vue-json-pretty'
    import PryvAlert from "../components/shared/PryvAlert";
    import FilterPanel from "../components/shared/FilterPanel";

    export default {
        name: "Events",
        components: {
            FilterPanel,
            PryvAlert,
            VueJsonPretty
        },
        data() {
            return {
                fetchData: [],
                show: true,
                message: "No info available to display.",
                typesSet: new Set(),
            }
        },
        computed: {
            ...mapState(['selectedStreams']),
            ...mapState(['filters']),
            displayJSON() {
                const display = (this.fetchData.length > 0) ? this.fetchData : "No events to display";
                return display;

            },
            queryParams() {
                return this.filters;
            },
            types: {
                get() {
                    return this.$store.state.types
                },
                set(value) {
                    this.$store.commit('SET_TYPES', value)
                }
            }
        },
        async created() {
            this.displayEvents();
        },
        watch: {
            selectedStreams() {
                this.displayEvents();
            },
            filters() {
                this.displayEvents();
            }
        },
        methods: {
            async displayEvents() {
                var connectionArr = JSON.parse(this.$sessionStorage.connection_arr);
                this.fetchData = [];
                this.typesSet = new Set();
                if (!this.selectedStreams) {
                    return;
                }
                console.log("Display Events");
                console.log(this.selectedStreams)
                for (var i = 0; i < connectionArr.length; i++) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (this.selectedStreams.hasOwnProperty(connectionArr[i].key) && this.selectedStreams[connectionArr[i].key].length > 0) {
                        const connObj = connectionArr[i].val
                        var url = connObj.endpoint.replace(/(^\w+:|^)\/\//, '');
                        var endpoint = 'https://' + connObj.token + '@' + url
                        const connection = new this.$pryv.Connection(endpoint);

                        let streams = [];
                        for (let j = 0; j < this.selectedStreams[connectionArr[i].key].length; j++) {
                            if (this.selectedStreams[connectionArr[i].key][j] === connectionArr[i].key)
                                continue;
                            let stream = this.selectedStreams[connectionArr[i].key][j].replace(connectionArr[i].key, '');
                            if (stream === "*")
                                continue;
                            streams.push(stream);
                        }
                        if (streams.length > 0)
                            this.queryParams["streams"] = streams;
                        else
                            delete this.queryParams["streams"];
                        console.log("query params");
                        console.log(this.filters);
                        try {
                            const result = await connection.getEventsStreamed(this.queryParams, this.forEachEvent);
                            const resultTypes = await connection.getEventsStreamed({}, this.getTypeForEachEvent);
                            console.log("results");
                            console.log(result)
                            console.log(resultTypes)
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
            },

            forEachEvent(event) {
                this.fetchData.push(event);
            },

            getTypeForEachEvent(event) {
                this.typesSet.add(event.type);
                this.types = this.typesSet;
            }
        }
    }

</script>

<style scoped>

</style>