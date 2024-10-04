import express from 'express';
import User from '../models/User.js';
import { check } from 'express-validator';
import authMiddleware from '../middlewares/authMiddleware.js';
import {sendInAppNotification, sendNotification, getAllNotifications, notifyNewDonor, notifyDonationFulfilled, notifyDonationMatch } from '../utils/notificationUtils.js';

const notificationRoutes = express.Router();

notificationRoutes.post('/in-app', authMiddleware, (req, res) => {
    sendInAppNotification(req.user.userId, 'This is an in-app notification');
    res.send('Notification sent');
});

notificationRoutes.get('/:userId', async (req, res) => {
    getAllNotifications(req.params.userId).then((notifications) => {
        res.send(notifications);
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving notifications.",
        });
    })
  });


notificationRoutes.post('/email-notification', authMiddleware, (req, res) => {
    const { email, subject, message } = req.body;
    sendNotification(email, subject, message).then(() => {
        res.send('Notification sent');
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while sending email notification.",
        });
    });
});

notificationRoutes.post('/in-app-email', authMiddleware, (req, res) => {
    const { userId, email, subject, message } = req.body;
    sendNotification(userId, email, subject, message).then(() => {
        res.send('Notification sent');
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while sending email notification.",
        });
    });
});

notificationRoutes.post('/donation-match', authMiddleware, (req, res) => {
    const { userId, email, donationType } = req.body;
    notifyDonationMatch(userId, email, donationType).then(() => {
        res.send('Notification sent');
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while sending email notification.",
        });
    });
});

notificationRoutes.post('/donation-fulfilled', authMiddleware, (req, res) => {
    const { userId, email, donationType } = req.body;
    notifyDonationFulfilled(userId, email, donationType).then(() => {
        res.send('Notification sent');
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while sending email notification.",
        });
    });
});

notificationRoutes.post('/donation-request', authMiddleware, (req, res) => {
    const { userId, email, donationType } = req.body;
    notifyDonationRequest(userId, email, donationType).then(() => {
        res.send('Notification sent');
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while sending email notification.",
        });
    });
});

notificationRoutes.post('/new-donor', authMiddleware, (req, res) => {
    const { userId, email } = req.body;
    notifyNewDonor(userId, email).then(() => {
        res.send('Notification sent');
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while sending email notification.",
        });
    });
});

notificationRoutes.post('/new=beneficiery', authMiddleware, (req, res) => {
    const { userId, email } = req.body;
    notifyNewBeneficiery(userId, email).then(() => {
        res.send('Notification sent');
    }).catch((err) => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while sending email notification.",
        });
    });
})

export default notificationRoutes;




