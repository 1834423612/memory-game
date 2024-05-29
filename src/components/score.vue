<template>
<div class="score" style="color: black; background: white">
    <span class="score-title">SCORE</span>
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
.score {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: aliceblue;
    padding: 20px;
}

.score-title {
    font-size: 1.5em;
    font-weight: bold;
    color: blueviolet;
}
</style>
