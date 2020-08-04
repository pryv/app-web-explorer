<template functional>
  <b-row>
    <b-col cols="1" class="p-0">
      <a target="_blank" :href="props.href" v-if="props.href">
        <b-img src="../../assets/link.png" width="10px"></b-img>
      </a>
    </b-col>
    <b-col cols="11" class="text-left p-0">
      <h5 class="pryv-label pl-3 mb-2" v-text="props.parentData"></h5>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "PryvLabel",
};
</script>

<style scoped>
.pryv-label {
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  display: inline-block;
  padding: 2px 6px;
  padding-left: 0 !important;
  margin-bottom: 0;
  vertical-align: middle;
  margin-left: -2%;
  font-size: 1rem !important;
}
</style>
