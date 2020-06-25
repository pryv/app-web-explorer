<template>
    <b-row class="justify-content-center h-100 px-2 py-3 pt-4 align-items-center" >
        <router-view />
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