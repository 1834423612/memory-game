<template>
  <div id="app">

    <score :score="score"></score>
    <!-- Flashcard container -->
    <container>
      <flashcard :front="question" :back="answer"></flashcard>

    </container>
    <!-- Choice Buttons -->
    <div v-if="this.$store.state.cardFlipped" class="ChoiceButtons">
      <!-- <Button type="default" effect="reverse" size="middle" :width="120" :height="40" :borderRadius="4"
        :disabled="false" :center="false" @click="onClick">
        Test Button
      </Button> -->

      <button @click="correctp1">Player 1</button>
      <button @click="wrong">Both Wrong Or Tie</button>
      <button @click="correctp2">Player 2</button>
    </div>

    <DirectionCard></DirectionCard>
  </div>
</template>

<script>
import score from './components/score.vue'
import flashcard from './components/Flashcard.vue'
import container from './components/container.vue'
import DirectionCard from './components/direction-card.vue'

// import Button from './components/button'

export default {
  components: {
    score,
    flashcard,
    container,
    DirectionCard,
  },
  data() {
    return {
      score: "Player1: 0 Player2: 0"
    }
  },
  computed: {
    question() {
      return this.$store.getters.currentQuestion // handled by vuex
    },
    answer() {
      return this.$store.getters.currentAnswer // handled by vuex
    },
  },
  methods: {
    correctp1() {
      let p1 = parseInt(this.score.split(" ")[1]);
      let p2 = parseInt(this.score.split(" ")[3]);
      ++p1
      this.score = "Player1: " + p1 + " Player2: " + p2
      if (p1 > p2) { this.$store.dispatch('correctAnswerp1win') }
      else if (p1 < p2) { this.$store.dispatch('correctAnswerp2win') }
      else { this.$store.dispatch('correctAnswer') }
    },
    correctp2() {
      let p1 = parseInt(this.score.split(" ")[1]);
      let p2 = parseInt(this.score.split(" ")[3]);
      ++p2
      this.score = "Player1: " + p1 + " Player2: " + p2
      if (p1 > p2) { this.$store.dispatch('correctAnswerp1win') }
      else if (p1 < p2) { this.$store.dispatch('correctAnswerp2win') }
      else { this.$store.dispatch('correctAnswer') }
    },
    wrong() {
      this.$store.dispatch('wrongAnswer') // handled by vuex
    },
  },
}
</script>

<style scoped>
/* body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
} */

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
  color: black;
  margin-top: 60px;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
}

#score {
  font-size: 24px;
}

.ChoiceButtons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 20px;
  background-color: chocolate;
  width: 60%;
  height: 40%;
  justify-content: center;
  align-items: center;
  padding: 25px;
}
</style>
