<template functional>
  <b-button
    class="pryv-btn mt-2"
    variant="danger"
    v-on:click="listeners.click"
    :type="props.type"
  ><b-icon v-if="props.icon" :icon="props.icon" font-scale="1"></b-icon> {{props.content}}</b-button>
</template>

<script>
export default {
  name: "PryvBtn"
};
</script>

<style>
.pryv-btn {
  float: left;
  font-family: "Roboto", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: #fff;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  padding: 2px 6px;
  margin-bottom: 0;
  vertical-align: middle;
  cursor: pointer;
  background-color: #bd1727;
  border: 1px solid #9d0717;
}
</style>
