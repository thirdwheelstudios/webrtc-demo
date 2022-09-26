import { ref } from "vue"

export const useScaledrone = () => {
  let drone: Scaledrone
  let room: Room
  const isConnected = ref(false)
  const hasJoined = ref(false)
  const messages = ref<any[]>([])

  const joinRoom = (roomName: string) => {
    room = drone.subscribe(roomName)

    room.on("open", (error) => {
      hasJoined.value = !error
    })

    room.on("data", message => {
        messages.value.push(message)
    })
  }

  const connect = () => {
    drone = new Scaledrone(import.meta.env.VITE_CHANNEL_ID)

    drone.on("open", (error) => {
      isConnected.value = !error
    })
  }

  const publish = (message: string) => {
    drone.publish({
        room: room.name,
        message
    })
  }

  return { connect, publish, isConnected, joinRoom, hasJoined, messages }
}
