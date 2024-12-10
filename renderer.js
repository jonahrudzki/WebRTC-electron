let peerConnection;
let remoteStream;
let localStream;

const servers = {
    iceServers: [
        {
            // Using google STUN servers
            urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
        }
    ]
}

let createOffer = async () => {
    // Setup the RTC Peer COnnection and media stream
    peerConnection = new RTCPeerConnection(servers);
    remoteStream = new MediaStream();

    // Set video element src to the medistream
    const remoteVideo = document.getElementById('remote-video');
    remoteVideo.srcObject = remoteStream;

    // add tracks to outgoing stream
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    })

    // recieve tracks from incomign stream
    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack()
        })
    }

    // event listener for receiving ice candidates
    peerConnection.onicecandidate = async (event) => {
        // check if is a candidate
        if(event.candidate) {
            console.log('New ICE Candidate', event.candidate)
        }
    }

    try {
        // Create offer
        let offer = await peerConnection.createOffer();
        // THIS starts making a series of requests to the STUN server, and creates ICE candidates
        await peerConnection.setLocalDescription(offer);

        document.getElementById("create-offer").innerText = JSON.stringify(offer);
        console.log('Offer:', offer);
    } catch (error) {
        console.error('Error creating WebRTC offer:', error);
    }
};

let init = async () => {
    // Setting up local stream
    localStream = await navigator.mediaDevices.getUserMedia({video:true, audio:false})

    const localVideo = document.getElementById('local-video')
    localVideo.srcObject = localStream

    // Changed to on click
    // await createOffer();
};

init()