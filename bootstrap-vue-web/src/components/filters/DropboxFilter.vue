<template>
  <b-form-select
    :disabled="disabled"
    :options="options"
    :value="valueSelected"
    @input="fireParentEvent"
    class="mb-3 dropbox-filter"
  ></b-form-select>
</template>

<script>
export default {
  name: "DropboxFilter",
  props: {
    valueSelected: {
      required: true,
    },
    options: {
      required: true,
    },
    disabled: {
      required: true,
    },
  },
  methods: {
    fireParentEvent: function(val) {
      this.$emit("input", val);
    },
  },
};
</script>