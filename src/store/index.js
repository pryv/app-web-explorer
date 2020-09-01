import Vue from "vue";
import Vuex from "vuex";
import { constants } from "../utilities/constants";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    serviceInfoMap: {
      manual: constants.DEFAULT_SERVICE_INFO_URL,
      web: constants.DEFAULT_SERVICE_INFO_URL,
    }, //seperate service info urls for web login and manual login
    viewAccessInfo: "", //set endpoint when clicked on info button of a connection
    viewStreamInfo: {}, // set obj with endpoint and stream id when clicked on edit stream icon
    viewStreamInfoObj: {}, //set streamObj when clicked on edit stream icon
    selectedStreams: {}, //{apiendpoint : selectedStreamlist[]}
    connectionsMap: {}, //apiendpoints
    streamsMap: {}, //{apiendpoint : streamlist[]}
    accessInfoMap: {}, //{apiendpoint : accessInfoList[]}
    eventsMap: {}, //{apiendpoint : eventsList[]}
    selectedFilters: {}, //{limit : 50}
    types: new Set(), //all the types of display events
    typesAll: {}, //all the types of events flat.json
    modifiedSinceMap: {}, //{apiendpoint : modifiedTime}
    eventsDisplayMap: {}, //{apiendpoint : onlyDisplayEventsList[]}
  },
  mutations: {
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
    UPDATE_SERVICE_INFO_MAP: (state, serviceInfo) => {
      state.serviceInfoMap = serviceInfo;
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
    ADD_MODIFIED_SINCE_MAP: (state, [key, value]) => {
      Vue.set(state.modifiedSinceMap, key, value);
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
    UPDATE_DISPLAY_EVENTS_MAP: (state, eventsDisplayMap) => {
      state.eventsDisplayMap = eventsDisplayMap;
    },
    ADD_DISPLAY_EVENTS_MAP: (state, [key, value]) => {
      Vue.set(state.eventsDisplayMap, key, value);
    },
    DELETE_EVENTS_MAP: (state, eventsMap) => {
      state.eventsMap = eventsMap;
    },
  },
  getters: {
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
    getModifiedSinceMap() {
      return this.state.modifiedSinceMap;
    },
    getServiceInfoMap() {
      return this.state.serviceInfoMap;
    },
  },
});

export default store;
