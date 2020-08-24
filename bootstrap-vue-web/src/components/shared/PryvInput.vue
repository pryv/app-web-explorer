<template>
  <b-input
    class="pryv-input"
    :id="id"
    :placeholder="placeholder"
    @input="$emit('textInput', $event)"
    :value="value"
    :type="type"
    :disabled="disabled"
    :required="required"
  ></b-input>
</template>

<script>
export default {
  name: "PryvInput",
  props: {
    value: { type: String, default: "" },
    placeholder: { type: String },
    id: { type: String },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    type: { type: String, default: "text" },
  },
};
</script>

<style scoped>
.pryv-input {
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  line-height: 20px;
  text-decoration: none;
  display: inline-block;
  padding: 2px 6px;
  margin-bottom: 0;
  vertical-align: middle;
  cursor: pointer;
}
</style>