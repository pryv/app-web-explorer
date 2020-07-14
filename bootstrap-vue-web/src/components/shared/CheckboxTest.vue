<template>
    <div style="text-align: left;">
        <b-form-group>
            <b-form-checkbox-group
                    class="main"
                    v-model="selected"
                    plain
                    stacked
            >
                <!--<div class="form-check" :key="opt.value" v-for="opt in loggedInUsernames">
                <input type="checkbox" :value="opt.value"  autocomplete="off" class="form-check-input">
                <label class="form-check-label">{{opt.text}}</label>
                </div>-->
                <b-form-checkbox
                        v-for="opt in loggedInUsernames"
                        :key="opt.value"
                        :value="opt.value"
                >{{ opt.text }}</b-form-checkbox>
            </b-form-checkbox-group>
        </b-form-group>
    </div>
</template>


<script>
    export default {
        name: "CheckboxTest",
        computed: {
            loggedInUsernames() {
                var username_arr = JSON.parse(this.$sessionStorage.access_info_arr);
                if (!username_arr) return;
                var usernames = [];
                for (let i = 0; i < username_arr.length; i++) {
                    var payload = {};
                    console.log(username_arr[i]);
                    payload["name"] = username_arr[i].val.name;
                    payload["text"] = username_arr[i].val.name + username_arr[i].val.type;
                    payload["type"] = username_arr[i].val.type;
                    payload["value"] = username_arr[i].key;
                    usernames.push(payload);
                }
                return usernames;
            },
            selected: {
                get () {
                    return this.$store.state.selected
                },
                set (value) {
                    this.$store.commit('UPDATE_CHECKBOX', value)
                }
            }
        },
        methods:{
            test() {
                console.log(this.selected);
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
        font-size: 0.75rem !important;
        border-radius: 0rem;
    }

    .form-check-label
    {
        width:100%;
    }
</style>