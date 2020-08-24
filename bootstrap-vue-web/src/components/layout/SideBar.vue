<template>
  <div class="max-width">
    <b-row align-v="center" class="pt-2">
      <b-img
        alt="Responsive image"
        center
        src="../../assets/img/logo-pryv.png"
      ></b-img>
    </b-row>
    <br />
    <ConnectionSidePanelBtn />
    <br />
    <GroupCheckBox></GroupCheckBox>
  </div>
</template>
<script>
import ConnectionSidePanelBtn from "../login/ConnectionSidePanelBtn";
import GroupCheckBox from "../shared/GroupCheckBox";

export default {
  name: "SideBar",
  components: { ConnectionSidePanelBtn, GroupCheckBox },
};
</script>
<style>
  .max-width{
    max-width: 450px;
    min-width: 450px;
  }
</style>