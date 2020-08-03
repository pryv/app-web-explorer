<template>
  <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
    <div class="bg-white py-2" style="width: 80%;">
      <div class="card-style events-card">
        <h4>Events Panel</h4>
      </div>
      <FilterPanel></FilterPanel>
      <br />
      <div>
        <b-card no-body>
          <PryvAlert
            v-if="fetchData.length == 0"
            :show="show"
            :message="message"
          ></PryvAlert>
          <b-tabs card>
            <b-tab title="JSON VIEW" active>
              <b-card-text style="text-align: left">
                <vue-json-pretty :path="'res'" :data="this.displayJSON">
                </vue-json-pretty>
              </b-card-text>
            </b-tab>
            <b-tab title="TABLE VIEW">
              <b-card-text>
                <div>
                  <b-table responsive striped hover :items="fetchData">
                  </b-table>
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
import { mapState } from "vuex";
import VueJsonPretty from "vue-json-pretty";
import PryvAlert from "../components/shared/PryvAlert";
import FilterPanel from "../components/filters/FilterPanel";
import { filterTagsSort, states } from "../utilities/constants";

export default {
  name: "Events",
  components: {
    FilterPanel,
    PryvAlert,
    VueJsonPretty,
  },
  data() {
    return {
      fetchData: [],
      show: true,
      message: "No info available to display.",
      typesSet: new Set(),
    };
  },
  computed: {
    ...mapState(["selectedStreams"]),
    ...mapState(["selectedFilters"]),
    ...mapState(["events_map"]),
    displayJSON() {
      return this.fetchData.length > 0
        ? this.fetchData
        : "No events to display";
    },
    types: {
      get() {
        return this.$store.state.types;
      },
      set(value) {
        this.$store.commit("SET_TYPES", value);
      },
    },
  },
  async created() {
    this.displayEvents();
  },
  watch: {
    selectedStreams() {
      this.displayEvents();
      this.filterEvents(this.fetchData);
    },
    selectedFilters() {
      this.displayEvents();
      this.filterEvents(this.fetchData);
    },
  },
  methods: {
    displayEvents() {
      this.fetchData = [];
      this.typesSet = new Set();
      if (!this.selectedStreams) {
        return;
      }
      let selectedEvents = [];
      for (const [key, value] of Object.entries(this.selectedStreams)) {
        for (let i = 0; i < value.length; i++) {
          selectedEvents = this.events_map[key].filter(
            event => event.streamId == value[i]
          );
          if (selectedEvents.length > 0) this.fetchData.push(...selectedEvents);
        }
      }
    },
    filterEvents(selectedEvents) {
      if(!this.selectedFilters)
        return;
      Object.keys(this.selectedFilters).sort().forEach(e => {
        switch (e) {
          case filterTagsSort.FROM: {
            const copyFrom = selectedEvents.filter(
              function(x) {
                //Events time should be higher than to time
                return x.time > this.selectedFilters[e];
              }.bind(this)
            );
            selectedEvents = [...copyFrom];
            break;
          }
          case filterTagsSort.TO: {
            const copyTo = selectedEvents.filter(
              function(x) {
                //Events time should be less than to time
                return x.time < this.selectedFilters[e];
              }.bind(this)
            );
            selectedEvents = [...copyTo];
            break;
          }
          case filterTagsSort.TYPES: {
            const copyTypes = selectedEvents.filter(
              function(x) {
                //duration null is equal to running events
                return this.selectedFilters[e].includes(x.type);
              }.bind(this)
            );
            selectedEvents = [...copyTypes];
            break;
          }
          case filterTagsSort.RUNNING: {
            const copyRunning = selectedEvents.filter(
              function(x) {
                //duration null is equal to running events
                return x.duration === null;
              }.bind(this)
            );
            selectedEvents = [...copyRunning];
            break;
          }
          case filterTagsSort.STATE: {
            const copyStates = selectedEvents.filter(
              function(x) {
                //events in trashed state only returns the trashed attribute
                return (
                  (states.TRASHED in x && states.TRASHED === this.selectedFilters[e]) ||
                  (!(states.DEFAULT in x) &&
                    states.DEFAULT === this.selectedFilters[e]) ||
                  states.ALL === this.selectedFilters[e]
                );
              }.bind(this)
            );
            selectedEvents = [...copyStates];
            break;
          }
          case filterTagsSort.MODIFIED_SINCE: {
            const copyModified = selectedEvents.filter(
              function(x) {
                return x.time > this.selectedFilters[e];
              }.bind(this)
            );
            selectedEvents = [...copyModified];
            break;
          }
          case filterTagsSort.LIMIT: {
            const limit = parseInt(this.selectedFilters[e]);
            selectedEvents = selectedEvents.slice(0, limit);
            break;
          }
          case filterTagsSort.SORT:
            //sort ascending and descending using time attribute
            if (this.selectedFilters[e] === true)
              selectedEvents.sort((a, b) =>
                a.time > b.time ? 1 : b.time > a.time ? -1 : 0
              );
            else
              selectedEvents.sort((a, b) =>
                a.time < b.time ? 1 : b.time < a.time ? -1 : 0
              );
            break;
        }
      });
      this.fetchData = [...selectedEvents];
    },
  },
};
</script>

<style scoped>
.events-card {
  border: none;
  padding: 0.5%;
  text-align: left;
}
</style>
