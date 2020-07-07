import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
    state: {
        selected : []
    },
    mutations: {
        UPDATE_CHECKBOX : (state, selected) =>{
            // mutate state
            state.selected = selected
        }
    },
    actions: {
    },
    getters: {
        getSelected () {
            return this.state.selected;
        }
    }
});

export default store;

