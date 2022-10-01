import { ref } from "vue"
import { useScaledrone } from "./useScaledrone"

const mimeTypes = ["video/webm", "video/mp4"]

export const useWebRTC = () => {
  const isSupported = ref(
    navigator && navigator.mediaDevices.getDisplayMedia !== undefined
  )
  const supportedMimeType = ref(
    mimeTypes
      .filter((mimeType) => MediaRecorder.isTypeSupported(mimeType))
      .pop()
  )

  const receivingTrack = ref<MediaStreamTrack>()
  const peerConnection = ref<RTCPeerConnection>()

  const getDisplayStream = async () => {
    const constraints = {
      video: true,
      audio: true,
    } as DisplayMediaStreamConstraints

    const mediaStream = await navigator.mediaDevices.getDisplayMedia(
      constraints
    )

    return mediaStream
  }

  const getRTCPeerConnection = async (isOfferer: boolean) => {
    const rtcConfig = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302", // Google's public STUN server
        },
      ],
    } as RTCConfiguration

    peerConnection.value = new RTCPeerConnection(rtcConfig)

    const { publish } = useScaledrone()

    peerConnection.value.onicecandidate = (event) => {
      if (event.candidate) publish({ candidate: event.candidate })
    }

    if (isOfferer) {
      const localDesc = await peerConnection.value.createOffer()
      peerConnection.value.setLocalDescription(localDesc)
      publish({ sdp: peerConnection.value.localDescription })
    }

    peerConnection.value.ontrack = (event) => {
      receivingTrack.value = event.track
    }

    const mediaStream = await getDisplayStream()

    mediaStream.getTracks().forEach((track) => {
      peerConnection.value?.addTrack(track)
    })

    startListeningToSignalServer()
  }

  const startListeningToSignalServer = () => {
    const { publish } = useScaledrone()

    // room.value?.on("data", async (message) => {
    //   if (!peerConnection.value) return
    //   if (message.sdp) {
    //     // This is called after receiving an offer or answer from another peer
    //     await peerConnection.value?.setRemoteDescription(
    //       new RTCSessionDescription(message.sdp)
    //     )

    //     if (peerConnection.value.remoteDescription?.type === "offer") {
    //       const localDesc = await peerConnection.value.createAnswer()
    //       peerConnection.value.setLocalDescription(localDesc)
    //       publish({ sdp: peerConnection.value.localDescription })
    //     }
    //   } else if (message.candidate) {
    //     // Add the new ICE candidate to our connections remote description
    //     await peerConnection.value.addIceCandidate(new RTCIceCandidate(message.candidate))
    //   }
    // })
  }

  return {
    isSupported,
    supportedMimeType,
    getRTCPeerConnection,
    startListeningToSignalServer,
  }
}
