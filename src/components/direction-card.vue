<template>
    <div class="direction-card">
        <h1>Quick Start:</h1>
        <p> Two players race to answer the flashcard. Points are awarded for whoever answers first.</p>
        <a href="https://docs.google.com/document/d/1tz3wqc9Dl7kx-0zj1KX4WM4XwauVhvS-WyGBJiVwfN4/edit?usp=sharing" class="full-direction">Answer
            Sheet and Directions in Full</a>
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
}

.full-direction {
    color: red;
    font-size: 1.2em;
    text-decoration: none;
    font-weight: bold;
}
</style>