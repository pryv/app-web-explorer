<template>
  <span>
    <input
      :checked="checked"
      @change="$emit('change', $event.target.checked)"
      name="checkbox-1"
      type="checkbox"
    />
    <label class="label-class">
      {{ content }}
    </label>
  </span>
</template>

<script>
export default {
  name: 'Checkbox',
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    content: {
      type: String,
    },
    checked: {
      required: true,
    },
  },
};
</script>

<style>
.label-class {
  font-size: 12px;
  margin-left: 5px;
  margin-top: -5%;
}
</style>
