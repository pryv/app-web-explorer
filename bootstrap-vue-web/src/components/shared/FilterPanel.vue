<template>
    <b-card>
        <b-row>
            <b-col cols="2">
                <b-form-checkbox
                        v-model="valueFromCheck"
                        name="checkbox-1"
                        value=true
                        unchecked-value=false
                        @change="enableDateFrom"
                >
                    From
                </b-form-checkbox>
            </b-col>
            <b-col cols="4">
                <b-input-group class="mb-3">
                    <b-form-input
                            v-model="valueFrom"
                            type="text"
                            placeholder="YYYY-MM-DD"
                            autocomplete="off"
                            :disabled="this.valueFromCheck === 'false'"
                            style="font-size: 0.75rem !important;"
                    ></b-form-input>
                    <b-input-group-append>
                        <b-form-datepicker
                                v-model="valueFrom"
                                button-only
                                right
                                locale="en-US"
                                aria-controls="example-input"
                                @context="updateFilterFromDate"
                                :disabled="this.valueFromCheck === 'false'"
                        ></b-form-datepicker>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
            <b-col cols="2">
                <b-form-checkbox
                        v-model="valueToCheck"
                        name="checkbox-1"
                        value=true
                        unchecked-value=false
                        @change="enableDateTo"
                >
                    To
                </b-form-checkbox>
            </b-col>
            <b-col cols="4">
                <b-input-group class="mb-3">
                    <b-form-input
                            v-model="valueTo"
                            type="text"
                            placeholder="YYYY-MM-DD"
                            autocomplete="off"
                            :disabled="this.valueToCheck === 'false'"
                            style="font-size: 0.75rem !important;"
                    ></b-form-input>
                    <b-input-group-append>
                        <b-form-datepicker
                                v-model="valueTo"
                                button-only
                                right
                                locale="en-US"
                                aria-controls="example-input"
                                @context="updateFilterToDate"
                                :disabled="this.valueToCheck === 'false'"
                        ></b-form-datepicker>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="2">
                <b-form-checkbox
                        v-model="valueRunning"
                        name="checkbox-1"
                        value=true
                        unchecked-value=false
                        @change="updateFilterRunning"
                >
                    Running
                </b-form-checkbox>
            </b-col>
            <b-col cols="2">
                <b-form-checkbox
                        v-model="valueStateCheck"
                        name="checkbox-1"
                        value=true
                        unchecked-value=false
                        @change="enableState"
                >
                    State
                </b-form-checkbox>
            </b-col>
            <b-col cols="3">
                <b-form-select
                        v-model="valueState"
                        :options="optionsState"
                        class="mb-3"
                        :disabled="this.valueStateCheck === 'false'"
                        style="font-size: 0.75rem; border-radius: 0;"
                        @input="updateFilterState"
                ></b-form-select>
            </b-col>
            <b-col cols="2">
                <b-form-checkbox
                        v-model="valueSortCheck"
                        name="checkbox-1"
                        value=true
                        unchecked-value=false
                        @change="enableSort"
                >
                    Sort(Asc)
                </b-form-checkbox>
            </b-col>
            <b-col cols="3">
                <b-form-select
                        v-model="valueSort"
                        :options="optionsSort"
                        class="mb-3"
                        :disabled="this.valueSortCheck === 'false'"
                        style="font-size: 0.75rem; border-radius: 0;"
                        @input="updateFilterSort"
                ></b-form-select>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="2">
                <b-form-checkbox
                        v-model="valueModifiedCheck"
                        name="checkbox-1"
                        value=true
                        unchecked-value=false
                        @change="enableDateModified"
                >
                    Modified Since
                </b-form-checkbox>
            </b-col>
            <b-col cols="4">
                <b-input-group class="mb-3">
                    <b-form-input
                            v-model="valueModified"
                            type="text"
                            placeholder="YYYY-MM-DD"
                            autocomplete="off"
                            :disabled="this.valueModifiedCheck === 'false'"
                            style="font-size: 0.75rem !important;"
                    ></b-form-input>
                    <b-input-group-append>
                        <b-form-datepicker
                                v-model="valueModified"
                                button-only
                                right
                                locale="en-US"
                                aria-controls="example-input"
                                @context="updateFilterModifiedDate"
                                :disabled="this.valueModifiedCheck === 'false'"
                        ></b-form-datepicker>
                    </b-input-group-append>
                </b-input-group>
            </b-col>
            <b-col cols="2">
                <b-form-checkbox
                        v-model="valueLimitCheck"
                        name="checkbox-1"
                        value=true
                        unchecked-value=false
                        @change="enableLimit"
                >
                    Limit
                </b-form-checkbox>
            </b-col>
            <b-col cols="3">
                <b-form-input v-model="valueLimit"
                              placeholder="Enter the limit"
                              style="font-size: 0.75rem !important;"
                              :disabled="this.valueLimitCheck === 'false'"
                              type="text"
                              @change="updateFilterLimit"
                ></b-form-input>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="1">
                <b-form-checkbox
                        v-model="valueTypeCheck"
                        name="checkbox-1"
                        value=true
                        unchecked-value=false
                        @change="enableTypes"
                >
                    Types
                </b-form-checkbox>
            </b-col>
            <b-col cols="2">
                <b-button
                        :disabled="this.valueTypeCheck === 'false'"
                        id="submitBtn"
                        @click="$bvModal.show('modal-scoped')"
                        style="font-size: 0.75rem;"
                >Modify Types
                </b-button>
            </b-col>

            <b-modal id="modal-scoped">
                <template v-slot:modal-header>
                    <!-- Emulate built in modal header close button action -->
                    <h5>Types Filter</h5>
                </template>
                <template v-slot:default>
                    <!-- Emulate built in modal header close button action -->
                    <b-form-group :label="typesLabel">
                        <b-form-checkbox-group
                                id="checkbox-group-1"
                                v-model="selected"
                                :options="optionsTypes"
                                name="flavour-1"
                        ></b-form-checkbox-group>
                    </b-form-group>
                </template>

                <template v-slot:modal-footer="{ ok, cancel }">
                    <!-- Emulate built in modal footer ok and cancel button actions -->
                    <b-button size="sm" variant="success" @click="setTypeFilters(ok)">
                        OK
                    </b-button>
                    <b-button size="sm" variant="danger" @click="cancelTypeFilters(cancel)">
                        Cancel
                    </b-button>
                </template>
            </b-modal>
        </b-row>
    </b-card>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "FilterPanel",
        computed: {
            updatedFilters: {
                get() {
                    return this.$store.state.filters
                },
                set(value) {
                    this.$store.commit('UPDATE_FILTERS', value)
                }
            },
            ...mapState(['types']),
            optionsTypes() {
                var options = [];
                for (let item of this.types) {
                    var payload = {};
                    payload["text"] = item;
                    payload["value"] = item;
                    options.push(payload);
                }
                console.log("options array")
                console.log(options)
                return options;
            },
            typesLabel() {
                if (this.types.size > 0)
                    return "Select multiple types to filter"
                else
                    return "You have selected no endpoints to view"
            }
        },
        data() {
            return {
                valueFrom: '',
                valueTo: '',
                valueRunning: 'false',
                valueState: null,
                valueSort: null,
                valueModified: '',
                valueLimit: '',
                valueFromCheck: 'false',
                valueToCheck: 'false',
                valueStateCheck: 'false',
                valueSortCheck: 'false',
                valueModifiedCheck: 'false',
                valueLimitCheck: 'false',
                valueTypeCheck: 'false',
                optionsState: [
                    {value: null, text: 'Select the state'},
                    {value: 'default', text: 'DEFAULT'},
                    {value: 'trashed', text: 'TRASHED'},
                    {value: 'all', text: 'ALL'},
                ],
                optionsSort: [
                    {value: null, text: 'Select the sorting order'},
                    {value: true, text: 'TRUE'},
                    {value: false, text: 'FALSE'}
                ],
                modalShow: false,
                selected: [], // Must be an array reference!
            }
        },
        methods: {
            updateFilterFromDate(ctx) {
                this.valueFrom = ctx.selectedYMD
                if (this.valueFrom != "") {
                    let datum = Date.parse(this.valueFrom);
                    this.updateFilters("fromTime", datum / 1000)
                } else {
                    this.removeFilterAttr("fromTime");
                }
            },
            updateFilterToDate(ctx) {
                this.valueTo = ctx.selectedYMD
                if (this.valueTo != "") {
                    let datum = Date.parse(this.valueTo);
                    this.updateFilters("toTime", datum / 1000)
                } else {
                    this.removeFilterAttr("toTime")
                }
            },
            updateFilterRunning(value) {
                this.valueRunning = value;
                if (this.valueRunning === "true")
                    this.updateFilters("running", true)
                else {
                    this.removeFilterAttr("running")
                }
            },
            updateFilterLimit(value) {
                if (value === "") {
                    this.removeFilterAttr("limit");
                    return;
                }
                if (isNaN(value)) {
                    this.valueLimit = '';
                    return;
                }
                this.valueLimit = value;
                if (this.valueLimit != "")
                    this.updateFilters("limit", parseInt(value))

            },
            updateFilterState(value) {
                this.valueState = value;
                if (this.valueState != null)
                    this.updateFilters("state", this.valueState)
                else
                    this.removeFilterAttr("state")
            },
            updateFilterSort(value) {
                this.valueSort = value;
                if (this.valueSort != null)
                    this.updateFilters("sortAscending", this.valueSort)
                else
                    this.removeFilterAttr("sortAscending")
            },
            updateFilterModifiedDate(ctx) {
                this.valueModified = ctx.selectedYMD
                if (this.valueModified != "") {
                    let datum = Date.parse(this.valueModified);
                    this.updateFilters("modifiedSince", datum / 1000)
                } else
                    this.removeFilterAttr("modifiedSince")

            },
            updateFilters(key, value) {
                var filteredData = Object.assign({}, this.updatedFilters);
                filteredData[key] = value;
                this.updatedFilters = Object.assign({}, filteredData)
            },
            removeFilterAttr(key) {
                var filteredData = Object.assign({}, this.updatedFilters);
                delete filteredData[key];
                this.updatedFilters = Object.assign({}, filteredData)
            },
            enableDateFrom(value) {
                if (value === "false") {
                    this.valueFrom = '';
                    //this.removeFilterAttr("fromTime");
                }
            },
            enableDateTo(value) {
                if (value === "false") {
                    this.valueTo = '';
                    //this.removeFilterAttr("toTime");
                }

            },
            enableState(value) {
                if (value === "false") {
                    this.valueState = null;
                    //this.removeFilterAttr("state");
                }

            },
            enableSort(value) {
                if (value === "false") {
                    this.valueSort = null;
                    //this.removeFilterAttr("sort");
                }

            },
            enableDateModified(value) {
                if (value === "false") {
                    this.valueModified = '';
                    //this.removeFilterAttr("modifiedSince");
                }
            },
            enableLimit(value) {
                if (value === "false") {
                    this.valueLimit = '';
                    this.removeFilterAttr("limit")
                }
            },
            enableTypes(value) {
                if (value === "false") {
                    this.selected = [];
                    this.removeFilterAttr("types")
                }
            },
            cancelTypeFilters(cancel) {
                cancel();
            },
            setTypeFilters(ok) {
                if (this.selected.length > 0) {
                    this.updateFilters("types", this.selected)
                } else {
                    this.removeFilterAttr("types")
                }
                ok();
            }
        }
    }
</script>

<style>
    .mt-3, .my-3 {
        margin-top: 0.5rem !important;
        font-size: 0.75rem !important;
    }

    .b-form-btn-label-control.form-control > label {
        font-size: 0.75rem !important;
    }

    .dropdown-item {
        font-size: 0.75rem !important;
    }

    .input-group > .input-group-append > .btn-group > .btn {
        font-size: 0.75rem !important;
        border-radius: 0;
    }

    .customized_div {
        padding: 0 !important;
    }
</style>