<template>
    <b-input
            class="pryv-input"
            :id="id"
            :placeholder="placeholder"
            :value="value"
            :appendIcon="visiblePass ? 'lock_open' : 'lock'"
            :type="visiblePass ? 'text' : 'password'"
            @input="$emit('inputpassword', $event)"
            @click:append="() => (visiblePass = !visiblePass)"
    ></b-input>
</template>

<script>
    export default {
        name: "PryvPassword",
        props: {
            value: {type: String, default: ''},
            placeholder: {type: String},
            id: {type: String}
        },
        data: () => ({
            visiblePass: false,
        }),
    }

</script>

<style scoped>
    .pryv-input {
        font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 12px;
        line-height: 20px;
        text-decoration: none;
        display: inline-block;
        padding: 2px 6px;
        margin-bottom: 0;
        vertical-align: middle;
        cursor: pointer;
    }
</style>