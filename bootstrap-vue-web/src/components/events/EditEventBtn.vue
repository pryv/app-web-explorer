<template>
  <div class="p-1">
    <b-button
      @click="$bvModal.show('modal-scoped-edit-event')"
      id="submitBtn"
      class="pryv-btn-style default-font float-left"
      ><b-icon icon="check2-square" font-scale="1"></b-icon>
    </b-button>
    <EditEventModal> </EditEventModal>
  </div>
</template>

<script>
import EditEventModal from "./EditEventModal";
export default {
  name: "EditEventBtn",
  components: { EditEventModal },
};
</script>

<style scoped></style>
