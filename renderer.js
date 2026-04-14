let peerConnection;
let remoteStream;
let localStream;

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
};

const socket = io('http://localhost:8080'); // Connect to the signaling server

// Initialize local video stream
let init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  const localVideo = document.getElementById('local-video');
  localVideo.srcObject = localStream;
  setupSocketListeners();
};

// Create SDP offer (Caller)
let createOffer = async () => {
  setupPeerConnection();

  try {
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    document.getElementById('create-offer').value = JSON.stringify(offer);
    socket.emit('offer', offer);
  } catch (error) {
    console.error('Error creating WebRTC offer:', error);
  }
};

// Respond to SDP offer with SDP answer (Callee)
socket.on('offer', async (offer) => {
  setupPeerConnection();
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    document.getElementById('create-answer').value = JSON.stringify(answer);
    socket.emit('answer', answer);
  } catch (error) {
    console.error('Error handling SDP offer:', error);
  }
});

// Handle SDP answer (Caller)
socket.on('answer', async (answer) => {
  try {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  } catch (error) {
    console.error('Error setting remote description from answer:', error);
  }
});

// Handle incoming ICE candidates
socket.on('candidate', async (candidate) => {
  try {
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  } catch (error) {
    console.error('Error adding received ICE candidate:', error);
  }
});

// Set up RTCPeerConnection and event handlers
let setupPeerConnection = () => {
  peerConnection = new RTCPeerConnection(servers);
  remoteStream = new MediaStream();
  const remoteVideo = document.getElementById('remote-video');
  remoteVideo.srcObject = remoteStream;

  // Add tracks from local stream
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Add incoming tracks to remote stream
  peerConnection.ontrack = (event) => {
    event.streams[0].getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('candidate', event.candidate);
    }
  };
};

// Call init function to start video stream
init();