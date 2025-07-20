import PocketBase from "pocketbase";

const pb = new PocketBase("https://rasult22.pockethost.io");
pb.autoCancellation(false)
const calls = pb.collection("calls");
const offerCandidates = pb.collection("offer_candidates");
const answerCandidates = pb.collection("answer_candidates");

export const call = async (audioRef:React.RefObject<HTMLAudioElement | null>) => {

  // authenticate
  const auth = await pb
    .collection("users")
    .authWithPassword('webrtc_web', '12345678');
  
    // get user id
  const userId = auth.record.id;
  
  // get ice servers
  const servers = {
    iceServers: [{
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302",
        "stun:stun4.l.google.com:19302"
      ]
    }],
    iceCandidatePoolSize: 10,
  };

  // create Peer connection
  const pc = new RTCPeerConnection(servers);
  
  // initialize streams
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: true,
  });
  const remoteStream = new MediaStream();
  
  // add localStream tracks to peer connection
  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream as MediaStream);
  });

  // set up ontrack to receive the remote stream
  pc.ontrack = (event) => {
    const stream = event.streams[0];
    if (audioRef.current) {
      audioRef.current.srcObject = stream
      audioRef.current.play();
    }
    stream.getTracks().forEach((track) => {
      console.log(track, 'track')
      remoteStream?.addTrack(track);
    });
  };

  // creating call in the backend
  const call = await calls.create({
    user_id: userId,
    receiver_id: 'apmnu73db9u8wsa',
    status: 'pending'
  })

  // sending offer candidates to the backend (pocketbase)
  pc.onicecandidate = async (event) => {
    if(event.candidate) {
      console.log('creating event candidate')
      await offerCandidates.create({
        call_id: call.id,
        data: event.candidate.toJSON()
      })
    }
  }
  
  // create offer
  const offerDescription = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: false
  });

  // set local offer desc
  await pc.setLocalDescription(offerDescription);
  
  // prepare payload
  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  }

  // send offer to the backend
  await calls.update(call.id, {
    offer
  })

  // subscribe to call.id to get answer description
  calls.subscribe(call.id, (e) => {
    const data = e.record;
    console.log('set remote description', data)
    // check if remote description is set
    if (!pc.currentRemoteDescription && data?.answer) {
      // set remote description
      const answerDescription = new RTCSessionDescription(data.answer);
      pc.setRemoteDescription(answerDescription);
    }
  })

  // listen to answer candidates in the backend and add to peer connection
  answerCandidates.subscribe('*', (e) => {
    if (e.action === 'create') {
      if (e.record?.call_id === call.id) {
        const data = e.record.data;
        const candidate = new RTCIceCandidate(data);
        pc.addIceCandidate(candidate)
      }
    }
  })
  return {
    call,
    pc,
    localStream,
    remoteStream
  }
}