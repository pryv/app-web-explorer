<template>
  <div>
    <b-row>
      <b-form-tags
        v-if="tags.length > 0"
        v-model="tags"
        no-outer-focus
        class="mb-2 text-left"
      >
        <ul
          id="my-custom-tags-list"
          class="list-unstyled d-inline-flex flex-wrap mb-0"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions removals"
        >
          <b-card
            v-for="tag in tags"
            :key="tag"
            tag="li"
            class="mt-1 mr-1"
            body-class="py-1 pr-2 text-nowrap"
          >
            <strong class="default-font">{{ tag }}</strong>
          </b-card>
        </ul>
      </b-form-tags>
    </b-row>
    <b-col cols="12" class="px-0">
      <b-col cols="1" class="px-0">
        <b-overlay
          :show="busy"
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block"
          @hidden="onHidden"
        >
          <b-button
            class="pryv-btn-style float-left"
            v-b-toggle.collapse-1
            variant="danger"
            ref="button"
            >Filters</b-button
          >
        </b-overlay>
      </b-col>
    </b-col>
    <br />
    <b-col cols="12" class="px-0">
      <b-collapse id="collapse-1" class="mt-2">
        <b-card class="p-3">
          <b-row>
            <b-col cols="4">
              <b-row>
                <b-col cols="4" class="text-left">
                  <Checkbox
                    :content="fromLabel"
                    @change="
                      clickCheckboxToDisableFilter(fromLabelToSort, $event)
                    "
                    v-model="valueFromCheck"
                  ></Checkbox>
                </b-col>
                <b-col cols="8" class="text-left">
                  <DatePicker
                    :disabled="this.valueFromCheck === false"
                    :value="valueFrom"
                    @updateFilter="
                      selectFiltersRelatedToDates(fromLabelToSort, $event)
                    "
                  ></DatePicker>
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="4">
              <b-row>
                <b-col cols="4" class="text-left">
                  <Checkbox
                    :content="toLabel"
                    @change="
                      clickCheckboxToDisableFilter(toLabelToSort, $event)
                    "
                    v-model="valueToCheck"
                  ></Checkbox>
                </b-col>
                <b-col cols="8" class="text-left">
                  <DatePicker
                    :disabled="this.valueToCheck === false"
                    :value="valueTo"
                    @updateFilter="
                      selectFiltersRelatedToDates(toLabelToSort, $event)
                    "
                  ></DatePicker>
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="4">
              <b-row>
                <b-col cols="4" class="text-left">
                  <Checkbox
                    :content="modifiedSinceLabel"
                    @change="
                      clickCheckboxToDisableFilter(
                        modifiedSinceLabelToSort,
                        $event
                      )
                    "
                    v-model="valueModifiedCheck"
                  ></Checkbox>
                </b-col>
                <b-col cols="8" class="text-left">
                  <DatePicker
                    :disabled="this.valueModifiedCheck === false"
                    :value="valueModified"
                    @updateFilter="
                      selectFiltersRelatedToDates(
                        modifiedSinceLabelToSort,
                        $event
                      )
                    "
                  ></DatePicker>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4">
              <b-row>
                <b-col cols="4" class="text-left">
                  <Checkbox
                    :content="stateLabel"
                    @change="
                      clickCheckboxToDisableFilter(stateLabelToSort, $event)
                    "
                    v-model="valueStateCheck"
                  ></Checkbox>
                </b-col>
                <b-col cols="8" class="text-left">
                  <Dropbox
                    :disabled="this.valueStateCheck === false"
                    :options="optionsState"
                    :valueSelected="valueState"
                    @input="selectFilterStateOrSort(stateLabelToSort, $event)"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="4">
              <b-row>
                <b-col cols="4" class="text-left">
                  <Checkbox
                    :content="sortLabel"
                    @change="
                      clickCheckboxToDisableFilter(sortLabelToSort, $event)
                    "
                    v-model="valueSortCheck"
                  ></Checkbox>
                </b-col>
                <b-col cols="8" class="text-left">
                  <Dropbox
                    :disabled="this.valueSortCheck === false"
                    :options="optionsSort"
                    :valueSelected="valueSort"
                    @input="selectFilterStateOrSort(sortLabelToSort, $event)"
                  />
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="4">
              <b-row>
                <b-col cols="4" class="text-left">
                  <Checkbox
                    :content="limitLabel"
                    @change="
                      clickCheckboxToDisableFilter(limitLabelToSort, $event)
                    "
                    v-model="valueLimitCheck"
                  ></Checkbox>
                </b-col>
                <b-col cols="8" class="text-left">
                  <b-form-input
                    :disabled="this.valueLimitCheck === false"
                    @input="selectFilterLimit"
                    placeholder="Enter the limit"
                    class="default-font"
                    type="text"
                    v-model="valueLimit"
                    @keydown.native="enter_limit_event"
                  ></b-form-input>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="4">
              <b-row>
                <b-col cols="4" class="text-left">
                  <Checkbox
                    :content="typeLabel"
                    @change="
                      clickCheckboxToDisableFilter(typeLabelToSort, $event)
                    "
                    v-model="valueTypeCheck"
                  ></Checkbox>
                </b-col>
                <b-col cols="8" class="text-left">
                  <b-button
                    :disabled="this.valueTypeCheck === false"
                    @click="$bvModal.show('modal-scoped')"
                    id="submitBtn"
                    class="default-font modify-btn"
                    >Modify Types
                  </b-button>
                </b-col>
                <TypesFilterModal
                  :label="typesMessage"
                  :options="optionsTypes"
                  :title="modalTitle"
                  :value="selected"
                  @clickCancel="cancelTypeFilters"
                  @clickOk="setTypeFilters"
                  @listChange="setSelected"
                ></TypesFilterModal>
              </b-row>
            </b-col>
            <b-col cols="4">
              <b-row>
                <b-col cols="4" class="text-left">
                  <Checkbox
                    :content="runningLabel"
                    @change="
                      selectFilterStateOrSort(runningLabelToSort, $event)
                    "
                    v-model="valueRunning"
                  ></Checkbox>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </b-col>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Checkbox from "../shared/Checkbox";
