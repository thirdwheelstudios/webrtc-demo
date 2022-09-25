export async function getPeerConnection() {
  const connection = new RTCPeerConnection({ iceServers: [{ urls: ["", ""] }] })

  const display = await navigator.mediaDevices.getDisplayMedia()

  connection.addTrack(display.getVideoTracks()[0])
}
