<template>
    <div>
        <b-alert v-if="alertMsg"
                 :type="alertType" show variant="success"><span v-html="alertMsg"/></b-alert>
        <b-alert show variant="danger">Danger Alert</b-alert>
    </div>
</template>