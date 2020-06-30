<template>
        <b-row>
            <h6 class="pryv-label pl-3 mb-2" :parentData="parentData" v-text="parentData"></h6>
        </b-row>
</template>

<script>
    export default {
        name: "Label",
        props: {
            parentData: {
                type: String,
                default () {
                    return ''
                }
            }
        },
    }
</script>

<style scoped>
    .pryv-label{
        font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        display: inline-block;
        padding: 2px 6px;
        margin-bottom: 0;
        vertical-align: middle;
    }
</style>