<template>
    <b-row class="justify-content-center h-100 px-4 align-items-center">
        <router-view/>
        <!-- <slot></slot>-->
        <!--        todo v-slot-->
    </b-row>
</template>
<script>
    export default {
        name: 'MainLayout',
        props: {
            msg: String
        }
    }
</script>