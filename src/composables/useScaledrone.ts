import { onMounted, ref } from "vue"

export const useScaledrone = () => {
  const isConnected = ref(false)

  onMounted(() => {
    const drone = new Scaledrone(import.meta.env.VITE_CHANNEL_ID)

    drone.on("open", (error) => {
      isConnected.value = !error
    })
  })

  return { isConnected }
}
