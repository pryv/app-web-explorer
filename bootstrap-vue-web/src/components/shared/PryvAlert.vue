<template>
        <b-alert :show="show === true" variant="danger">{{message}}</b-alert>
</template>

<script>
    export default {
        name: "PryvAlert",
        props:{
            show:{
                type:Boolean
            },
            message:{
                type: String
            }
        },
    }
</script>

<style scoped>
    .alert{
        margin-top: 0.5rem;
        padding: .2rem 1.25rem;
        font-size: 12px;
    }
</style>