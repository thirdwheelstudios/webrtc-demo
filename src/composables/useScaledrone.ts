import { ref } from "vue"

export const useScaledrone = () => {
  const drone = ref<Scaledrone>()
  const room = ref<Room>()
  const isConnected = ref(false)
  const hasJoined = ref(false)
  const messages = ref<any[]>([])

  const joinRoom = (roomName: string) => {
    if (!drone.value) return

    room.value = drone.value.subscribe(roomName)

    room.value.on("open", (error) => {
      hasJoined.value = !error
    })

    room.value.on("data", (message) => {
      messages.value.push(message)
    })
  }

  const connect = () => {
    drone.value = new Scaledrone(import.meta.env.VITE_CHANNEL_ID)

    drone.value.on("open", (error) => {
      isConnected.value = !error
    })
  }

  const publish = (message: any) => {
    if (!drone.value) return

    drone.value.publish({
      room: room.value?.name ?? "",
      message,
    })
  }

  return {
    connect,
    publish,
    isConnected,
    joinRoom,
    drone,
    room,
    hasJoined,
    messages,
  }
}
