import Vue from "vue";
import Vuex from "vuex";
import { constants } from "../utilities/constants";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selected: [],
    serviceInfo: constants.DEFAULT_SERVICE_INFO_URL,
    viewAccessInfo: "", //set endpoint when clicked on info button of a connection
    viewStreamInfo: {}, // set obj with endpoint and stream id when clicked on edit stream icon
    viewStreamInfoObj: {},
    selectedStreams: {},
    connectionsMap: {},
    streamsMap: {},
    accessInfoMap: {},
    eventsMap: {},
    selectedFilters: {},
    types: new Set(),
    typesAll: {},
  },
  mutations: {
    UPDATE_CHECKBOX: (state, selected) => {
      state.selected = selected;
    },
    UPDATE_SERVICE_INFO: (state, serviceInfo) => {
      state.serviceInfo = serviceInfo;
    },
    SET_ACCESS_INFO: (state, endpoint) => {
      state.viewAccessInfo = endpoint;
    },
    //{"endpoint": endpoint, "id": id}
    SET_STREAM_INFO: (state, streamObj) => {
      state.viewStreamInfo = streamObj;
    },
    UPDATE_STREAM_INFO_OBJ: (state, streamInfoObj) => {
      state.viewStreamInfoObj = streamInfoObj;
    },
    UPDATE_SELECTED_ENDPOINTS: (state, selectedStreams) => {
      state.selectedStreams = selectedStreams;
    },
    UPDATE_SELECTED_FILTERS: (state, selectedFilters) => {
      state.selectedFilters = selectedFilters;
    },
    SET_TYPES: (state, loadTypes) => {
      state.types = loadTypes;
    },
    SET_TYPES_ALL: (state, loadAllTypes) => {
      state.typesAll = loadAllTypes;
    },
    ADD_CONNECTIONS_MAP: (state, [key, value]) => {
      Vue.set(state.connectionsMap, key, value);
    },
    DELETE_CONNECTIONS_MAP: (state, connectionsMap) => {
      state.connectionsMap = connectionsMap;
    },
    UPDATE_CONNECTIONS_MAP: (state, connectionsMap) => {
      state.connectionsMap = connectionsMap;
    },
    ADD_STREAMS_MAP: (state, [key, value]) => {
      Vue.set(state.streamsMap, key, value);
    },
    UPDATE_STREAMS_MAP: (state, streamsMap) => {
      state.streamsMap = streamsMap;
    },
    DELETE_STREAMS_MAP: (state, streamsMap) => {
      state.streamsMap = streamsMap;
    },
    ADD_ACCESS_INFO_MAP: (state, [key, value]) => {
      Vue.set(state.accessInfoMap, key, value);
    },
    UPDATE_ACCESS_INFO_MAP: (state, accessInfoMap) => {
      state.accessInfoMap = accessInfoMap;
    },
    DELETE_ACCESS_INFO_MAP: (state, accessInfoMap) => {
      state.accessInfoMap = accessInfoMap;
    },
    ADD_EVENTS_MAP: (state, [key, value]) => {
      Vue.set(state.eventsMap, key, value);
    },
    UPDATE_EVENTS_MAP: (state, eventsMap) => {
      state.eventsMap = eventsMap;
    },
    DELETE_EVENTS_MAP: (state, eventsMap) => {
      state.eventsMap = eventsMap;
    },
  },
  getters: {
    getSelected() {
      return this.state.selected;
    },
    getServiceInfo() {
      return this.state.serviceInfo;
    },
    getAccessInfo() {
      return this.state.viewAccessInfo;
    },
    getStreamInfo() {
      return this.state.viewStreamInfo;
    },
    getStreamInfoObj() {
      return this.state.viewStreamInfoObj;
    },
    getSelectedStreams() {
      return this.state.selectedStreams;
    },
    getSelectedFilters() {
      return this.state.filters;
    },
    getSelectedTypes() {
      return this.state.types;
    },
    getConnectionsMap() {
      return this.state.connectionsMap;
    },
    getStreamsMap() {
      return this.state.streamsMap;
    },
    getAccessInfoMap() {
      return this.state.accessInfoMap;
    },
    getEventsMap() {
      return this.state.eventsMap;
    },
    getAllTypes() {
      return this.state.typesAll;
    },
  },
});

export default store;
