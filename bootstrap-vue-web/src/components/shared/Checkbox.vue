<template>
  <span>
    <input :checked="checked" name="checkbox-1" type="checkbox" />
    <label>
      {{ content }}
    </label>
  </span>
</template>

<script>
export default {
  name: "Checkbox",
  model: {
    prop: "checked",
    event: "change",
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
label {
  font-size: 12px;
  margin-left: 5px;
  margin-top: -5%;
}
/*input[type="checkbox"] {
  display:none;
}
input[type="checkbox"] + label::before {
  width: 15px;
  height: 15px;
  background-color: gainsboro;
  display: block;
  content: "";
  float: left;
  margin-right: 5px;
}
input[type="checkbox"]:checked+ label::after {
  background-color: #9d0717;
}*/
</style>
