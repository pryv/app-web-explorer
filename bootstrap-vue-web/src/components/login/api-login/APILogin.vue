<template>
    <div>
        <div>
            <PryvAlert :message="message" :show="show"></PryvAlert>
        </div>
        <div>
            <b-form>
                <div class="mb-4 mb-sm-0">
                    <PryvInput
                            :id="id"
                            :placeholder="placeHolder"
                            @inputevent="updateEndpoint"
                            v-model="endPoint"
                    ></PryvInput>
                </div>
                <PryvBtn :content="btnContent" @click="loginAPI"></PryvBtn>
            </b-form>
        </div>
    </div>
</template>

<script>
    import PryvBtn from "../../shared/PryvBtn";
    import PryvInput from "../../shared/PryvInput";
    import PryvAlert from "../../shared/PryvAlert";

    export default {
        name: "APILogin",
        components: {PryvInput, PryvBtn, PryvAlert},
        data() {
            return {
                endPoint: '',
                btnContent: "Login",
                id: "inline-form-input-endpoint",
                placeHolder: "Enter API Endpoint",
                show: false,
                message: ''
            }
        },
        methods: {
            loginAPI: async function () {
                if (!this.endPoint) {
                    this.show = true;
                    this.message = "Please enter the API endpoint"
                    return;
                }
                try {
                    const connection = new this.$pryv.Connection(this.endPoint);
                    if (connection) {
                        this.$emit("authenticated", connection, false);
                    } else {
                        this.show = true;
                        this.message = "Please enter the valid API endpoint"
                        this.endPoint = '';
                        console.log("Endpoint is not valid.");
                    }
                } catch (e) {
                    this.show = true;
                    this.message = e.message;
                    this.endPoint = '';
                    console.log(e.message);
                }
            },
            updateEndpoint(value) {
                this.endPoint = value;
                if (this.endPoint && this.show) {
                    this.show = false;
                    this.message = '';
                }
            }
        }
    }
</script>
