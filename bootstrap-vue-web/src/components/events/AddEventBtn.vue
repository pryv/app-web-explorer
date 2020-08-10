<template>
    <div class="p-1">
        <b-button
                @click="$bvModal.show('modal-scoped-event')"
                id="submitBtn"
                class="pryv-btn-style default-font float-right"
        ><b-icon icon="plus" font-scale="1"></b-icon> Event
        </b-button>
        <AddEventModal>
        </AddEventModal>
    </div>
</template>

<script>
  import AddEventModal from "./AddEventModal";
  export default {
    name: "AddEventBtn",
    components: { AddEventModal },

  };
</script>

<style scoped>

</style>