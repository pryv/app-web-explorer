<template>
    <div>
        <b-form-group>
            <StreamCheckBox
                    v-for="(opts, keyv) in loggedInUsernamesf"
                    :key="keyv"
                    :name="opts"
                    :main="keyv"
                    v-model="selectedStreams[keyv]"
                    @clickAll="clickAll($event, keyv)"
            ></StreamCheckBox>
        </b-form-group>
    </div>
</template>

<script>
    import StreamCheckBox from "./StreamCheckBox";

    export default {
        name: "GroupCheckBox",
        components: {StreamCheckBox},
        data(){
            return {
                selectedStreams:{}
            }
        },
        computed: {
            loggedInUsernamesf() {
                var username_arr = JSON.parse(this.$sessionStorage.access_info_arr);
                var usernames = {};
                if (!username_arr) return;
                for (let i = 0; i < username_arr.length; i++) {
                    usernames[username_arr[i].key] = [];
                    var payload = {};
                    payload["main"] = username_arr[i].val.name;
                    payload["type"] = username_arr[i].val.type;
                    if (username_arr[i].val.permissions) {
                        for (let j = 0; j < username_arr[i].val.permissions.length; j++) {
                            payload["value"] = username_arr[i].key + username_arr[i].val.permissions[j].streamId;
                            payload["text"] = username_arr[i].val.permissions[j].streamId;
                        }
                    }
                    usernames[username_arr[i].key].push(payload);
                }
                return usernames;
            },
        },
        methods: {
            clickAll(e, keyv) {
                if (e && e.includes(keyv)) {
                    var checked = new Array();
                    checked = this.loggedInUsernamesf[keyv].map(
                        opt => {
                            return opt.value
                        }
                    );

                    checked.push(keyv);
                    // this.$set(this.selectedStreams,keyv , checked);
                }
            },
        },
    }

</script>

<style scoped>

</style>