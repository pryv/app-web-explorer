<template functional>
  <b-button
    class="pryv-btn-style mt-2"
    :variant="props.variant ? props.variant : 'danger'"
    v-on:click="listeners.click"
    :type="props.type"
  ><b-icon v-if="props.icon" :icon="props.icon" font-scale="1"></b-icon> {{props.content}}</b-button>
</template>

<script>
export default {
  name: "PryvBtn"
};
</script>