<template>
  <b-card>
    <b-row>
      <b-col cols="2">
        <EnableCheckbox
          :content="fromLabel"
          @change="clickCheckboxToDisableFilter(fromLabelToSort, $event)"
          v-model="valueFromCheck"
        ></EnableCheckbox>
      </b-col>
      <b-col cols="4">
        <TimePickerFilter
          :disabled="!this.valueFromCheck"
          :value="valueFrom"
          @updateFilter="selectFiltersRelatedToDates(fromLabelToSort, $event)"
        ></TimePickerFilter>
      </b-col>
      <b-col cols="2">
        <EnableCheckbox
          :content="toLabel"
          @change="clickCheckboxToDisableFilter(toLabelToSort, $event)"
          v-model="valueToCheck"
        ></EnableCheckbox>
      </b-col>
      <b-col cols="4">
        <TimePickerFilter
          :disabled="!this.valueToCheck"
          :value="valueTo"
          @updateFilter="selectFiltersRelatedToDates(toLabelToSort, $event)"
        ></TimePickerFilter>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="2">
        <EnableCheckbox
          :content="runningLabel"
          @change="selectFilterStateOrSort(runningLabelToSort, $event)"
          v-model="valueRunning"
        ></EnableCheckbox>
      </b-col>
      <b-col cols="2">
        <EnableCheckbox
          :content="stateLabel"
          @change="clickCheckboxToDisableFilter(stateLabelToSort, $event)"
          v-model="valueStateCheck"
        ></EnableCheckbox>
      </b-col>
      <b-col cols="3">
        <DropboxFilter
          :disabled="!this.valueStateCheck"
          :options="optionsState"
          :valueSelected="valueState"
          @input="selectFilterStateOrSort(stateLabelToSort, $event)"
        />
      </b-col>
      <b-col cols="2">
        <EnableCheckbox
          :content="sortLabel"
          @change="clickCheckboxToDisableFilter(sortLabelToSort, $event)"
          v-model="valueSortCheck"
        ></EnableCheckbox>
      </b-col>
      <b-col cols="3">
        <DropboxFilter
          :disabled="!this.valueSortCheck"
          :options="optionsSort"
          :valueSelected="valueSort"
          @input="selectFilterStateOrSort(sortLabelToSort, $event)"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="2">
        <EnableCheckbox
          :content="modifiedSinceLabel"
          @change="
            clickCheckboxToDisableFilter(modifiedSinceLabelToSort, $event)
          "
          v-model="valueModifiedCheck"
        ></EnableCheckbox>
      </b-col>
      <b-col cols="4">
        <TimePickerFilter
          :disabled="!this.valueModifiedCheck"
          :value="valueModified"
          @updateFilter="
            selectFiltersRelatedToDates(modifiedSinceLabelToSort, $event)
          "
        ></TimePickerFilter>
      </b-col>
      <b-col cols="2">
        <EnableCheckbox
          :content="limitLabel"
          @change="clickCheckboxToDisableFilter(limitLabelToSort, $event)"
          v-model="valueLimitCheck"
        ></EnableCheckbox>
      </b-col>
      <b-col cols="3">
        <b-form-input
          :disabled="!this.valueLimitCheck"
          @input="selectFilterLimit"
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
          @change="clickCheckboxToDisableFilter(typeLabelToSort, $event)"
          v-model="valueTypeCheck"
        ></EnableCheckbox>
      </b-col>
      <b-col cols="2">
        <b-button
          :disabled="!this.valueTypeCheck"
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
import { mapState } from "vuex";
import EnableCheckbox from "./SingleCheckbox";
import DropboxFilter from "./DropboxFilter";
import TimePickerFilter from "./TimePickerFilter";
import ModalFilter from "./ModalFilter";
import { filterTags, filterTagsSort, states } from "../../utilities/constants";

