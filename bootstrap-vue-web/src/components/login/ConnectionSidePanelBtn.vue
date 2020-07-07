<template>
    <b-row>
        <b-button  @click="$router.push('login')" class="w-100" style="text-align: left" variant="light">
            <b-icon icon="plus" font-scale="1.5"></b-icon>
            Connection
        </b-button>
        <!--<b-button @click="$router.push('about')" class="w-100" style="text-align: left" variant="light">
            <b-icon icon="plus" font-scale="1.5"></b-icon>
            Login - Api
        </b-button>
        <b-button @click="$router.push('test')" class="w-100" style="text-align: left" variant="light">
            <b-icon icon="plus" font-scale="1.5"></b-icon>
           Test
        </b-button>-->
    </b-row>
</template>
<script>
    export default {
        name: 'ConnectionSidePanelBtn',
        computed:{
            isLoggedIn(){ return this.$sessionStorage.token && this.$sessionStorage.token !== '' ; }
        }
    }
</script>
