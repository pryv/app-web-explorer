<template>
    <div>
        <b-container class="vh-100" fluid>
            <b-row class="h-100" style="background-color: green">
                <b-col class="shadow bg-white" md="auto" style="overflow-y: auto;"><SideBarLayout/></b-col>
                <b-col style="background-color:whitesmoke">
                    <MainLayout/>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>
<script>
    import SideBarLayout from "./SideBarLayout";
    import MainLayout from "./MainLayout";
    export default {
        name: 'DashboardLayout',
        components: {MainLayout, SideBarLayout},
        props: {
            msg: String
        }
    }
</script>