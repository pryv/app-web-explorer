<template>
    <span>
        <input
                :checked="checked"
                name="checkbox-1"
                @change="fireParentEvent( $event.target.checked)"
                type="checkbox"
        />
        <label>
            {{content}}
        </label>
    </span>

</template>

<script>
    export default {
        name: "EnableCheckbox",
        model: {
            prop: 'checked',
            event: 'change'
        },
        props: {
            content: {
                required: true,
                type: String
            },
            checked:{
                required : true
            }
        },
        methods:{
            fireParentEvent : function(val){
                this.$emit('change', val);
            }
        }
    }
</script>

<style scoped>
    label{
        font-size: 12px;
        margin-left: 5px;
        margin-top: -5%;
    }
</style>