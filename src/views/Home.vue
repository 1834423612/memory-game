<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-400 to-indigo-500 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Game Title -->
      <h1 class="text-5xl font-bold text-white text-center p-4 font-sans flex items-center justify-center">
        <Icon icon="mdi:cards-outline" class="mr-4" width="48" height="48" />
        {{ gameTitle }}
      </h1>

      <!-- Return to Home Button (Always visible except during active gameplay) -->
      <!-- <div v-if="!gameStarted || gameOver" class="text-center mt-4"> -->
      <div class="text-center mt-4">
        <button @click="returnToHome"
          class="bg-white text-indigo-600 font-medium py-2 px-4 rounded-lg transition-colors hover:bg-indigo-100 flex items-center justify-center mx-auto">
          <Icon icon="mdi:home" class="mr-2" />
          Return to Home
        </button>
        <button
          class="bg-white text-indigo-600 mt-2 font-medium py-2 px-4 rounded-lg transition-colors hover:bg-indigo-100 flex items-center justify-center mx-auto"
          onclick="window.location.href='https://docs.google.com/document/d/1tsVzgltAe8_JT2C-mGTsOaxjlqzqpLFMSmIbE4WttJQ/edit?usp=sharing'"
        >
          Answer Sheet
        </button>
      </div>

      <!-- Quick Start Guide (Always Visible) -->
      <div class="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 ease-in-out"
        :class="{ 'max-h-20 overflow-hidden': !showInstructions, 'max-h-96': showInstructions }">
        <h2 class="text-xl text-indigo-600 font-semibold mb-4 cursor-pointer flex items-center justify-between"
          @click="toggleInstructions">
          <span class="flex items-center">
            <Icon icon="mdi:information-outline" class="mr-2" />
            Quick Start
          </span>
          <Icon :icon="showInstructions ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            class="ml-2 transition-transform duration-300" :class="{ 'rotate-180': !showInstructions }" />
        </h2>
        <div class="space-y-3 text-gray-700 transition-all duration-300 ease-in-out"
          :class="{ 'opacity-0': !showInstructions, 'opacity-100': showInstructions }">
          <p class="text-orange-500 font-medium mb-4">
            {{ gameMode === 'singleplayer' ? 'Test your knowledge!' : 'Two players race to answer the flashcard. Points are awarded for correct answers.' }}
          </p>
          <ol class="list-decimal list-inside space-y-2">
            <li>Select game mode: Single Player or Multiplayer.</li>
            <li>For Multiplayer, join or create a room using the Room Code.</li>
            <li>Both players must click "Ready" to start the game.</li>
            <li>Click "I Know This" if you can answer the question.</li>
            <li>If both players don't know, the card is returned to the pool.</li>
            <li>The game ends when all questions are answered correctly.</li>
          </ol>
        </div>
      </div>

      <!-- Game Mode Selection -->
      <div v-if="!gameMode" class="bg-white rounded-2xl p-6 shadow-lg">
        <h2 class="text-2xl text-indigo-600 font-semibold mb-4 flex items-center">
          <Icon icon="mdi:gamepad-variant-outline" class="mr-2" />
          Select Game Mode
        </h2>
        <div class="flex space-x-4">
          <button @click="startSinglePlayerMode"
            class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
            <Icon icon="mdi:account" class="mr-2" />
            Single Player
          </button>
          <button @click="startMultiPlayerMode"
            class="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
            <Icon icon="mdi:account-group" class="mr-2" />
            Multiplayer
          </button>
        </div>
      </div>

      <!-- Room Connection -->
      <div v-if="gameMode === 'multiplayer' && !isConnected" class="bg-white rounded-2xl p-6 shadow-lg">
        <h2 class="text-2xl text-indigo-600 font-semibold mb-4 flex items-center justify-center">
          <Icon icon="mdi:link-variant" class="mr-2" />
          Join or Create a Room
        </h2>
        <div class="flex flex-col space-y-6">
          <!-- Create Room Section -->
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">Create a New Room</h3>
            <button @click="createRoom" :disabled="isJoining"
              class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
              :class="{ 'opacity-50 cursor-not-allowed': isJoining }">
              <Icon v-if="isJoining" icon="mdi:loading" class="animate-spin mr-2" />
              <span v-else>
                <Icon icon="mdi:plus-circle" class="mr-2" />
              </span>
              Create Room
            </button>
          </div>

          <!-- Divider -->
          <div class="flex items-center">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="flex-shrink mx-4 text-gray-500">OR</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

          <!-- Join Room Section -->
          <div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">Join an Existing Room</h3>
            <div class="flex space-x-4">
              <input v-model="roomCode" type="text" placeholder="Enter Room Code"
                class="flex-grow px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg" />
              <button @click="joinRoom" :disabled="isJoining || !roomCode"
                class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                :class="{ 'opacity-50 cursor-not-allowed': isJoining || !roomCode }">
                <Icon v-if="isJoining" icon="mdi:loading" class="animate-spin" />
                <span v-else>
                  <Icon icon="mdi:login" class="mr-2" />
                </span>
                Join
              </button>
            </div>
          </div>

          <!-- Status Messages -->
          <div v-if="isJoining" class="text-center text-indigo-600">
            <Icon icon="mdi:loading" class="animate-spin mr-2" />
            {{ isCreatingRoom ? 'Creating room...' : 'Joining room...' }}
          </div>
          <div v-if="joinError" class="text-center text-red-600">
            {{ joinError }}
          </div>
        </div>
      </div>

      <!-- Waiting for Players -->
      <div v-if="gameMode === 'multiplayer' && isConnected && !allPlayersJoined"
        class="bg-white rounded-2xl p-6 shadow-lg text-center">
        <h2 class="text-2xl text-indigo-600 font-semibold mb-4">Waiting for Players</h2>
        <p class="text-lg">Share this Room Code with your opponent: <span class="font-bold">{{ displayRoomCode }}</span>
        </p>
        <div class="mt-4">
          <Icon icon="mdi:loading" class="animate-spin text-4xl text-indigo-500" />
        </div>
      </div>

      <!-- Ready Up Phase -->
      <div v-if="gameMode === 'multiplayer' && allPlayersJoined && !gameStarted"
        class="bg-white rounded-2xl p-6 shadow-lg text-center">
        <h2 class="text-2xl text-indigo-600 font-semibold mb-4">Are You Ready?</h2>
        <button v-if="!isReady" @click="readyUp"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto">
          <Icon icon="mdi:check-circle" class="mr-2" />
          I'm Ready!
        </button>
        <div v-else class="text-lg text-indigo-600 flex items-center justify-center">
          <Icon icon="mdi:loading" class="animate-spin mr-2" />
          Waiting for opponent...
        </div>
        <p v-if="countdownStarted" class="mt-4 text-2xl font-bold text-indigo-600">
          Game starts in: {{ countdown }}
        </p>
      </div>

      <!-- Game Content -->
      <template v-if="gameStarted && !gameOver">
        <!-- Player Indicator -->
        <div class="bg-white rounded-2xl p-4 shadow-lg text-center">
          <h2 class="text-xl text-indigo-600 font-semibold">
            You are Player {{ playerNumber }}
          </h2>
          <p v-if="gameMode === 'multiplayer'" class="mt-2 text-lg font-semibold">
            Room Code: {{ displayRoomCode }}
          </p>
        </div>

        <!-- Score Display -->
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <h2 class="text-2xl text-indigo-600 font-bold text-center mb-4 flex items-center justify-center">
            <Icon icon="mdi:scoreboard" class="mr-2" />
            SCORE
          </h2>
          <div class="flex justify-center items-center space-x-8">
            <div class="text-center">
              <Icon icon="mdi:account" class="text-4xl text-indigo-500 mb-2" />
              <p class="text-sm font-medium mb-1">Player 1</p>
              <p class="text-3xl font-bold">{{ scores.player1 }}</p>
            </div>
            <div v-if="gameMode === 'multiplayer'" class="text-center">
              <Icon icon="mdi:account" class="text-4xl text-green-500 mb-2" />
              <p class="text-sm font-medium mb-1">Player 2</p>
              <p class="text-3xl font-bold">{{ scores.player2 }}</p>
            </div>
          </div>
        </div>

        <!-- Game Stats -->
        <div class="bg-white rounded-2xl p-6 shadow-lg">
          <div class="flex justify-between items-center">
            <div class="text-center">
              <p class="text-sm font-medium text-gray-500">Total Questions</p>
              <p class="text-2xl font-bold text-indigo-600">{{ totalQuestions }}</p>
            </div>
            <div class="text-center">
              <p class="text-sm font-medium text-gray-500">Remaining Questions</p>
              <p class="text-2xl font-bold text-indigo-600">{{ remainingQuestions }}</p>
            </div>
          </div>
        </div>

        <!-- Flashcard -->
        <div v-if="currentCard" class="relative perspective">
          <div class="rounded-2xl shadow-lg cursor-pointer transition-transform duration-500 transform-style-3d"
            :class="{ 'rotate-y-180': currentCard.isFlipped, 'bg-white': !currentCard.isFlipped, 'bg-green-100': currentCard.isFlipped }"
            @click="flipCard" style="height: 300px;">
            <div class="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8">
              <p class="text-3xl font-semibold text-center text-gray-800 mb-4">
                {{ currentCard.question }}
              </p>
              <p class="text-sm text-gray-500">Question</p>
            </div>
            <div class="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8">
              <p class="text-3xl font-semibold text-center text-gray-800 mb-4">
                {{ currentCard.answer }}
              </p>
              <p class="text-sm text-gray-500">Answer</p>
            </div>
          </div>
        </div>

        <!-- Control Buttons -->
        <div v-if="currentCard" class="flex justify-center gap-4 mt-4">
          <template v-if="gameMode === 'singleplayer'">
            <button v-if="!currentCard.isFlipped" @click="checkAnswer"
              class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center">
              <Icon icon="mdi:check" class="mr-2" />
              Check Answer
            </button>
            <button v-else @click="nextCard"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center">
              <Icon icon="mdi:arrow-right" class="mr-2" />
              Next Card
            </button>
          </template>
          <template v-else-if="gameMode === 'multiplayer'">
            <button v-if="!waitingForAnswer && !someoneAnsweredIncorrectly" @click="iKnowThis"
              class="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center">
              <Icon icon="mdi:lightbulb-on" class="mr-2" />
              I Know This
            </button>
            <button v-if="!waitingForAnswer && !someoneAnsweredIncorrectly" @click="iDontKnow"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center">
              <Icon icon="mdi:help-circle" class="mr-2" />
              I Don't Know
            </button>
            <button v-if="waitingForAnswer && isAnswering" @click="submitAnswer(true)"
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center">
              <Icon icon="mdi:check-circle" class="mr-2" />
              Correct Answer
            </button>
            <button v-if="waitingForAnswer && isAnswering" @click="submitAnswer(false)"
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center">
              <Icon icon="mdi:close-circle" class="mr-2" />
              Wrong Answer
            </button>
          </template>
        </div>

        <div v-if="gameMode === 'multiplayer' && waitingForAnswer && isAnswering"
          class="text-center text-white text-xl mt-4">
          Click the card to flip and check your answer!
        </div>

        <!-- Waiting Message -->
        <div v-if="gameMode === 'multiplayer' && waitingForAnswer && !isAnswering"
          class="text-center text-white text-xl mt-4">
          Waiting for the other player to answer...
        </div>
      </template>

      <!-- Game Over State -->
      <div v-if="gameOver" class="bg-white rounded-2xl p-6 shadow-lg text-center">
        <h2 class="text-3xl text-indigo-600 font-bold mb-6 flex items-center justify-center">
          <Icon icon="mdi:flag-checkered" class="mr-2" />
          Game Over!
        </h2>

        <div class="mb-8">
          <h3 class="text-2xl font-semibold mb-4">Final Scores:</h3>
          <div class="flex justify-center items-center space-x-12">
            <div class="text-center">
              <Icon icon="mdi:account" class="text-5xl text-indigo-500 mb-2" />
              <p class="text-lg font-medium mb-1">{{ playerNumber === 1 ? 'You' : 'Player 1' }}</p>
              <p class="text-4xl font-bold"
                :class="scores.player1 > scores.player2 ? 'text-green-600' : 'text-gray-600'">
                {{ scores.player1 }}
              </p>
            </div>
            <div class="text-center">
              <Icon icon="mdi:account" class="text-5xl text-green-500 mb-2" />
              <p class="text-lg font-medium mb-1">{{ playerNumber === 2 ? 'You' : 'Player 2' }}</p>
              <p class="text-4xl font-bold"
                :class="scores.player2 > scores.player1 ? 'text-green-600' : 'text-gray-600'">
                {{ scores.player2 }}
              </p>
            </div>
          </div>
        </div>

        <div class="mb-8 flex flex-col items-center">
          <template v-if="scores.player1 === scores.player2">
            <p class="text-3xl font-bold text-indigo-600 mb-2">It's a tie!</p>
            <Icon icon="mdi:handshake" class="text-7xl text-indigo-500" />
          </template>
          <template
            v-else-if="(playerNumber === 1 && scores.player1 > scores.player2) || (playerNumber === 2 && scores.player2 > scores.player1)">
            <p class="text-3xl font-bold text-green-600 mb-2">Congratulations, you win!</p>
            <Icon icon="mdi:trophy" class="text-7xl text-yellow-500 animate-bounce" />
          </template>
          <template v-else>
            <p class="text-3xl font-bold text-red-600 mb-2">Better luck next time!</p>
            <Icon icon="mdi:emoticon-sad" class="text-7xl text-gray-500" />
          </template>
        </div>

        <button @click="restartGame"
          class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center mx-auto">
          <Icon icon="mdi:restart" class="mr-2" />
          Play Again
        </button>
      </div>

      <!-- Footer -->
      <footer class="bg-gray-800 text-white py-8 px-4 mt-10 rounded-lg">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
              <p class="text-sm">UI/UX Design & Codes by <a href="https://www.kjchmc.cn" class="font-bold underline text-yellow-300 hover:text-pink-300 transition-colors">Jiacheng Kuang (Kevin)</a></p>
              <p class="text-sm">Game Question & Directions by <span class="font-bold text-teal-300">Aaron Kahn</span></p>
            </div>
            <div class="space-y-2 md:text-right">
              <p class="text-sm">Game Project V2.0</p>
              <p class="text-sm">Code Open Source on <a href="https://github.com/1834423612/memory-game" class="font-bold underline text-amber-200 hover:text-red-400 transition-colors">Github</a></p>
            </div>
          </div>
          <div class="mt-6 text-center space-y-2">
            <p class="text-xs text-gray-400">Server Based on Beijing, CN region, according to the website publish policy</p>
            <div class="space-x-4">
              <a href="http://beian.miit.gov.cn" target="_blank" class="text-xs text-gray-400 hover:text-indigo-300 transition-colors inline-flex items-center">
                <img src="https://cdn.kjchmc.cn/beian/icp.png" alt="ICP" class="h-4 mr-1" />
                冀ICP备19023170号
              </a>
              <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202001885" target="_blank" class="text-xs text-gray-400 hover:text-indigo-300 transition-colors inline-flex items-center">
                <img src="https://cdn.kjchmc.cn/beian/ghs.png" alt="GHS" class="h-4 mr-1" />
                京公网安备11011202001885号
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { Peer, DataConnection } from 'peerjs'
import { Icon } from '@iconify/vue'
import initialCardsData from '../data/cards.json'

