import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
        selected: [],
        serviceInfo: "https://reg.pryv.me/service/info",
        accessInfo: "",
        selectedStreams: {},
        connections_map: {},
        streams_map: {},
        access_info_map:{},
        events_map : {},
        filters: {},
        types:new Set(),
    },
    mutations: {
        UPDATE_CHECKBOX: (state, selected) => {
            state.selected = selected
        },
        UPDATE_SERVICE_INFO: (state, serviceInfo) => {
            state.serviceInfo = serviceInfo;
        },
        SET_ACCESS_INFO: (state, token) => {
            state.accessInfo = token;
        },
        UPDATE_SELECTED_ENDPOINTS: (state, selectedStreams) => {
            state.selectedStreams = selectedStreams
        },
        UPDATE_FILTERS: (state, selectedFilters) => {
            state.filters = selectedFilters;
        },
        SET_TYPES:(state, loadTypes) => {
            state.types = loadTypes;
        },
        ADD_CONNECTIONS_MAP:(state, [key, value]) => {
            Vue.set(state.connections_map, key, value);
        },
        DELETE_CONNECTIONS_MAP:(state,connections_map) => {
            state.connections_map = connections_map
        },
        ADD_STREAMS_MAP:(state,[key, value]) => {
            //state.streams_map.add(addStreams);
            //state.streams_map.set(key, value)
            Vue.set(state.streams_map, key, value);
        },
        DELETE_STREAMS_MAP:(state,streams_map) => {
            state.streams_map = streams_map
        },
        ADD_ACCESS_INFO_MAP:(state, [key, value]) => {
            Vue.set(state.access_info_map, key, value);
        },
        DELETE_ACCESS_INFO_MAP:(state,access_info_map) => {
            state.access_info_map = access_info_map
        },
        ADD_EVENTS_MAP:(state, [key, value]) => {
            //state.events_map = new Map(state.events_map)
            Vue.set(state.events_map, key, value);
        },
        DELETE_EVENTS_MAP:(state,events_map) => {
            state.events_map = events_map
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
            return this.state.connections_map;
        },
        getStreamsMap() {
            return this.state.streams_map;
        },
        getAccessInfoMap() {
            return this.state.access_info_map;
        },
        getEventsMap() {
            return this.state.events_map;
        },

    }
});

export default store;
