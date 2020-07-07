<template>
    <div>
<!--        <StreamCheckBox v-for="username in loggedInUsernames"  v-model="checked[key]"  :key="username.key" :name="username.val" ></StreamCheckBox>-->
        <b-form-group>
            <template v-slot:label>
                <b>Choose your flavours:</b><br>
                <b-form-checkbox
                        v-model="allSelected"
                        :indeterminate="indeterminate"
                        aria-describedby="flavours"
                        aria-controls="flavours"
                        @change="toggleAll"
                >
                    {{ allSelected ? 'Un-select All' : 'Select All' }}
                </b-form-checkbox>
            </template>
        <StreamCheckBox
         v-for="(opts, keyv) in optGroups"
         :key="keyv"
         :name="opts"
         :value="checked[keyv]"
         @input="(newAddress) => {checked[keyv] = newAddress}"
 ></StreamCheckBox>
        </b-form-group>
        <b-button @click="test">check</b-button>
        <b-button @click="loggedInUsernamesd">check</b-button>
    </div>
</template>

<script>
    import StreamCheckBox from "./StreamCheckBox";
    export default {
        name: "GroupCheckBox",
        components:{StreamCheckBox},
        data() {
            return{
                optGroups: {
                    g1: [
                        { value: 'val1', text: 'value 1 -' },
                        { value: 'val2', text: 'value 2 -' },
                        { value: 'val3', text: 'value 3 -' }
                    ],
                    g2: [
                        { value: 'val4', text: 'value 4' },
                        { value: 'val5', text: 'value 5' },
                        { value: 'val6', text: 'value 6' }
                    ]
                },
                checked: {
                    g1: ['val1'],
                    g2: []
                }
            }
        },
        computed:{
            /*loggedInUsernames()
            {
                var username_arr = JSON.parse(this.$sessionStorage.access_info_arr);
                if(!username_arr) return null;
                let usernames = username_arr.map((access_info,index) => {
                    var payload = {};
                    payload["key"]=index;
                    payload["val"]=access_info["val"].name;
                    return payload;
                });
                console.log("username_arr" + typeof(usernames));
                return usernames;
            }*/
        },
        methods:{
            test()
            {
                var keyv = "g2"
                var keyv2 = "g1"
                alert((this.checked[keyv]));
                alert((this.checked[keyv2]));
                console.log(this.checked);
            },
            loggedInUsernamesd()
            {
                var username_arr = JSON.parse(this.$sessionStorage.access_info_arr);

                var optGroups= {
                    [username_arr[0].key]: [
                        { value: username_arr[0].key+username_arr[0].val.permissions[0].streamId, text: username_arr[0].val.permissions[0].streamId }
                    ]
                };
                /*if(!username_arr) return null;
                let usernames = username_arr.map((access_info,index) => {
                    var payload = {};
                    payload["key"]=index;
                    payload["val"]=access_info["val"].name;
                    return payload;
                });
                console.log("username_arr" + typeof(usernames));*/
                return optGroups;
            }
        }
    }
</script>

<style scoped>

</style>