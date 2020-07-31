<template functional>
  <b-alert :show="props.show" variant="danger">{{ props.message }} </b-alert>
</template>

<script>
export default {
  name: "PryvAlert",
};
</script>

<style scoped>
.alert {
  margin-top: 0.5rem;
  padding: 0.2rem 1.25rem;
  font-size: 12px;
}
</style>