interface Card {
  id: number
  question: string
  answer: string
  isFlipped: boolean
}

interface Scores {
  player1: number
  player2: number
}

// Game state
const gameTitle = ref('2024 Flashcard Game Project')
const gameMode = ref<'singleplayer' | 'multiplayer' | null>(null)
const showInstructions = ref(true)
const scores = reactive<Scores>({
  player1: 0,
  player2: 0
})

const initialCards = initialCardsData as Card[] // Use JSON data as Card array

const cards = ref<Card[]>([...initialCards])
const currentCard = ref<Card | null>(null)
const roomCode = ref('')
const peer = ref<Peer | null>(null)
const connection = ref<DataConnection | null>(null)
const isConnected = ref(false)
const allPlayersJoined = ref(false)
const waitingForAnswer = ref(false)
const isAnswering = ref(false)
const isReady = ref(false)
const opponentReady = ref(false)
const countdownStarted = ref(false)
const countdown = ref(5)
const gameStarted = ref(false)
const gameOver = ref(false)
const playerNumber = ref(1)
const isJoining = ref(false)
const joinError = ref('')
const isCreatingRoom = ref(false)
const displayRoomCode = ref('')
const someoneAnsweredIncorrectly = ref(false)
const idkSelected = ref(false)

const totalQuestions = computed(() => initialCards.length)
const remainingQuestions = computed(() => cards.value.length)

