<template>
    <div>
        <b-form-group>
            <StreamCheckBox
                    v-for="(opts, keyv) in loggedInUsernamesf"
                    :key="keyv"
                    :name="opts"
                    :main="keyv"
                    :value="selectedStreams[keyv]"
                    @clickAll="clickAll"
            ></StreamCheckBox>
        </b-form-group>
    </div>
</template>

<script>
    import StreamCheckBox from "./StreamCheckBox";

    export default {
        name: "GroupCheckBox",
        components: {StreamCheckBox},
        computed: {
            selectedStreams: {
                get() {
                    return this.$store.state.selectedStreams
                },
                set(value) {
                    this.$store.commit('UPDATE_SELECTED_ENDPOINTS', value)
                }
            },
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
            clickAll(e) {
                var key = e["key"]; // endpoint token
                var event = e["event"] // clicked token or null if unclicked
                var value = e["value"]; // clicked token or clicked token + stream id
                var checked = Object.assign({}, this.selectedStreams);
                if (event) {
                    if (key === value) {
                        checked[key] = this.loggedInUsernamesf[key].map(
                            opt => {
                                return opt.value
                            }
                        );
                        checked[key].push(key);
                    } else {
                        if (!checked[key])
                            checked[key] = [];
                        checked[key].push(value);
                    }
                } else {
                    if (key === value) {
                        checked[key] = [];
                    } else {
                        checked[key] = this.selectedStreams[key].filter(opt => (opt != value)).map(opt => opt)
                    }
                }
                this.selectedStreams = Object.assign({}, checked)
                console.log(this.selectedStreams);
            },
        },
    }
</script>

<style scoped>

</style>