const socket = io('https://nvs-rtc-start-kit.herokuapp.com');


let customConfig;

$.ajax({
  url: "https://service.xirsys.com/ice",
  data: {
    ident: "lovehlmmm",
    secret: "55572294-fd49-11ea-b45c-0242ac15000",
    domain: "https://nguyenanh92.github.io/rtc-start-kit",
    application: "default",
    room: "default",
    secure: 1
  },
  success: function (data, status) {
    // data.d is where the iceServers object lives
    customConfig = data.d;
    console.log(customConfig);
  },
  async: false
});

$('#div-chat').hide();


socket.on('DANH_SACH_ONLINE', user => {
    $('#div-signup').hide();
    $('#div-chat').show();

    user.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li class="list-group-item" id="${peerId}"><b>${ten}</b></li>`)
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li class="list-group-item" id="${peerId}"><b>${ten}</b></li>`)
    });

    socket.on('AI_DO_NGAT_KET_NOI', peerId => {
        console.log(peerId);
        $(`#${peerId}`).remove();
    });

});

socket.on('DANG_KY_THAT_BAI', () => alert('Username does not exit !!'));

function openStream() {
    const config = {
        audio: false,
        video: true,
    }
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
// openStream().then(stream => playStream('localStream' , stream));


const peer = new Peer({
    host : '0.peerjs.com',
    config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }] }
});

// const peer = new Peer({key : 'peerjs' , host : 'nvs-rtc-start-kit.herokuapp.com' , secure : true , port :443, path : '/index'});

peer.on('open', id => {
    $('#my-peer').append(id);

    $("#btnSignUp").click(() => {
        const username = $('#txtUserName').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
});


//caller
$("#btnCall").click(() => {
    const id = $('#remoteId').val();
    openStream().then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});


peer.on('call', call => {
    openStream().then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    })
})


$('#ulUser').on('click', 'li', function (){
    const id = $(this).attr('id');
    openStream().then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});
