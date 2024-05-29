<template>
<div class="score" style="color: black; background: white">
    SCORE:
    <pre>{{ score }}</pre>
</div>
</template>

<script>
export default {
    name: 'Score',
    props: {
        score: {
            type: String,
            default: 'Player1: 0 Player2: 0'
        }
    }
}
</script>

<style scoped>

</style>
