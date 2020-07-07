<template>
    <div style="text-align: left;">
        <b-form-checkbox-group style="padding-left: 0;"
                               id="flavors"
                               class="ml-4"
                               stacked
                               v-model="value"
                               :main="main"
        >
            <b-form-checkbox
                    class="font-weight-bold main"
                    :main="main"
                    :value="main"
                    @input="checkAll(main)"
            >{{ name[0].main }}</b-form-checkbox>
                <b-form-checkbox
                        v-for="opt in displayStreams"
                        :key="opt.value"
                        :value="opt.value"
                >{{ opt.text }}</b-form-checkbox>
            </b-form-checkbox-group>
    </div>
</template>

<script>
    export default {
        name:"StreamCheckBox",
        props: {
            value: {
                type: Array,
            },
            name: {
                type: Array,
            },
            main:{
                type:String
            }

        },
        data: function()
        {
            return {
                roleV:this.value,
            }
        },
        computed:{
            role: {
                get: function(){
                    return this.value;
                },
                set: function(val) {
                    this.$emit('input', val);
                }
            },
            displayStreams: function () {
                return this.name.filter(i => i.value)
            },
        },

        watch: {
            value: {
                handler: function(newValue) {
                        this.value=newValue
                },
                deep: true
            }
        },

        methods:{
            checkAll(val) {
                this.$emit('clickAll', val);
            },
        }
    }
</script>
<style>
    .custom-checkbox .custom-control-label::before {
        border-radius: 0rem;
     }

    .custom-control-input:checked~.custom-control-label::before {
        color: #fff;
        border-color: gray;
        background-color: gainsboro;
    }
    .custom-checkbox .custom-control-input:indeterminate~.custom-control-label::before
    {
        border-color: gray;
        background-color: gainsboro;
    }
    .custom-control-label{
        font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        display: inline-block;
        padding: 2px 6px;
        padding-left: 0 !important;
        margin-bottom: 0;
        vertical-align: middle;
        margin-left: -2%;
        font-size: 0.75rem !important;
    }
    .main{
        padding-left: 0 !important;
    }
</style>