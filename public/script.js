// import socket io
const socket = io("/");

const videoGrid = document.getElementById("video-grid");
const liveVideo = document.createElement("video");
// mute the live video
liveVideo.muted = true;

// create a peer
const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});

let videoStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    videoStream = stream;
    addVideoStream(liveVideo, stream);

    // answer call from peer connection
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // listening to connection from new user
    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });

    // input value
    let msg = document.querySelector("input");
    const html = document.querySelector("html");
    html.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 && msg.value.length !== 0) {
        socket.emit("message", msg.value);
        msg.value = "";
      }
    });

    socket.on("createMessage", (message) => {

      $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
      scrollToBottom();
    });
  });

// listen to peer connection
peer.on("open", (id) => {
  // emit connection on client side
  socket.emit("join-room", roomId, id);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

// add video stream
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const scrollToBottom = () => {
  let scroll = $(".main__chat_window");
  scroll.scrollTop(scroll.prop("scrollHeight"));
};

// mute audio
const muteUnmute = () => {
  const enabled = videoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    videoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    videoStream.getAudioTracks()[0].enabled = true;
  }
};

// mute and unmute video
const playStop = () => {
  console.log("object");
  let enabled = videoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    videoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    videoStream.getVideoTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};