import Dropbox from "../shared/Dropbox";
import DatePicker from "../shared/DatePicker";
import TypesFilterModal from "./TypesFilterModal";
import { filterTags, filterTagsSort, states } from "../../utilities/constants";

export default {
  name: "FilterPanel",
  components: { TypesFilterModal, DatePicker, Checkbox, Dropbox },
  computed: {
    ...mapState(["types"]),
    updatedFilters: {
      get() {
        return this.$store.state.selectedFilters;
      },
      set(value) {
        this.$store.commit("UPDATE_SELECTED_FILTERS", value);
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
        ? "Select one or multiple types to filter"
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
      tags: [],
      busy: false,
    };
  },
  methods: {
    onHidden() {
      this.$refs.button.focus();
    },
    enter_limit_event(event) {
      if (event.which === 13) {
        this.busy = true;
        setTimeout(
          async function() {
            if (this.valueLimit !== "") {
              this.tags = this.tags.filter(
                value => !value.includes(filterTags.LIMIT)
              );
              this.tags.push(filterTags.LIMIT + " - " + this.valueLimit);
              this.updateSelectedFiltersArray(
                filterTagsSort.LIMIT,
                parseInt(this.valueLimit)
              );
            } else {
              this.removeFromSelectedFiltersArray(
                filterTagsSort.LIMIT,
                (this.tags = this.tags.filter(
                  value => !value.includes(filterTags.LIMIT)
                ))
              );
            }
            this.busy = false;
          }.bind(this),
          150
        );
      }
    },
    setSelected(value) {
      this.busy = true;
      this.selected = value;
      if (this.selected) {
        this.tags = this.tags.filter(
          value => !value.includes(filterTags.TYPES)
        );
        this.tags.push(filterTags.TYPES + " - " + value);
      } else {
        this.tags = this.tags.filter(
          value => !value.includes(filterTags.TYPES)
        );
      }
      this.busy = false;
    },
    selectFiltersRelatedToDates(type, ctx) {
      this.busy = true;
      ctx.selectedYMD
        ? this.updateSelectedFiltersArray(
            type,
            Date.parse(ctx.selectedYMD) / 1000
          )
        : this.removeFromSelectedFiltersArray(type);
      switch (type) {
        case filterTagsSort.FROM:
          this.valueFrom = ctx.selectedYMD;
          if (this.valueFrom) {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.FROM)
            );
            this.tags.push(filterTags.FROM + " - " + ctx.selectedYMD);
          } else {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.FROM)
            );
          }
          break;
        case filterTagsSort.TO:
          this.valueTo = ctx.selectedYMD;
          if (this.valueTo) {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.TO)
            );
            this.tags.push(filterTags.TO + " - " + ctx.selectedYMD);
          } else {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.TO)
            );
          }
          break;
        case filterTagsSort.MODIFIED_SINCE:
          this.valueModified = ctx.selectedYMD;
          if (this.valueModified) {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.MODIFIED_SINCE)
            );
            this.tags.push(filterTags.MODIFIED_SINCE + " - " + ctx.selectedYMD);
          } else {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.MODIFIED_SINCE)
            );
          }
          break;
      }
      this.busy = false;
    },
    selectFilterStateOrSort(type, value) {
      this.busy = true;
      value
        ? this.updateSelectedFiltersArray(type, value)
        : this.removeFromSelectedFiltersArray(type);
      switch (type) {
        case filterTagsSort.SORT:
          this.valueSort = value;
          if (this.valueSort) {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.SORT)
            );
            this.tags.push(filterTags.SORT + " - " + value);
          } else {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.SORT)
            );
          }
          break;
        case filterTagsSort.STATE:
          this.valueState = value;
          if (this.valueState) {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.STATE)
            );
            this.tags.push(filterTags.STATE + " - " + value);
          } else {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.STATE)
            );
          }
          break;
        case filterTagsSort.RUNNING:
          this.valueRunning = value;
          if (this.valueRunning) {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.RUNNING)
            );
            this.tags.push(filterTags.RUNNING + " - " + value);
          } else {
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.RUNNING)
            );
          }
          break;
      }
      this.busy = false;
    },
    selectFilterLimit(value) {
      if (isNaN(value)) {
        this.valueLimit = "";
        return;
      }
      this.valueLimit = value;
    },
    updateSelectedFiltersArray(key, value) {
      const filteredData = Object.assign({}, this.updatedFilters);
      filteredData[key] = value;
      this.updatedFilters = filteredData;
    },
    removeFromSelectedFiltersArray(key) {
      const filteredData = Object.assign({}, this.updatedFilters);
      if (filteredData[key]) {
        delete filteredData[key];
        this.updatedFilters = filteredData;
      }
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
            this.removeFromSelectedFiltersArray(type);
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.LIMIT)
            );
            break;
          case filterTagsSort.TYPES:
            this.selected = [];
            this.removeFromSelectedFiltersArray(type);
            this.tags = this.tags.filter(
              value => !value.includes(filterTags.TYPES)
            );
            break;
        }
    },
    cancelTypeFilters(cancel) {
      cancel();
    },
    setTypeFilters(ok) {
      this.busy = true;
      this.selected.length > 0
        ? this.updateSelectedFiltersArray(filterTagsSort.TYPES, this.selected)
        : this.removeFromSelectedFiltersArray(filterTagsSort.TYPES);
      ok();
    },
  },
};
</script>

<style scoped>
.input-group > .input-group-append > .btn-group > .btn {
  font-size: 0.75rem;
  border-radius: 0;
}
.card-body {
  width: 100%;
}

.custom-control-inline {
  margin-right: 2rem;
}

.modify-btn {
  border-radius: 0;
  width: 100%;
  padding: 2px 5px;
}
</style>
