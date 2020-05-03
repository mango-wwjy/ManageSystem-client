<template>
  <subject-detail :is-edit="true" />
</template>

<script>
    import SubjectDetail from './components/subjectDetail'

    export default {
        name: 'editSubject',
        components: { SubjectDetail }
    }
</script>
