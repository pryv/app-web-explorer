<template>
    <b-form-select
            :disabled="disabled"
            :options="options"
            :value="valueSelected"
            @input="fireParentEvent"
            class="mb-3"
            style="font-size: 0.75rem; border-radius: 0;"
    ></b-form-select>
</template>

<script>
    export default {
        name: "DropboxFilter",
        props: {
            valueSelected: {
                required: true,
            },
            options: {
                required: true,
            },
            disabled: {
                required: true,
            }
        },
        methods: {
            fireParentEvent: function (val) {
                this.$emit('input', val);
            }
        }
    }
</script>

<style scoped>

</style>