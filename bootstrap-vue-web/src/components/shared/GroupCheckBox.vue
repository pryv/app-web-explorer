<template>
  <div>
    <b-form-group>
      <StreamCheckBox
        v-for="(opts, keyv) in streamList"
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
import { mapState } from "vuex";
export default {
  name: "GroupCheckBox",
  components: { StreamCheckBox },
  data() {
    return {
      loggedInUsernames: {},
    };
  },
  computed: {
    ...mapState(["streams_map"]),
    ...mapState(["access_info_map"]),
    selectedStreams: {
      get() {
        return this.$store.state.selectedStreams;
      },
      set(value) {
        this.$store.commit("UPDATE_SELECTED_ENDPOINTS", value);
      },
    },
    streamList() {
      return this.loggedInUsernames;
    },
  },
  watch: {
    streams_map() {
      this.displayStreams();
    },
    access_info_map() {
      this.displayStreams();
    },
  },
  methods: {
    clickAll(e) {
      var key = e["key"]; // endpoint token
      var event = e["event"]; // clicked token or null if unclicked
      var value = e["value"]; // clicked token or clicked token + stream id
      var checked = Object.assign({}, this.selectedStreams);
      if (event) {
        if (key === value) {
          checked[key] = this.streamList[key].map(opt => {
            return opt.value;
          });
          checked[key].push(key);
        } else {
          if (!checked[key]) checked[key] = [];
          checked[key].push(value);
        }
      } else {
        if (key === value) {
          checked[key] = [];
        } else {
          checked[key] = this.selectedStreams[key]
            .filter(opt => opt != value)
            .map(opt => opt);
        }
      }
      this.selectedStreams = Object.assign({}, checked);
    },
    displayStreams() {
      var usernames = {};
      for (const [key, value] of Object.entries(this.access_info_map)) {
        usernames[key] = [];
        const streams = this.streams_map[key];
        if (streams) {
          for (let i = 0; i < streams.length; i++) {
            const payload = {};
            payload["main"] = value.name;
            payload["type"] = value.type;
            payload["value"] = streams[i].id;
            payload["text"] = streams[i].name;
            usernames[key].push(payload);
          }
        }
      }
      this.loggedInUsernames = usernames;
    },
  },
};
</script>

<style scoped></style>