const generateRoomCode = () => {
  //colors from https://gist.github.com/diogocapela/b8128d92ee6ed7e05c92fe58def197de
  let colors = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'grey', 'green', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgrey', 'lightgreen', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'];
  //names from https://gist.github.com/borlaym/585e2e09dd6abd9b0d0a
  const animals = [
    "Aardvark",
    "Albatross",
    "Alligator",
    "Alpaca",
    "Ant",
    "Anteater",
    "Antelope",
    "Ape",
    "Armadillo",
    "Donkey",
    "Baboon",
    "Badger",
    "Barracuda",
    "Bat",
    "Bear",
    "Beaver",
    "Bee",
    "Bison",
    "Boar",
    "Buffalo",
    "Butterfly",
    "Camel",
    "Capybara",
    "Caribou",
    "Cassowary",
    "Cat",
    "Caterpillar",
    "Cattle",
    "Chamois",
    "Cheetah",
    "Chicken",
    "Chimpanzee",
    "Chinchilla",
    "Chough",
    "Clam",
    "Cobra",
    "Cockroach",
    "Cod",
    "Cormorant",
    "Coyote",
    "Crab",
    "Crane",
    "Crocodile",
    "Crow",
    "Curlew",
    "Deer",
    "Dinosaur",
    "Dog",
    "Dogfish",
    "Dolphin",
    "Dotterel",
    "Dove",
    "Dragonfly",
    "Duck",
    "Dugong",
    "Dunlin",
    "Eagle",
    "Echidna",
    "Eel",
    "Eland",
    "Elephant",
    "Elk",
    "Emu",
    "Falcon",
    "Ferret",
    "Finch",
    "Fish",
    "Flamingo",
    "Fly",
    "Fox",
    "Frog",
    "Gaur",
    "Gazelle",
    "Gerbil",
    "Giraffe",
    "Gnat",
    "Gnu",
    "Goat",
    "Goldfinch",
    "Goldfish",
    "Goose",
    "Gorilla",
    "Goshawk",
    "Grasshopper",
    "Grouse",
    "Guanaco",
    "Gull",
    "Hamster",
    "Hare",
    "Hawk",
    "Hedgehog",
    "Heron",
    "Herring",
    "Hippopotamus",
    "Hornet",
    "Horse",
    "Human",
    "Hummingbird",
    "Hyena",
    "Ibex",
    "Ibis",
    "Jackal",
    "Jaguar",
    "Jay",
    "Jellyfish",
    "Kangaroo",
    "Kingfisher",
    "Koala",
    "Kookabura",
    "Kouprey",
    "Kudu",
    "Lapwing",
    "Lark",
    "Lemur",
    "Leopard",
    "Lion",
    "Llama",
    "Lobster",
    "Locust",
    "Loris",
    "Louse",
    "Lyrebird",
    "Magpie",
    "Mallard",
    "Manatee",
    "Mandrill",
    "Mantis",
    "Marten",
    "Meerkat",
    "Mink",
    "Mole",
    "Mongoose",
    "Monkey",
    "Moose",
    "Mosquito",
    "Mouse",
    "Mule",
    "Narwhal",
    "Newt",
    "Nightingale",
    "Octopus",
    "Okapi",
    "Opossum",
    "Oryx",
    "Ostrich",
    "Otter",
    "Owl",
    "Oyster",
    "Panther",
    "Parrot",
    "Partridge",
    "Peafowl",
    "Pelican",
    "Penguin",
    "Pheasant",
    "Pig",
    "Pigeon",
    "Pony",
    "Porcupine",
    "Porpoise",
    "Quail",
    "Quelea",
    "Quetzal",
    "Rabbit",
    "Raccoon",
    "Rail",
    "Ram",
    "Rat",
    "Raven",
    "Red deer",
    "Red panda",
    "Reindeer",
    "Rhinoceros",
    "Rook",
    "Salamander",
    "Salmon",
    "Sand Dollar",
    "Sandpiper",
    "Sardine",
    "Scorpion",
    "Seahorse",
    "Seal",
    "Shark",
    "Sheep",
    "Shrew",
    "Skunk",
    "Snail",
    "Snake",
    "Sparrow",
    "Spider",
    "Spoonbill",
    "Squid",
    "Squirrel",
    "Starling",
    "Stingray",
    "Stinkbug",
    "Stork",
    "Swallow",
    "Swan",
    "Tapir",
    "Tarsier",
    "Termite",
    "Tiger",
    "Toad",
    "Trout",
    "Turkey",
    "Turtle",
    "Viper",
    "Vulture",
    "Wallaby",
    "Walrus",
    "Wasp",
    "Weasel",
    "Whale",
    "Wildcat",
    "Wolf",
    "Wolverine",
    "Wombat",
    "Woodcock",
    "Woodpecker",
    "Worm",
    "Wren",
    "Yak",
    "Zebra"
]
  const numbers = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  const randColor = colors[Math.floor(Math.random() * colors.length)]
  const color=randColor.charAt(0).toUpperCase() + randColor.splice(1)
  
  return color + animals[Math.floor(Math.random() * animals.length)]} + numbers
}

