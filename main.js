
const socket = io('http://localhost:3000');

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
        $(`${peerId}`).remove();
    });

});

socket.on('DANG_KY_THAT_BAI', () => alert('Username does not exit !!'));

function openStream() {
    const config = {
        audio: true,
        video: false,
    }
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}
// openStream().then(stream => playStream('localStream' , stream));


const peer = new Peer();

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