export default {
  name: "FilterPanel",
  components: { ModalFilter, TimePickerFilter, EnableCheckbox, DropboxFilter },
  computed: {
    ...mapState(["types"]),
    updatedFilters: {
      get() {
        return this.$store.state.filters;
      },
      set(value) {
        this.$store.commit("UPDATE_FILTERS", value);
      },
    },
    optionsTypes() {
      const options = [];
      for (let item of this.types) {
        const payload = {
          text: item,
          value: item,
        };
        options.push(payload);
      }
      return options;
    },
    typesMessage() {
      return this.types.size > 0
        ? "Select multiple types to filter"
        : "You have selected no endpoints to view";
    },
  },
  data() {
    return {
      valueFrom: null,
      valueTo: null,
      valueRunning: false,
      valueState: null,
      valueSort: null,
      valueModified: null,
      valueLimit: "",
      optionsState: [
        { value: null, text: "Select the state" },
        { value: states.DEFAULT, text: "DEFAULT" },
        { value: states.TRASHED, text: "TRASHED" },
        { value: states.ALL, text: "ALL" },
      ],
      optionsSort: [
        { value: null, text: "Select the sorting order" },
        { value: true, text: "TRUE" },
        { value: false, text: "FALSE" },
      ],
      modalShow: false,
      selected: [],
      fromLabel: filterTags.FROM,
      toLabel: filterTags.TO,
      stateLabel: filterTags.STATE,
      sortLabel: filterTags.SORT,
      modifiedSinceLabel: filterTags.MODIFIED_SINCE,
      limitLabel: filterTags.LIMIT,
      typeLabel: filterTags.TYPES,
      runningLabel: filterTags.RUNNING,
      fromLabelToSort: filterTagsSort.FROM,
      toLabelToSort: filterTagsSort.TO,
      stateLabelToSort: filterTagsSort.STATE,
      sortLabelToSort: filterTagsSort.SORT,
      modifiedSinceLabelToSort: filterTagsSort.MODIFIED_SINCE,
      limitLabelToSort: filterTagsSort.LIMIT,
      typeLabelToSort: filterTagsSort.TYPES,
      runningLabelToSort: filterTagsSort.RUNNING,
      valueFromCheck: false,
      valueToCheck: false,
      valueStateCheck: false,
      valueSortCheck: false,
      valueModifiedCheck: false,
      valueLimitCheck: false,
      valueTypeCheck: false,
      modalTitle: "Select Types to Filter",
    };
  },
  methods: {
    setSelected(value) {
      this.selected = value;
    },
    selectFiltersRelatedToDates(type, ctx) {
      ctx.selectedYMD
        ? this.updateSelectedFiltersArray(
            type,
            Date.parse(ctx.selectedYMD) / 1000
          )
        : this.removeFromSelectedFiltersArray(type);
      switch (type) {
        case filterTagsSort.FROM:
          this.valueFrom = ctx.selectedYMD;
          break;
        case filterTagsSort.TO:
          this.valueTo = ctx.selectedYMD;
          break;
        case filterTagsSort.MODIFIED_SINCE:
          this.valueModified = ctx.selectedYMD;
          break;
      }
    },
    selectFilterStateOrSort(type, value) {
      value
        ? this.updateSelectedFiltersArray(type, value)
        : this.removeFromSelectedFiltersArray(type);
      switch (type) {
        case filterTagsSort.SORT:
          this.valueSort = value;
          break;
        case filterTagsSort.STATE:
          this.valueState = value;
          break;
        case filterTagsSort.RUNNING:
          this.valueRunning = value;
          break;
      }
    },
    selectFilterLimit(value) {
      if (isNaN(value)) {
        this.valueLimit = "";
        return;
      }
      this.valueLimit = value;
      this.valueLimit !== ""
        ? this.updateSelectedFiltersArray(filterTagsSort.LIMIT, parseInt(value))
        : this.removeFromSelectedFiltersArray(filterTagsSort.LIMIT);
    },
    updateSelectedFiltersArray(key, value) {
      const filteredData = Object.assign({}, this.updatedFilters);
      filteredData[key] = value;
      this.updatedFilters = Object.assign({}, filteredData);
    },
    removeFromSelectedFiltersArray(key) {
      const filteredData = Object.assign({}, this.updatedFilters);
      if (filteredData[key]) delete filteredData[key];
      this.updatedFilters = Object.assign({}, filteredData);
    },
    clickCheckboxToDisableFilter(type, value) {
      if (!value)
        switch (type) {
          case filterTagsSort.FROM:
            this.valueFrom = "";
            break;
          case filterTagsSort.TO:
            this.valueTo = "";
            break;
          case filterTagsSort.STATE:
            this.valueState = null;
            break;
          case filterTagsSort.SORT:
            this.valueSort = null;
            break;
          case filterTagsSort.MODIFIED_SINCE:
            this.valueModified = "";
            break;
          case filterTagsSort.LIMIT:
            this.valueLimit = "";
            break;
          case filterTagsSort.TYPES:
            this.selected = [];
            break;
        }
    },
    cancelTypeFilters(cancel) {
      cancel();
    },
    setTypeFilters(ok) {
      this.selected.length > 0
        ? this.updateSelectedFiltersArray(filterTagsSort.TYPES, this.selected)
        : this.removeFromSelectedFiltersArray(filterTagsSort.TYPES);
      ok();
    },
  },
};
</script>

<style>
.mt-3,
.my-3 {
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
