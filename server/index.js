const io = require('socket.io')(3000);

const arrUserInfo = [];

io.on('connection', socket => {
    socket.on('NGUOI_DUNG_DANG_KY', user => {
        const isExit = arrUserInfo.some(c => c.ten == user.ten);
        if(isExit){return socket.emit('DANG_KY_THAT_BAI')}
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE', arrUserInfo);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI' , user);
    });

    socket.on('disconnect' , () => {
        const index = arrUserInfo.findIndex(a=> a.peerId === socket.peerId);
        arrUserInfo.splice(index , 1);
        io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    })
});