<template>
  <div class="bg-white shadow h-100 w-100 d-flex justify-content-center">
    <div class="bg-white py-2 w-80">
      <div class="card-style events-card">
        <b-row>
          <b-col cols="10">
            <h4>Events Panel</h4>
          </b-col>
          <b-col cols="1" class="pl-0">
            <LoadStreamsBtn class="float-right" />
          </b-col>
          <b-col cols="1" class="pl-0">
            <LoadEventsBtn class="float-right" />
          </b-col>
        </b-row>
      </div>
      <FilterPanel></FilterPanel>
      <br />
      <div>
        <b-card no-body>
          <b-col cols="1" offset="11">
            <PryvBtn
              @click="$bvModal.show('modal-scoped-event')"
              id="submitBtn"
              class="mt-0 float-right"
              icon="plus"
              content="Event"
            >
            </PryvBtn>
          </b-col>
          <AddEventModal></AddEventModal>
          <b-tabs card>
            <b-tab title="TABLE VIEW" active>
              <b-card-text>
                <div>
                  <b-table
                    style="max-height: 300px"
                    :fields="fields"
                    sticky-header
                    responsive
                    striped
                    hover
                    :items="fetchData"
                  >
                    <template v-slot:cell(attachments)="data">
                      <div
                        v-if="
                          data.item.attachments &&
                            data.item.attachments.length > 0
                        "
                      >
                        <a
                          target="_blank"
                          :href="
                            `https://${data.item.endpoint}events/${data.item.id}/${data.item.attachments[0].id}?readToken=${data.item.attachments[0].readToken}`
                          "
                          >{{ data.item.attachments[0].id }}</a
                        >
                        <div>Click to view the attachment</div>
                      </div>
                      <p v-else>No Attachments</p>
                    </template>
                    <template v-slot:cell(id)="data">
                      <div>
                        <PryvBtn
                          class="mt-0 mr-5"
                          icon="check2-square"
                          @click="$bvModal.show(data.item.id)"
                        ></PryvBtn
                        >{{ data.item.id }}
                      </div>
                      <EditEventModal
                        :data="data.item"
                        :apiEndpoint="data.item.apiEndpoint"
                        :id="data.item.id"
                      ></EditEventModal>
                    </template>
                    <template v-slot:cell(content)="data">
                      <div
                        v-if="
                          data.item.content && data.item.type.includes('series')
                        "
                      >
                        {{ data.item.content.fields }}
                        <a
                          href="#"
                          @click="
                            openJSON(
                              data.item.endpoint,
                              data.item.id,
                              data.item.token
                            )
                          "
                        >
                          Click here to view data</a
                        >
                      </div>
                      <div v-else>{{ data.item.content }}</div>
                    </template>
                  </b-table>
                  <PryvAlert
                    v-if="fetchData.length == 0"
                    :show="show"
                    :message="message"
                  ></PryvAlert>
                </div>
              </b-card-text>
            </b-tab>
            <b-tab title="JSON VIEW">
              <b-card-text class="text-left">
                <vue-json-pretty :data="this.displayJSON" />
                <PryvAlert
                  v-if="fetchData.length == 0"
                  :show="show"
                  :message="message"
                ></PryvAlert>
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
import { constants, filterTagsSort, states } from "../utilities/constants";
import LoadEventsBtn from "../components/load/LoadEventsBtn";
import LoadStreamsBtn from "../components/load/LoadStreamsBtn";
import PryvBtn from "../components/shared/PryvBtn";
import EditEventModal from "../components/modals/EditEventModal";
import AddEventModal from "../components/modals/AddEventModal";

export default {
  name: "Events",
  components: {
    AddEventModal,
    EditEventModal,
    PryvBtn,
    LoadStreamsBtn,
    LoadEventsBtn,
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
      fields: [
        { key: "id", label: "Id", sortable: true },
        { key: "streamId", label: "Stream Id", sortable: true },
        { key: "type", label: "Type", sortable: true },
        {
          key: "time",
          label: "Time",
          formatter: value => {
            return new Date(value * 1000).toUTCString();
          },
          sortable: true,
        },
        { key: "content", label: "Content" },
        { key: "streamIds", label: "Stream Ids" },
        { key: "tags", label: "Tags" },
        { key: "attachments", label: "Attachments Id" },
        { key: "description", label: "Description" },
        { key: "clientData", label: "Client Data" },
        {
          key: "created",
          label: "Created",
          sortable: true,
          formatter: value => {
            return new Date(value * 1000).toUTCString();
          },
        },
        { key: "createdBy", label: "Created By" },
        {
          key: "modified",
          label: "Modified",
          sortable: true,
          formatter: value => {
            return new Date(value * 1000).toUTCString();
          },
        },
        { key: "modifiedBy", label: "Modified By" },
      ],
    };
  },
  computed: {
    ...mapState(["selectedStreams"]),
    ...mapState(["selectedFilters"]),
    ...mapState(["eventsMap"]),
    displayJSON() {
      return this.fetchData.length > 0 ? this.fetchData : " ";
    },
    types: {
      get() {
        return this.$store.state.types;
      },
      set(value) {
        this.$store.commit("SET_TYPES", value);
      },
    },
    typesAll: {
      get() {
        return this.$store.state.typesAll;
      },
      set(value) {
        this.$store.commit("SET_TYPES_ALL", value);
      },
    },
  },
  mounted() {
    this.axios.get(constants.DEFAULT_SERVICE_INFO_URL).then(response => {
      this.axios.get(response.data.eventTypes).then(response => {
        var obj = response.data.types;
        Object.keys(obj).forEach(function(k) {
          const objVal = obj[k];
          delete obj[k];
          obj[k.toLowerCase()] = objVal;
        });
        this.typesAll = obj;
      });
    });
  },
  async created() {
    this.displayEvents();
  },
  watch: {
    selectedStreams() {
      this.selectStreamsOrFilters();
    },
    selectedFilters() {
      this.selectStreamsOrFilters();
    },
    eventsMap() {
      this.selectStreamsOrFilters();
    },
  },
  methods: {
    selectStreamsOrFilters() {
      this.displayEvents();
      this.filterEvents();
    },
    displayEvents() {
      console.log("events map");
      console.log(this.eventsMap);
      this.fetchData = [];
      this.typesSet = new Set();
      if (!this.selectedStreams) {
        return;
      }
      let selectedEvents = [];
      for (const [key, value] of Object.entries(this.selectedStreams)) {
        for (let i = 0; i < value.length; i++) {
          selectedEvents = this.eventsMap[key].filter(event => {
            event.apiEndpoint = key;
            event.endpoint = key.split("@")[1];
            event.token = key.split("@")[0].replace(/(^\w+:|^)\/\//, "");
            return event.streamId == value[i];
          });
          if (selectedEvents.length > 0) this.fetchData.push(...selectedEvents);
        }
      }
    },
    filterEvents() {
      let selectedEvents = this.fetchData;
      if (!this.selectedFilters) return;
      Object.keys(this.selectedFilters)
        .sort()
        .forEach(e => {
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
                    (states.TRASHED in x &&
                      states.TRASHED === this.selectedFilters[e]) ||
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
    openJSON(endpoint, eventId, token) {
      this.axios
        .get(`https://${endpoint}events/${eventId}/series?auth=${token}`)
        .then(response => {
          console.log("response data");
          console.log(response.data);
          var myjson = JSON.stringify(response.data, null, 2);
          var x = window.open();
          x.document.open();
          x.document.write(
            "<html><body><pre>" + myjson + "</pre></body></html>"
          );
          x.document.close();
        });
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
