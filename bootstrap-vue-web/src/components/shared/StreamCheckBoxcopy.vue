<template>
    <div style="text-align: left;">
        <b-form-group>
            <b-form-checkbox-group
                    id="flavors"
                    class="ml-4"
                    stacked
                    v-model="role"
            >
                <b-form-checkbox
                        v-for="opt in name"
                        :key="opt.value"
                        :value="opt.value"
                >{{ opt.text }}</b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>

       <!-- <div>
            Selected: <strong>{{ selected }}</strong><br>
            All Selected: <strong>{{ allSelected }}</strong><br>
            Indeterminate: <strong>{{ indeterminate }}</strong>
        </div>-->
    </div>
</template>

<script>
    export default {
        name:"StreamCheckBox",
        props: {
            value: {
                type: Array,
                required: function () {
                    return [];
                }
            },
            name: {
                type: Array,
                required: function () {
                    return [];
                }
            }

        },
        model: {
            prop: 'value',
            event: 'valueChange'
        },
        computed:{
            role: {
                get: function(){
                    return this.value;
                },
                set: function(val) {
                    this.$emit('input', val);
                }
            }
            /*loggedInUsernames()
            {
                var username_arr = JSON.parse(this.$sessionStorage.access_info_arr);
                if(!username_arr) return null;
                let usernames = username_arr.map(access_info => {
                    return access_info["val"].name;
                });
                console.log("username_arr" + typeof(usernames));
                console.log(usernames);
                return usernames;
            }*/
        },
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
</style>