// Toggle instructions visibility
const toggleInstructions = () => {
  showInstructions.value = !showInstructions.value
}

// Game mode selection
const startSinglePlayerMode = () => {
  gameMode.value = 'singleplayer'
  gameStarted.value = true
  initializeGame()
}

const startMultiPlayerMode = () => {
  gameMode.value = 'multiplayer'
}

// Initialize the game
const initializeGame = () => {
  if (cards.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * cards.value.length)
    currentCard.value = { ...cards.value[randomIndex] }
    cards.value.splice(randomIndex, 1)
  } else {
    currentCard.value = null
    gameOver.value = true
  }
  waitingForAnswer.value = false
  isAnswering.value = false
  someoneAnsweredIncorrectly.value = false
  idkSelected.value = false
}

// Game actions
const flipCard = () => {
  if (currentCard.value && (gameMode.value === 'singleplayer' || (gameMode.value === 'multiplayer' && isAnswering.value))) {
    currentCard.value.isFlipped = !currentCard.value.isFlipped
    if (gameMode.value === 'multiplayer') {
      sendGameState()
    }
  }
}

const iKnowThis = () => {
  if (gameMode.value === 'multiplayer' && !waitingForAnswer.value) {
    waitingForAnswer.value = true
    isAnswering.value = true
    sendGameState()
  }
}

