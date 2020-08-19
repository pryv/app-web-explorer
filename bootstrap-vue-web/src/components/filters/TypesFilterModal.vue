<template>
  <b-modal id="modal-scoped">
    <template v-slot:modal-header>
      <h5>{{ title }}</h5>
    </template>
    <template v-slot:default>
      <b-form-group :label="label">
        <b-form-checkbox-group
          :options="options"
          id="checkbox-group-1"
          name="flavour-1"
          v-model="valueLocal"
          class="pl-4"
        ></b-form-checkbox-group>
      </b-form-group>
    </template>
    <template v-slot:modal-footer="{ ok, cancel }">
      <PryvBtn
              @click="$emit('clickOk', ok)"
              class="mt-0 float-right"
              content="OK"
              icon="check"
              type="submit"
              variant="success"
      ></PryvBtn>
      <PryvBtn
              @click="$emit('clickCancel', cancel)"
              class="mt-0 float-right"
              content="Cancel"
              icon="x"
      ></PryvBtn>
    </template>
  </b-modal>
</template>

<script>
import PryvBtn from "../shared/PryvBtn";
export default {
  name: "TypesFilterModal",
  components: { PryvBtn },
  props: {
    title: {
      required: true,
      type: String,
    },
    label: {
      required: true,
    },
    options: {
      required: true,
    },
    value: {
      required: true,
    },
  },
  computed: {
    valueLocal: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        this.$emit("listChange", value);
      },
    },
  },
};
</script>

<style>
  .custom-control {
    padding-left: 1.5rem;
  }
  .custom-control-inline{
    margin-right: 3rem;
  }
</style>
