import PocketBase from "pocketbase";

const pb = new PocketBase("https://rasult22.pockethost.io");
pb.autoCancellation(false)
const calls = pb.collection("calls");
const offerCandidates = pb.collection("offer_candidates");
const answerCandidates = pb.collection("answer_candidates");
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const call = async (audioRef: React.RefObject<HTMLAudioElement | null>, apartment_number: string, res_complex_id: string) => {
  // should we check if apartment_number is exist in res_complex and have user attached to it?

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
    video: isMobile
      ? { facingMode: 'user'} 
      : true, // enabling front camera on mobile
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
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


  /*
    Thinking:
    1. Пользователь должен уметь создать звонок указав квартиру пользователя
    2. Он должен уметь создавать звонок без авторизации.
    3. При создании нужно указать: uuid звонка, номер квартиры, id ЖК, статус звонка
    4. После создания должен отработать хук в бэке, 
       который отправит voip пуш пользователю указав необходимые данные
       для установки WebRTC соединения.
    5. Что касается voip пушей нужно по токену понять это ios или android
       и отправить соответствующий пуш.
    6. Когда установлено соединение нужно обновить статус звонка на 'connected'
    7. Когда звонок завершится нужно обновить статус звонка на 'ended'
    8. А что если пользователь позвонит через браузер и просто закроет окно? 
       Как это обработать? Нужен какой-то таймаут?
       Пользователь может принять звонок но webrtc не установит соединение. 
  */
 const DEFAULT_RES_COMPLEX_ID = 'd757od5um7yfo8b'

  // creating call in the backend
  const call = await calls.create({
    complex_id: res_complex_id || DEFAULT_RES_COMPLEX_ID,
    apartment_number,
    status: 'START' // START | PENDING | CONNECTED | ENDED
  })

  // sending offer candidates to the backend (pocketbase)
  pc.onicecandidate = async (event) => {
    if (event.candidate) {
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
    offerToReceiveVideo: true
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