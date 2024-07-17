const localVideo = document.getElementById("localVideo") as HTMLVideoElement;
const remoteVideo = document.getElementById("remoteVideo") as HTMLVideoElement;
const startButton = document.getElementById("startButton") as HTMLButtonElement;
const callButton = document.getElementById("callButton") as HTMLButtonElement;
const hangupButton = document.getElementById(
  "hangupButton"
) as HTMLButtonElement;

let localStream: MediaStream;
let peerConnection: RTCPeerConnection | null = null;
let remoteStream: MediaStream;

const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

async function start() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.srcObject = localStream;
  } catch (error) {
    console.error("Error accessing media devices.", error);
  }
}

async function call() {
  peerConnection = new RTCPeerConnection(servers);
  remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => {
    if (peerConnection !== null) {
      peerConnection.addTrack(track, localStream);
    }
  });

  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    remoteVideo.srcObject = remoteStream;
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      // Send the candidate to the remote peer
      // Here you would typically use signaling server to send the candidate to the remote peer
    }
  };

  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    // Send the offer to the remote peer
    // Here you would typically use signaling server to send the offer to the remote peer
  } catch (error) {
    console.error("Error creating offer.", error);
  }
}

async function hangup() {
    if (peerConnection !== null) {
        peerConnection.close();
        peerConnection = null;
    }
}
