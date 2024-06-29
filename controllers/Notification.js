import Notification from "../models/Notification.js"

const getAllNotifications = async(req, res) => {
    const userId = req.params.id;
    try {
        const notificattions = await Notification.find({
            receiver: userId
        }).populate('sender', 'username avatar').sort({createdAt: -1});

        if(!notificattions) {
            return res.status(404).json({
                message: 'ERROR'
            })
        }

        const numberNotRead = notificattions.filter(noti => noti.isRead === false);

        return res.status(200).json({
            data: notificattions,
            numberNotRead: numberNotRead.length
        });
    } catch (err) {
        return res.status(500).json({
            message: err
        })
    }
}

const insertNotification = async(req, res) => {
    const {type, link, receiver, sender} = req.body;
    try {
        const notificattions = await Notification.create({
            receiver,
            type,
            link,
            sender
        });
        await notificattions.populate('sender')

        return res.status(200).json(notificattions);
    } catch (err) {
        console.log(err);
    }
}

const updateNotificationStatus = async(req, res) => {
    const {isRead} = req.body;
    const notificationId = req.params.id;
    try {
        const notificattions = await Notification.findByIdAndUpdate({
            _id: notificationId
           }, {
            isRead
           });
       
        return res.status(201).json(notificattions);
    } catch (err) {
        return res.status(500).json({
            message: err
        })
    }
}

export default {
    getAllNotifications,
    insertNotification,
    updateNotificationStatus
}