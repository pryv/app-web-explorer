<template>
    <div style="max-width: 450px;min-width: 200px;">
        <b-row class="pt-2" align-v="center"><b-img src="../../assets/img/logo-pryv.png" center alt="Responsive image"></b-img></b-row>
        <br>
        <ConnectionSidePanelBtn/>
        <br>
        <!--<GroupCheckBox></GroupCheckBox>-->
        <CheckboxTest></CheckboxTest>
    </div>
</template>
<script>
    import ConnectionSidePanelBtn from "../login/ConnectionSidePanelBtn";
    import CheckboxTest from "../shared/CheckboxTest";
    //import GroupCheckBox from "../shared/GroupCheckBox";
    export default {
        name: 'SideBarLayout',
        components: { CheckboxTest, ConnectionSidePanelBtn},
        props: {
            msg: String
        }
    }
</script>