import { defineStore } from "pinia"
import { toRaw } from "vue"

export const useScaledroneStore = defineStore("scaledrone", {
  state: () => {
    let _drone: Scaledrone | undefined
    let _room: Room | undefined
    let _isConnected = false
    let _hasJoined = false
    let _messages: any[] = []

    return {
      _drone,
      _room,
      _isConnected,
      _hasJoined,
      _messages,
    }
  },
  getters: {
    drone(state) {
      return state._drone
    },
    room(state) {
      return state._room
    },
    isConnected(state) {
      return state._isConnected
    },
    hasJoined(state) {
      return state._hasJoined
    },
    messages(state) {
      return state._messages
    },
  },
  actions: {
    connect() {
      const drone = new Scaledrone(import.meta.env.VITE_CHANNEL_ID)

      drone.on("open", (error) => {
        this._isConnected = !error
      })

      this._drone = drone
    },
    joinRoom(roomName: string) {
      if (!this._drone) return
      const drone = toRaw(this._drone)

      const room = drone.subscribe(roomName)

      room.on("open", (error) => {
        this._hasJoined = !error
      })

      room.on("data", (message) => {
        this._messages.push(message)
      })

      this._room = room
    },
    publish(message: any) {
      if (!this._drone) return

      const drone = toRaw(this._drone)
      const room = this._room?.name ?? ""

      drone.publish({
        room,
        message,
      })
    },
  },
})
