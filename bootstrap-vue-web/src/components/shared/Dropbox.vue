<template>
  <b-form-select
    :disabled="disabled"
    :options="options"
    :value="valueSelected"
    @input="$emit('input', $event)"
    class="mb-3 dropbox-filter"
  ></b-form-select>
</template>

<script>
export default {
  name: "Dropbox",
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
};
</script>