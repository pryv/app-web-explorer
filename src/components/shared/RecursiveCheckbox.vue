<template>
  <div>
    <b-row :key="stream.streamId" v-for="stream in displayStreams">
      <b-col cols="2">
        <span v-if="stream.children" v-b-toggle="`${stream.streamId}`">
          <b-icon
            icon="arrow-down-square-fill"
            class="when-opened"
            variant="danger"
            font-scale="1"
          ></b-icon>
          <b-icon
            icon="arrow-right-square-fill"
            class="when-closed"
            font-scale="1"
          ></b-icon>
        </span>
      </b-col>
      <b-col cols="8">
        <b-form-checkbox
          :class="{
            trashed: stream.trashed && stream.trashed === true,
            'not-trashed': !stream.trashed,
            'text-left': stream.streamId,
            'stream-font': stream.streamId,
          }"
          :value="stream.streamId"
          @change="checkBoxClicked($event, stream.streamId, endpoint)"
          >{{ stream.streamName }}
        </b-form-checkbox>
      </b-col>
      <b-col cols="1">
        <b-icon-trash-fill
          v-if="stream.trashed && stream.trashed === true"
          class="trash-fill"
        >
        </b-icon-trash-fill>
      </b-col>
      <b-col cols="1">
        <b-icon-pencil-square
          @click="viewStreamInfoRecursive(stream.streamId, endpoint, $event)"
          class="pencil-btn"
        >
        </b-icon-pencil-square>
      </b-col>
      <b-col cols="12">
        <b-collapse :id="`${stream.streamId}`" class="mt-2">
          <b-card>
            <RecursiveCheckbox
              @viewStreamInfo="$emit('viewStreamInfo', $event)"
              :endpoint="endpoint"
              @checkBoxClicked="$emit('checkBoxClicked', $event)"
              v-if="stream.children"
              :displayStreams="stream.children"
            ></RecursiveCheckbox>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "RecursiveCheckbox",
  props: {
    displayStreams: {
      type: Array,
    },
    endpoint: {
      type: String,
    },
  },
  methods: {
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
  },
};
</script>

<style>
.card-body {
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}
.stream-font {
  font-weight: lighter;
}
</style>