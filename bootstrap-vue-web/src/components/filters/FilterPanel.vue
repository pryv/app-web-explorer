<template>
    <b-card>
        <b-row>
            <b-col cols="2">
                <EnableCheckbox
                        :content="fromLabel"
                        @change="enableDateFrom"
                        v-model="valueFromCheck"
                ></EnableCheckbox>
            </b-col>
            <b-col cols="4">
                <TimePickerFilter
                        :disabled="this.valueFromCheck === false"
                        :value="valueFrom"
                        @updateFilter="updateFilterFromDate"
                ></TimePickerFilter>
            </b-col>
            <b-col cols="2">
                <EnableCheckbox
                        :content="toLabel"
                        @change="enableDateTo"
                        v-model="valueToCheck"
                ></EnableCheckbox>
            </b-col>
            <b-col cols="4">
                <TimePickerFilter
                        :disabled="this.valueToCheck === false"
                        :value="valueTo"
                        @updateFilter="updateFilterToDate"
                ></TimePickerFilter>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="2">
                <EnableCheckbox
                        :content="runningLabel"
                        @change="updateFilterRunning"
                        v-model="valueRunning"
                ></EnableCheckbox>
            </b-col>
            <b-col cols="2">
                <EnableCheckbox
                        :content="stateLabel"
                        @change="enableState"
                        v-model="valueStateCheck"
                ></EnableCheckbox>
            </b-col>
            <b-col cols="3">
                <DropboxFilter
                        :disabled="this.valueStateCheck === false"
                        :options="optionsState"
                        :valueSelected="valueState"
                        @input="updateFilterState"/>
            </b-col>
            <b-col cols="2">
                <EnableCheckbox
                        :content="sortLabel"
                        @change="enableSort"
                        v-model="valueSortCheck"
                ></EnableCheckbox>
            </b-col>
            <b-col cols="3">
                <DropboxFilter
                        :disabled="this.valueSortCheck === false"
                        :options="optionsSort"
                        :valueSelected="valueSort"
                        @input="updateFilterSort"/>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="2">
                <EnableCheckbox
                        :content="modifiedSinceLabel"
                        @change="enableDateModified"
                        v-model="valueModifiedCheck"
                ></EnableCheckbox>
            </b-col>
            <b-col cols="4">
                <TimePickerFilter
                        :disabled="this.valueModifiedCheck === false"
                        :value="valueModified"
                        @updateFilter="updateFilterModifiedDate"
                ></TimePickerFilter>
            </b-col>
            <b-col cols="2">
                <EnableCheckbox
                        :content="limitLabel"
                        @change="enableLimit"
                        v-model="valueLimitCheck"
                ></EnableCheckbox>
            </b-col>
            <b-col cols="3">
                <b-form-input :disabled="this.valueLimitCheck === false"
                              @change="updateFilterLimit"
                              placeholder="Enter the limit"
                              style="font-size: 0.75rem !important;"
                              type="text"
                              v-model="valueLimit"
                ></b-form-input>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="2">
                <EnableCheckbox
                        :content="typeLabel"
                        @change="enableTypes"
                        v-model="valueTypeCheck"
                ></EnableCheckbox>
            </b-col>
            <b-col cols="2">
                <b-button
                        :disabled="this.valueTypeCheck === false"
                        @click="$bvModal.show('modal-scoped')"
                        id="submitBtn"
                        style="font-size: 0.75rem;padding:0.25rem"
                >Modify Types
                </b-button>
            </b-col>
            <ModalFilter
                    :label="typesMessage"
                    :options="optionsTypes"
                    :title="modalTitle"
                    :value="selected"
                    @clickCancel="cancelTypeFilters"
                    @clickOk="setTypeFilters"
                    @listchange="setSelected"
            ></ModalFilter>
        </b-row>
    </b-card>
</template>

