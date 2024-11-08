<template>
<div class="score">
    <span class="score-title">SCORE</span>
    <div class="score-details">
        <span>{{ score }}</span>
    </div>
</div>
</template>

<script>
export default {
    name: 'Score',
    props: {
        score: {
            type: String,
            default: 'Player1: 0' + ' Player2: 0'
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
    align-content: space-between;
    height: 100%;
    width: 35%;
    background-color: aliceblue;
    padding: 20px;
    margin-bottom: 15px;
    border-radius: 20px;

    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
}

.score-title {
    font-size: 1.5em;
    font-weight: bold;
    color: blueviolet;
}

.score-details {
    font-size: 1.2em;
    font-weight: bold;
    margin-top: 5px;
    color: black;
}
</style>
