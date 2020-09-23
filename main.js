const socket = io('https://nvs-rtc-start-kit.herokuapp.com');

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var ice;

$(function(){
    // Get Xirsys ICE (STUN/TURN)
    if(!ice){
        ice = new $xirsys.ice('/webrtc');
        ice.on(ice.onICEList, function (evt){
            console.log('onICE ',evt);
            if(evt.type == ice.onICEList){
                create(ice.iceServers);
                console.log('iceServers')
            }
        });
    }
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
    config: ice.iceServers 
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