<script>
    import {mapState} from 'vuex';
    import EnableCheckbox from "./SingleCheckbox";
    import DropboxFilter from "./DropboxFilter"
    import TimePickerFilter from "./TimePickerFilter";
    import ModalFilter from "./ModalFilter";
    import {filterTags, filterTagsSort, states} from "../../utilities/constants";

    export default {
        name: "FilterPanel",
        components: {ModalFilter, TimePickerFilter, EnableCheckbox, DropboxFilter},
        computed: {
            updatedFilters: {
                get() {
                    return this.$store.state.filters
                },
                set(value) {
                    console.log("update filters");
                    console.log(value);
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
            typesMessage() {
                if (this.types.size > 0)
                    return "Select multiple types to filter"
                else
                    return "You have selected no endpoints to view"
            },
        },
        created() {
            this.valueFromCheck = false;
        },
        data() {
            return {
                valueFrom: '',
                valueTo: '',
                valueRunning: false,
                valueState: null,
                valueSort: null,
                valueModified: '',
                valueLimit: '',
                optionsState: [
                    {value: null, text: 'Select the state'},
                    {value: states.DEFAULT, text: 'DEFAULT'},
                    {value: states.TRASHED, text: 'TRASHED'},
                    {value: states.ALL, text: 'ALL'},
                ],
                optionsSort: [
                    {value: null, text: 'Select the sorting order'},
                    {value: true, text: 'TRUE'},
                    {value: false, text: 'FALSE'}
                ],
                modalShow: false,
                selected: [], // Must be an array reference!
                fromLabel: filterTags.FROM,
                toLabel: filterTags.TO,
                stateLabel: filterTags.STATE,
                sortLabel: filterTags.SORT,
                modifiedSinceLabel: filterTags.MODIFIED_SINCE,
                limitLabel: filterTags.LIMIT,
                typeLabel: filterTags.TYPES,
                runningLabel: filterTags.RUNNING,
                valueFromCheck: false,
                valueToCheck: false,
                valueStateCheck: false,
                valueSortCheck: false,
                valueModifiedCheck: false,
                valueLimitCheck: false,
                valueTypeCheck: false,
                //modal data
                modalTitle: "Select Types to Filter"
            }
        },
        methods: {
            setSelected(value) {
                this.selected = value
            },
            updateFilterFromDate(ctx) {
                this.valueFrom = ctx.selectedYMD
                if (this.valueFrom != "") {
                    let datum = Date.parse(this.valueFrom);
                    this.updateFilters(filterTagsSort.FROM, datum / 1000)
                } else
                    this.removeFilterAttr(filterTagsSort.FROM);
            },
            updateFilterToDate(ctx) {
                this.valueTo = ctx.selectedYMD
                if (this.valueTo != "") {
                    let datum = Date.parse(this.valueTo);
                    this.updateFilters(filterTagsSort.TO, datum / 1000)
                } else
                    this.removeFilterAttr(filterTagsSort.TO)
            },
            updateFilterRunning(value) {
                this.valueRunning = value;
                if (this.valueRunning === true)
                    this.updateFilters(filterTagsSort.RUNNING, true)
                else
                    this.removeFilterAttr(filterTagsSort.RUNNING)
            },
            updateFilterLimit(value) {
                if (value === "") {
                    this.removeFilterAttr(filterTagsSort.LIMIT);
                    return;
                }
                if (isNaN(value)) {
                    this.valueLimit = '';
                    return;
                }
                this.valueLimit = value;
                if (this.valueLimit != "")
                    this.updateFilters(filterTagsSort.LIMIT, parseInt(value))

            },
            updateFilterState(value) {
                this.valueState = value;
                if (this.valueState != null)
                    this.updateFilters(filterTagsSort.STATE, this.valueState)
                else
                    this.removeFilterAttr(filterTagsSort.STATE)
            },
            updateFilterSort(value) {
                this.valueSort = value;
                if (this.valueSort != null)
                    this.updateFilters(filterTagsSort.SORT, this.valueSort)
                else
                    this.removeFilterAttr(filterTagsSort.SORT)
            },
            updateFilterModifiedDate(ctx) {
                this.valueModified = ctx.selectedYMD
                if (this.valueModified != "") {
                    let datum = Date.parse(this.valueModified);
                    this.updateFilters(filterTagsSort.MODIFIED_SINCE, datum / 1000)
                } else
                    this.removeFilterAttr(filterTagsSort.MODIFIED_SINCE)
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
                if (value === false)
                    this.valueFrom = '';
            },
            enableDateTo(value) {
                if (value === false)
                    this.valueTo = '';
            },
            enableState(value) {
                if (value === false)
                    this.valueState = null;
            },
            enableSort(value) {
                if (value === false)
                    this.valueSort = null;
            },
            enableDateModified(value) {
                if (value === false)
                    this.valueModified = '';
            },
            enableLimit(value) {
                if (value === false) {
                    this.valueLimit = '';
                    this.removeFilterAttr(filterTagsSort.LIMIT)
                }
            },
            enableTypes(value) {
                if (value === false) {
                    this.selected = [];
                    this.removeFilterAttr(filterTagsSort.TYPES)
                }
            },
            cancelTypeFilters(cancel) {
                cancel();
            },
            setTypeFilters(ok) {
                if (this.selected.length > 0) {
                    this.updateFilters(filterTagsSort.TYPES, this.selected)
                } else {
                    this.removeFilterAttr(filterTagsSort.TYPES)
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