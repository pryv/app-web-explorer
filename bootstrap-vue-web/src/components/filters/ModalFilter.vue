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
        ></b-form-checkbox-group>
      </b-form-group>
    </template>
    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button @click="$emit('clickOk', ok)" size="sm" variant="success">
        OK
      </b-button>
      <b-button
        @click="$emit('clickCancel', cancel)"
        size="sm"
        variant="danger"
      >
        Cancel
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "ModalFilter",
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
        this.$emit("listchange", value);
      },
    },
  },
};
</script>

<style scoped></style>