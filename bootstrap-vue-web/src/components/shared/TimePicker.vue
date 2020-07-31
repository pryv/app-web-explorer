<template>
  <b-input-group class="mb-3">
    <b-form-input
      :value="value"
      type="text"
      placeholder="YYYY-MM-DD"
      autocomplete="off"
      :disabled="disabled"
      style="font-size: 0.75rem !important;"
    ></b-form-input>
    <b-input-group-append>
      <b-form-datepicker
        :value="value"
        button-only
        right
        locale="en-US"
        aria-controls="example-input"
        @context="fireParentEvent"
        :disabled="disabled"
      ></b-form-datepicker>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: "TimePicker",
  props: {
    value: {
      required: true,
    },
    disabled: {
      required: true,
    },
  },
  methods: {
    fireParentEvent: function(val) {
      this.$emit("updateFilter", val);
    },
  },
};
</script>