const iDontKnow = () => {
  if (gameMode.value === 'multiplayer' && !waitingForAnswer.value) {
    waitingForAnswer.value = true
    isAnswering.value = false
    idkSelected.value = true
    sendIDontKnow()
  }
}

const submitAnswer = (isCorrect: boolean) => {
  if (gameMode.value === 'multiplayer' && isAnswering.value) {
    if (isCorrect) {
      if (playerNumber.value === 1) {
        scores.player1++
      } else {
        scores.player2++
      }
      nextCard()
    } else {
      if (idkSelected.value) {
        // If the other player said "I Don't Know", move to next card immediately
        nextCard()
      } else {
        someoneAnsweredIncorrectly.value = true
        isAnswering.value = false
        sendGameState()
      }
    }
  }
}

const checkAnswer = () => {
  if (currentCard.value && !currentCard.value.isFlipped) {
    currentCard.value.isFlipped = true
    if (gameMode.value === 'singleplayer') {
      scores.player1++
    }
  }
}

const nextCard = () => {
  initializeGame()
  if (gameMode.value === 'multiplayer') {
    sendGameState()
  }
}

const restartGame = () => {
  cards.value = [...initialCards]
  scores.player1 = 0
  scores.player2 = 0
  gameOver.value = false
  initializeGame()
  if (gameMode.value === 'multiplayer') {
    sendGameState()
  }
}

