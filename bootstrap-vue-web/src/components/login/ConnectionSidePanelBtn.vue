<template>
  <b-row>
    <b-button
      @click="$router.push('login')"
      class="w-100"
      style="text-align: left"
      variant="light"
    >
      <b-icon icon="plus" font-scale="1.5"></b-icon>
      Connection
    </b-button>
  </b-row>
</template>
<script>
export default {
  name: "ConnectionSidePanelBtn",
};
</script>
