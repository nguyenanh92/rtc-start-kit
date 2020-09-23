const socket = io('https://nvs-rtc-start-kit.herokuapp.com');


// let customConfig;

// $.ajax({
//   url: "https://service.xirsys.com/ice",
//   data: {
//     ident: "lovehlmmm",
//     secret: "55572294-fd49-11ea-b45c-0242ac15000",
//     domain: "https://nguyenanh92.github.io/rtc-start-kit",
//     application: "default",
//     room: "default",
//     secure: 1
//   },
//   success: function (data, status) {
//     // data.d is where the iceServers object lives
//     customConfig = data.d;
//     console.log(customConfig);
//   },
//   async: false
// });

$('#div-chat').hide();


socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-signup').hide();
    $('#div-chat').show();

    arrUserInfo.forEach(user => {

        console.log('user-online', user);
        const { ten, peerId } = user;
        $('#ulUser').append(`<li class="list-group-item" id="${peerId}"><b>${ten}</b></li>`)
    });

    socket.on('CO_NGUOI_DUNG_MOI', user => {
        console.log(user);
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
    const config = { audio: false, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

 async function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    await video.play();
}

const peer = new Peer({
    host: '0.peerjs.com',
    config: {
        iceServers: [{
            urls: [ "stun:ss-turn1.xirsys.com" ]
         }, {
            username: "WaT9l3r6uwGc1pgoZ9qfOblR1ZDGKfzz_AlZjwITrMMXkQcxudeEruZQfwO73-TWAAAAAF9rBVpsb3ZlaGxtbW0=",
            credential: "abab42e8-fd75-11ea-b36d-0242ac140004",
            urls: [
                "turn:ss-turn1.xirsys.com:80?transport=udp",
                "turn:ss-turn1.xirsys.com:3478?transport=udp",
                "turn:ss-turn1.xirsys.com:80?transport=tcp",
                "turn:ss-turn1.xirsys.com:3478?transport=tcp",
                "turns:ss-turn1.xirsys.com:443?transport=tcp",
                "turns:ss-turn1.xirsys.com:5349?transport=tcp"
            ]
         }]
    }
});


peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
    });
});

//Caller
$('#btnCall').click(() => {
    const id = $('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

//Callee
peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});

$('#ulUser').on('click', 'li', function () {
    const id = $(this).attr('id');
    console.log(id);
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    });
});