const readyUp = () => {
  isReady.value = true
  sendReadyState()
  checkBothPlayersReady()
}

const startCountdown = () => {
  countdownStarted.value = true
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
      gameStarted.value = true
      initializeGame()
    }
  }, 1000)
}

// WebRTC functions
const createRoom = () => {
  if (!peer.value && !isJoining.value) {
    isJoining.value = true
    isCreatingRoom.value = true
    joinError.value = ''
    const code = generateRoomCode()
    peer.value = new Peer(code)

    peer.value.on('open', (id) => {
      console.log('My peer ID is: ' + id)
      displayRoomCode.value = code
      isConnected.value = true
      playerNumber.value = 1
      isJoining.value = false
      isCreatingRoom.value = false
    })

    peer.value.on('error', (error) => {
      console.error('PeerJS error:', error)
      isJoining.value = false
      isCreatingRoom.value = false
      joinError.value = `Failed to create room: ${error}`
    })

    peer.value.on('connection', (conn) => {
      connection.value = conn
      setupConnection()
    })
  }
}

const joinRoom = () => {
  if (!peer.value && !isJoining.value) {
    isJoining.value = true
    joinError.value = ''
    peer.value = new Peer()

    peer.value.on('open', () => {
      console.log('Joining room:', roomCode.value)
      connection.value = peer.value!.connect(roomCode.value)
      playerNumber.value = 2
      displayRoomCode.value = roomCode.value
      setupConnection()
    })

    peer.value.on('error', (error) => {
      console.error('PeerJS error:', error)
      isJoining.value = false
      if (error.type === 'peer-unavailable') {
        joinError.value = 'Room not found. Please check the Room Code or create a new room.'
      } else {
        joinError.value = `Failed to join room: ${error}`
      }
    })
  }
}

