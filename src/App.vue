<template>
  <div id="app">

    <DirectionCard></DirectionCard>

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

      <button @click="correctp1" class="button buttonSuccess">Player 1</button>
      <button @click="wrong" class="button buttonDanger">Both Wrong Or Tie</button>
      <button @click="correctp2" class="button buttonPrimary">Player 2</button>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-inner">
      <div class="footer-content-left">
        <p>UI/UX Design & Layout codes by <a href="https://www.kjchmc.cn"
            style="font-weight: bold;text-decoration: none;">Jiacheng Kuang</a></p>
        <p>Game Question & Main Scripts Function codes by <span
            style="color: white;font-weight: bold;margin-top: 2px;">Aaron Kahn</span></p>
      </div>
      <div class="footer-content-right">
        <p>2024 Sociology Review Game</p>
        <p>Open Source on <a href="https://github.com/1834423612/memory-game"
            style="font-weight: bold;text-decoration: none;">Github</a>.</p>
      </div>
      </div>

      <div class="footer-content-center">
        <p style="margin-top: 10px;">Server Based on Beijing,CN region, according to the website publish policy</p>
        <span style="display:inline-block;text-decoration:none;height:20px;line-height:20px;letter-spacing: .1em;">
          <img src="https://cdn.kjchmc.cn/beian/icp.png" style="float:left;" />
          <a href="http://beian.miit.gov.cn" target="_blank" style="font-size: 0.7rem;color: #bebebe;">冀ICP备19023170号</a>
        </span>
        <span class="icp"
          style="display:inline-block;text-decoration:none;height:20px;line-height:20px; letter-spacing: .1em;">
          <img src="https://cdn.kjchmc.cn/beian/ghs.png" style="float:left;" />
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202001885" target="_blank"
            style="font-size: 0.7rem; color: #bebebe;">京公网安备11011202001885号</a>
        </span>
      </div>
      </div>
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
  margin-bottom: 13%;

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
  background-color: antiquewhite;
  ;
  width: 60%;
  height: 40%;
  justify-content: center;
  align-items: center;
  padding: 25px;
  border-radius: 10px;
}

:root {
  --primary: #1890ff;
  --danger: #ff4d4f;
  --success: #52c41a;
  /* --warning: #faad14; */
}

.button {
  background-color: #4CAF50;
  /* Green */
  border: none;
  color: white;
  padding: 16px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  -webkit-transition-duration: 0.4s;
  /* Safari */
  transition-duration: 0.4s;
  cursor: pointer;
}

.buttonSuccess {
  background-color: white;
  color: black;
  border: 2px solid #52c41a;
}

.buttonSuccess:hover {
  background-color: #52c41a;
  color: white;
}

.buttonPrimary {
  background-color: white;
  color: black;
  border: 2px solid #1890ff;
}

.buttonPrimary:hover {
  background-color: #1890ff;
  color: white;
}

.buttonDanger {
  background-color: white;
  color: black;
  border: 2px solid #ff4d4f;
}

.buttonDanger:hover {
  background-color: #ff4d4f;
  color: white;
}


/* Style of Footer */
.footer {
  position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #0693E3;
    color: white;
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    padding: 10px 0px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.footer-inner {
  display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    width: 100%;
    padding: 0px 10px;
    flex-direction: row;
    justify-content: space-between;
}


.footer-content-left p{
  display: block;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;

  font-size: 0.9rem;
  color: #fff400;
}

.footer-content-left {
  float: left;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.footer-content-right {
  float: right;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.footer-content-right p{
  display: block;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;

  font-size: 0.9rem;
  /* color: #fff400; */
}


.footer-content-center p{
  display: block;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  unicode-bidi: isolate;

  font-size: 0.85rem;
  /* color: #fff400; */
}
</style>
