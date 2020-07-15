import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
        selected: [],
        serviceInfo: "",
        accessInfo: "",
        selectedStreams: {},
        connection: {},
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
        }
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
        }
    }
});

export default store;

