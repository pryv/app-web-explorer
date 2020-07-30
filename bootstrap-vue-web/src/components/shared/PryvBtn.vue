<template functional>
    <b-button
            v-text="props.content"
            class="pryv-btn mt-2"
            variant="danger"
            v-on:click="listeners.click"
    ></b-button>
</template>

<script>
    export default {
        name: 'PryvBtn',
        props: {
            content: {
                required: true,
                type: String
            }
        }
    }
</script>

<style>
    .pryv-btn {
        float: left;
        font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 12px;
        line-height: 20px;
        color: #FFF;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        padding: 2px 6px;
        margin-bottom: 0;
        vertical-align: middle;
        cursor: pointer;
        background-color: #BD1727;
        border: 1px solid #9D0717;
    }
</style>