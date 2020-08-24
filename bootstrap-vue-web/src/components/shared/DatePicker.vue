<template>
  <b-input-group class="mb-3">
    <b-form-input
      :value="value"
      type="text"
      placeholder="YYYY-MM-DD"
      autocomplete="off"
      :disabled="disabled"
      class="default-font"
    ></b-form-input>
    <b-input-group-append>
      <b-form-datepicker
        :value="value"
        button-only
        right
        locale="en-US"
        aria-controls="example-input"
        @context="$emit('updateFilter', $event)"
        :disabled="disabled"
      ></b-form-datepicker>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: "DatePicker",
  props: {
    value: {
      required: true,
    },
    disabled: {
      required: true,
    },
  },
};
</script>