import Vue from "vue";
import Vuex from "vuex";
import { constants } from "../utilities/constants";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    selected: [],
    serviceInfo: constants.DEFAULT_SERVICE_INFO_URL,
    accessInfo: "",
    selectedStreams: {},
    connectionsMap: {},
    streamsMap: {},
    accessInfoMap: {},
    eventsMap: {},
    selectedFilters: {},
    types: new Set(),
  },
  mutations: {
    UPDATE_CHECKBOX: (state, selected) => {
      state.selected = selected;
    },
    UPDATE_SERVICE_INFO: (state, serviceInfo) => {
      state.serviceInfo = serviceInfo;
    },
    SET_ACCESS_INFO: (state, token) => {
      state.accessInfo = token;
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
    DELETE_CONNECTIONS_MAP: (state, connectionsMap) => {
      state.connectionsMap = connectionsMap;
    },
    UPDATE_CONNECTIONS_MAP: (state, connectionsMap) => {
      state.connectionsMap = connectionsMap;
    },
    UPDATE_STREAMS_MAP: (state, streamsMap) => {
      state.streamsMap = streamsMap;
    },
    DELETE_STREAMS_MAP: (state, streamsMap) => {
      state.streamsMap = streamsMap;
    },
    UPDATE_ACCESS_INFO_MAP: (state, accessInfoMap) => {
      state.accessInfoMap = accessInfoMap;
    },
    DELETE_ACCESS_INFO_MAP: (state, accessInfoMap) => {
      state.accessInfoMap = accessInfoMap;
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
      return this.state.accessInfo;
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
  },
});

export default store;
