<template>
  <subject-detail :is-edit="false" />
</template>

<script>
    import SubjectDetail from './components/subjectDetail'
    export default {
        name: "createSubject",
        components: { SubjectDetail }
    }
</script>

<style scoped>

</style>
