<template>
    <div>
        <b-form @submit.stop.prevent>
            <label for="text-password">Password</label>
            <b-input type="password" id="text-password" aria-describedby="password-help-block"></b-input>
            <b-form-text id="password-help-block">
                Your password must be 8-20 characters long, contain letters and numbers, and must not
                contain spaces, special characters, or emoji.
            </b-form-text>
        </b-form>
    </div>
</template>
<script>
    export default {
        props: {
            value: { type: String, default: '' },
        },
        data: () => ({
            visiblePass: false,
            rules: {
                required: value => !!value || 'This field is required.',
            },
            types:[
                'password'
            ]
        }),
    };
</script>
