<template>
    <div>
        <b-form-checkbox
                v-for="stream in displayStreams"
                :class="{ 'trashed': stream.trashed && stream.trashed === true }"
                :key="stream.streamId"
                :value="stream.streamId"
                @change="checkBoxClicked($event, stream.streamId, endpoint)"
        >{{ stream.streamName
            }}<span :endpoint="endpoint" style="float: right; margin-right: 0;">
          <b-icon-pencil-square
                  @click="viewStreamInfoRecursive(stream.streamId, endpoint, $event)"
                  class="pencil-btn"
          >
          </b-icon-pencil-square
          ></span>
            <RecursiveCheckbox @viewStreamInfo="$emit('viewStreamInfo',$event);"  :endpoint="endpoint"  @checkBoxClicked="$emit('checkBoxClicked',$event);" v-if="stream.children" :displayStreams="stream.children"></RecursiveCheckbox>
        </b-form-checkbox>
    </div>
</template>

<script>
  export default {
    name: "RecursiveCheckbox",
    props:{
      displayStreams: {
        type: Array,
      },
      endpoint:{
        type: String
      }
    },
    methods:{
      checkBoxClicked(e, value, index) {
        const payload = {
          eventClickedOrUnClicked: e,
          clickedEndpointAndStreamId: value,
          endpointClicked: index,
        };
        this.$emit("checkBoxClicked", payload);
      },
      viewStreamInfoRecursive(streamId, endpoint, event) {
        event.preventDefault();
        const payload = {
          streamId: streamId,
          endpoint: endpoint,
        };
        this.$emit("viewStreamInfo", payload);
      },
    }
  };
</script>

<style scoped>

</style>