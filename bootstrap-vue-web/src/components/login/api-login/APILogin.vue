<template>
    <div>
        <div>
            <PryvAlert :show="show" :message="message" ></PryvAlert>
        </div>
        <div>
            <b-form>
                <div class="mb-4 mb-sm-0">
                    <PryvInput
                            :id="id"
                            :placeholder="placeholder"
                            v-model="endpoint"
                            @inputevent="updateEndpoint"
                    ></PryvInput>
                </div>
                <PryvBtn :content="btncontent" @click="loginAPI"></PryvBtn>
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
                endpoint: '',
                btncontent:"Login",
                id:"inline-form-input-endpoint",
                placeholder:"Enter API Endpoint",
                show:false,
                message:''
            }
        },
        methods :{
            loginAPI : function()
            {
                if(!this.endpoint)
                {
                    this.show=true;
                    this.message = "Please enter the API endpoint"
                    return;
                }
                //'https://ck6bwmcar00041ep87c8ujf90@drtom.pryv.me';
                try{
                    const connection =  new this.$pryv.Connection(this.endpoint);
                    if(connection)
                    {
                        sessionStorage.setItem("token", connection.token);
                        this.$emit("authenticated", true);
                        this.$router.push("access");
                    }
                    else
                    {
                        this.show=true;
                        this.message = "Please enter the valid API endpoint"
                        this.endpoint = '';
                        console.log("Endpoint is not valid.");
                        return;
                    }
                }
                catch (e) {
                    this.show = true;
                    this.message = e.message;
                    this.endpoint = '';
                    console.log(e.message);
                }
            },
            updateEndpoint(value)
            {
                this.endpoint = value;
                if(this.endpoint && this.show)
                {
                    this.show = false;
                    this.message = '';
                }
            }
        }
    }
</script>