const setupConnection = () => {
  if (connection.value) {
    connection.value.on('open', () => {
      console.log('Connected to peer')
      isConnected.value = true
      allPlayersJoined.value = true
      isJoining.value = false
      joinError.value = ''
    })

    connection.value.on('error', (error) => {
      console.error('Connection error:', error)
      isJoining.value = false
      joinError.value = 'Connection error. Please try again.'
    })

    connection.value.on('close', () => {
      console.log('Connection closed')
      isConnected.value = false
      allPlayersJoined.value = false
      joinError.value = 'Connection closed. Please rejoin the room.'
    })

    connection.value.on('data', (data: any) => {
      console.log('Received data:', data)
      if (data.type === 'gameState') {
        updateGameState(data.state)
      } else if (data.type === 'iDontKnow') {
        handleIDontKnow()
      } else if (data.type === 'ready') {
        handleOpponentReady()
      }
    })
  }
}

const sendGameState = () => {
  if (connection.value && connection.value.open) {
    const gameState = {
      currentCard: currentCard.value,
      scores,
      remainingCards: cards.value.length,
      waitingForAnswer: waitingForAnswer.value,
      isAnswering: isAnswering.value,
      gameOver: gameOver.value,
      someoneAnsweredIncorrectly: someoneAnsweredIncorrectly.value,
      idkSelected: idkSelected.value
    }
    connection.value.send({ type: 'gameState', state: gameState })
  }
}

const sendIDontKnow = () => {
  if (connection.value && connection.value.open) {
    connection.value.send({ type: 'iDontKnow' })
  }
}

const sendReadyState = () => {
  if (connection.value && connection.value.open) {
    connection.value.send({ type: 'ready' })
  }
}

const handleIDontKnow = () => {
  if (currentCard.value) {
    if (idkSelected.value) {
      // Both players don't know, move to next card
      currentCard.value.isFlipped = true
      setTimeout(() => {
        cards.value.push({ ...currentCard.value!, isFlipped: false })
        nextCard()
      }, 3000)
    } else {
      // Wait for the other player's response
      waitingForAnswer.value = true
      isAnswering.value = true
    }
  }
}

const handleOpponentReady = () => {
  opponentReady.value = true
  checkBothPlayersReady()
}

const checkBothPlayersReady = () => {
  if (isReady.value && opponentReady.value) {
    startCountdown()
  }
}

const updateGameState = (state: any) => {
  currentCard.value = state.currentCard
  scores.player1 = state.scores.player1
  scores.player2 = state.scores.player2
  waitingForAnswer.value = state.waitingForAnswer
  isAnswering.value = !state.isAnswering
  gameOver.value = state.gameOver
  someoneAnsweredIncorrectly.value = state.someoneAnsweredIncorrectly
  idkSelected.value = state.idkSelected

  if (state.gameOver) {
    createConfetti()
  }

  if ((someoneAnsweredIncorrectly.value && !isAnswering.value) || (idkSelected.value && !isAnswering.value)) {
    // Move to the next card if both players answered incorrectly or if IDK was selected and the other player answered incorrectly
    nextCard()
  }
}

const returnToHome = () => {
  gameMode.value = null
  isConnected.value = false
  allPlayersJoined.value = false
  isReady.value = false
  opponentReady.value = false
  countdownStarted.value = false
  gameStarted.value = false
  gameOver.value = false

  if (connection.value) {
    connection.value.close()
  }
  if (peer.value) {
    peer.value.destroy()
  }

  peer.value = null
  connection.value = null
  roomCode.value = ''
  displayRoomCode.value = ''
}

onMounted(() => {
  if (gameMode.value === 'multiplayer') {
    createRoom() // Changed to createRoom for testing purposes. Should be joinRoom in production.
  }
})

onUnmounted(() => {
  if (connection.value) {
    connection.value.close()
  }
  if (peer.value) {
    peer.value.destroy()
  }
})

const createConfetti = () => {
  // Implement confetti animation here
  console.log('Confetti animation triggered')
}
</script>

<style scoped>
.perspective {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
