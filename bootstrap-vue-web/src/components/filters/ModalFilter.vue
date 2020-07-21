<template>
    <b-modal id="modal-scoped">
        <template v-slot:modal-header>
            <!-- Emulate built in modal header close button action -->
            <h5>{{title}}</h5>
        </template>
        <template v-slot:default>
            <!-- Emulate built in modal header close button action -->
            <b-form-group :label="label">
                <b-form-checkbox-group
                        id="checkbox-group-1"
                        :options="options"
                        name="flavour-1"
                        v-model="valueLocal"
                ></b-form-checkbox-group>
            </b-form-group>
        </template>

        <template v-slot:modal-footer="{ ok, cancel }">
            <!-- Emulate built in modal footer ok and cancel button actions -->
            <b-button size="sm" variant="success" @click="fireParentOKEvent(ok)">
                OK
            </b-button>
            <b-button size="sm" variant="danger" @click="fireParentCancelEvent(cancel)">
                Cancel
            </b-button>
        </template>
    </b-modal>
</template>

<script>
    export default {
        name: "ModalFilter",
        props: {
            title: {
                required: true,
                type: String
            },
            label:{
                required : true
            },
            options:{
                required : true
            },
            value:{
                required : true
            }
        },
        computed: {
            valueLocal: {
                get: function() {
                    return this.value
                },
                set: function(value) {
                    this.$emit('listchange', value)
                }
            }
        },
        methods:{
            fireParentOKEvent : function(ok){
                this.$emit('clickOk', ok);
            },
            fireParentCancelEvent : function(cancel){
                this.$emit('clickCancel', cancel);
            }
        }
    }
</script>

<style scoped>

</style>