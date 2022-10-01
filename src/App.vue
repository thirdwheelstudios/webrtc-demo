<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { computed, onMounted, reactive } from "vue"
import HelloWorld from "./components/HelloWorld.vue"
import { useWebRTC } from "./composables/useWebRTC"
import { useScaledroneStore } from "./store"

const channelId = import.meta.env.VITE_CHANNEL_ID

const state = reactive({
  roomName: "",
  message: "",
  isOffering: false,
})

const scaledroneStore = useScaledroneStore()

const { getRTCPeerConnection } = useWebRTC()

const onSubmit = () => {
  scaledroneStore.joinRoom(state.roomName)
}

const onMessageSubmit = () => {
  scaledroneStore.publish(state.message)
}

const getPeerConnection = async () => {
  const peer = await getRTCPeerConnection(state.isOffering)
}

const isConnected = computed(() => scaledroneStore.isConnected)
const hasJoined = computed(() => scaledroneStore.hasJoined)
const messages = computed(() => scaledroneStore.messages)

onMounted(() => scaledroneStore.connect())
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
      {{ channelId }}
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      Connected: {{ isConnected }} / Has Joined: {{ hasJoined }}
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <div>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="state.roomName" />
      <button type="submit" :disabled="!state.roomName.length || !isConnected">
        Join Room
      </button>
    </form>
    <form @submit.prevent="onMessageSubmit">
      <input type="text" v-model="state.message" />
      <button type="submit" :disabled="!state.message.length || !isConnected">
        Send Message
      </button>
    </form>
    <input type="checkbox" v-model="state.isOffering" />
    <label>Is Offering</label>
    <button
      :disabled="!state.roomName.length || !isConnected"
      @click="getPeerConnection"
    >
      Get RTCPeerConnection
    </button>
    {{ messages }}
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
