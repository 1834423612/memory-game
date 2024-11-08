<template>
    <div class="direction-card">
        <h1>2024 Sociology Review Game</h1>
        <div class="directions">
            <span style="color: #1890ff;">Quick Start:</span>
            <p style="color: darkorange;"> Two players race to answer the flashcard. Points are awarded for whoever answers first.</p>
            <p>1. Click the card to flip the card.</p>
            <p>2. When the card is flipped, the answer will be revealed.</p>
            <p>3. Click the "Correct" button to award points to the player who answered first.</p>
            <p>4. If both players were get same answered at same time or they both wrong, click "Both Wrong or Tie" button to continue and <span style="color: red;font-weight: bold;">wont get any points for this answer and this answer will go to the pool again once a player were get correct</span>.</p>
        </div>
        <div class="directions-bottomCard">
        <a href="https://docs.google.com/document/d/1tz3wqc9Dl7kx-0zj1KX4WM4XwauVhvS-WyGBJiVwfN4/edit?usp=sharing"
                class="full-direction">Answer Sheet  &  Directions in Full</a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DirectionCard',
}
</script>

<style scoped>
.direction-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-color: aliceblue;
    padding: 20px;
    margin-bottom: 20px;
    width: 80%;
    border-radius: 20px;
    box-shadow: rgb(227 93 249) 0px 0px 0px 3px;
}

.directions {
    font-size: 1em;
    font-weight: bold;
    color: black;
    margin-top: 5px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: start;
    -ms-flex-align: start;
    flex-direction: column;
    align-items: flex-start;
}

.full-direction {
    color: #4159d3;
    font-size: 1.2em;
    text-decoration: none;
    font-weight: bold;
}

.directions-bottomCard {
    padding: 10px;
    border-radius: 5px;
    background-color: #ffb900;
    font-size: 0.8rem;
}
</style>