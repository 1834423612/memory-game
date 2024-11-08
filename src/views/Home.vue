<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-400 to-emerald-400 p-6">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Game Title -->
      <h1 class="text-4xl font-bold text-white text-center p-4">
        {{ gameTitle }}
      </h1>

      <!-- Instructions Card -->
      <div class="bg-white rounded-2xl p-6 shadow-lg">
        <h2 class="text-xl text-blue-600 font-semibold mb-4">Quick Start:</h2>
        <p class="text-orange-500 font-medium mb-4">
          Two players race to answer the flashcard. Points are awarded for whoever answers first.
        </p>
        <ol class="space-y-3">
          <li>1. Click the card to flip the card.</li>
          <li>2. When the card is flipped, the answer will be revealed.</li>
          <li>3. Click the "Correct" button to award points to the player who answered first.</li>
          <li class="flex flex-wrap">
            <span>4. If both players were get same answered at same time or they both wrong, click "Both Wrong or Tie" button to continue and </span>
            <span class="text-red-500">won't get any points for this answer and this answer will go to the pool again once a player were get correct.</span>
          </li>
        </ol>
        <button 
          @click="showFullInstructions"
          class="mt-4 bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Answer Sheet & Directions in Full
        </button>
      </div>

      <!-- Score Display -->
      <div class="bg-white rounded-2xl p-4 shadow-lg">
        <h2 class="text-2xl text-purple-600 font-bold text-center mb-2">SCORE</h2>
        <p class="text-xl text-center">
          Player1: {{ scores.player1 }} Player2: {{ scores.player2 }}
        </p>
      </div>

      <!-- Flashcard -->
      <div 
        class="bg-pink-100 rounded-2xl p-6 shadow-lg cursor-pointer"
        @click="flipCard"
      >
        <div 
          class="bg-white rounded-xl p-8 min-h-[200px] flex items-center justify-center"
          :class="{'transform transition-transform duration-500': isFlipping}"
        >
          <div class="text-2xl font-semibold text-center">
            {{ currentCard.isFlipped ? currentCard.answer : currentCard.question }}
          </div>
        </div>
        <div class="text-center mt-4 text-gray-600">
          Click to {{ currentCard.isFlipped ? 'hide' : 'show' }} Back
        </div>
      </div>

      <!-- Control Buttons -->
      <div class="flex justify-center gap-4">
        <button
          @click="awardPoints(1)"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Player 1 Correct
        </button>
        <button
          @click="awardPoints(2)"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Player 2 Correct
        </button>
        <button
          @click="bothWrongOrTie"
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Both Wrong or Tie
        </button>
      </div>

      <!-- Footer -->
      <footer class="text-white text-center text-sm mt-8">
        <p>2024 Flashcard Review Game</p>
        <p>Open Source on <a href="https://github.com" class="underline">Github</a></p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Card {
  question: string
  answer: string
  isFlipped: boolean
}

interface Scores {
  player1: number
  player2: number
}

// Game state
const gameTitle = ref('2024 Flashcard Review Game')
const isFlipping = ref(false)
const scores = reactive<Scores>({
  player1: 0,
  player2: 0
})

// Sample cards data - in a real app, this would come from an API or database
const cards = ref<Card[]>([
  {
    question: 'Things all cultures have',
    answer: 'Language, religion, values, norms, symbols',
    isFlipped: false
  },
  // Add more cards here
])

const currentCard = reactive<Card>({
  question: '',
  answer: '',
  isFlipped: false
})

// Initialize the game
const initializeGame = () => {
  if (cards.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * cards.value.length)
    Object.assign(currentCard, cards.value[randomIndex])
    currentCard.isFlipped = false
  }
}

// Game actions
const flipCard = () => {
  isFlipping.value = true
  currentCard.isFlipped = !currentCard.isFlipped
  setTimeout(() => {
    isFlipping.value = false
  }, 500)
}

const awardPoints = (player: number) => {
  if (player === 1) {
    scores.player1++
  } else {
    scores.player2++
  }
  nextCard()
}

const bothWrongOrTie = () => {
  // Add the current card back to the pool
  cards.value.push({...currentCard})
  nextCard()
}

const nextCard = () => {
  if (cards.value.length > 0) {
    initializeGame()
  } else {
    alert('Game Over! No more cards.')
  }
}

const showFullInstructions = () => {
  alert('Full instructions would be shown here')
}

// Initialize the game when component is mounted
initializeGame()
</script>

<style scoped>
.transform {
  transform: rotateY(180deg);
}
</style>