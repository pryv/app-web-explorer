<!--<template>-->
<!--    <div>-->
<!--        <h1>Hello</h1>-->

<!--        <v-divider-->
<!--                class="mt-3 mb-2"-->
<!--        />-->

<!--        <v-form-->
<!--                ref="form"-->
<!--                v-model="validForm"-->
<!--                @submit.prevent-->
<!--        >-->
<!--            <v-text-field-->
<!--                    id="username"-->
<!--                    v-model="username"-->
<!--                    :rules="[rules.required]"-->
<!--                    label="Username"-->
<!--            />-->

<!--            <Password v-model="password" />-->

<!--            <v-btn-->
<!--                    id="submitButton"-->
<!--                    :disabled="!validForm||submitting"-->
<!--                    @click="submit"-->
<!--            >-->
<!--                Sign-in-->
<!--            </v-btn>-->
<!--        </v-form>-->
<!--    </div>-->
<!--</template>-->

<!--<template>-->
<!--    <div>-->
<!--        <b-form @submit="onSubmit" @reset="onReset" v-if="show">-->
<!--            <b-form-group-->
<!--                    id="input-group-1"-->
<!--                    label="Email address:"-->
<!--                    label-for="input-1"-->
<!--                    description="We'll never share your email with anyone else."-->
<!--            >-->
<!--                <b-form-input-->
<!--                        id="input-1"-->
<!--                        v-model="form.email"-->
<!--                        type="email"-->
<!--                        required-->
<!--                        placeholder="Enter email"-->
<!--                ></b-form-input>-->
<!--            </b-form-group>-->

<!--            <b-form-group>-->
<!--                <Password/>-->
<!--            </b-form-group>-->

<!--            <b-button type="submit" variant="primary">Submit</b-button>-->
<!--            <b-button type="reset" variant="danger">Reset</b-button>-->
<!--        </b-form>-->
<!--        <b-card class="mt-3" header="Form Data Result">-->
<!--            <pre class="m-0">{{ form }}</pre>-->
<!--        </b-card>-->
<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--    import Password from './login/Password.vue';-->
<!--    import Alerts from './login/Alerts.vue';-->
<!--    import Context from '../context.js';-->

<!--    export default {-->
<!--        components: {-->
<!--            Password,-->
<!--            Alerts,-->
<!--        },-->
<!--        data: () => ({-->
<!--            password: '',-->
<!--            username: '',-->
<!--            error: '',-->
<!--            success: '',-->
<!--            submitting: false,-->
<!--            ctx: {},-->
<!--            rules: {-->
<!--                required: value => !!value || 'This field is required.',-->
<!--            },-->
<!--            validForm: false,-->
<!--        }),-->
<!--        async created () {-->
<!--            this.ctx = new Context(this.$route.query);-->
<!--            await this.ctx.init();-->
<!--        },-->
<!--        methods: {-->
<!--            async submit () {-->
<!--                if (this.$refs.form.validate()) {-->
<!--                    this.submitting = true;-->
<!--                    try {-->
<!--                        await this.ctx.pryv.login(this.username, this.password, this.ctx.appId);-->
<!--                        this.success = 'Login successful.';-->
<!--                    } catch (err) {-->
<!--                        this.error = err.toString();-->
<!--                    } finally {-->
<!--                        this.submitting = false;-->
<!--                    }-->
<!--                }-->
<!--            },-->
<!--        },-->
<!--    };-->
<!--</script>-->
