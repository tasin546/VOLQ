const express = require('express');
const router = express.Router();
const axios = require('axios');
const { db } = require('../../handlers/db.js');
const { isUserAuthorizedForContainer } = require('../../utils/authHelper');

router.post("/instance/:id/power", async (req, res) => {
    if (!req.user) return res.redirect('/');
    const { id } = req.params;
    const instance = await db.get(id + '_instance');

    if (!instance || !id) return res.redirect('../instances');

    const isAuthorized = await isUserAuthorizedForContainer(req.user.userId, instance.Id);
    if (!isAuthorized) {
        return res.status(403).send('Unauthorized access to this instance.');
    }

    if(!instance.suspended) {
        instance.suspended = false;
        db.set(id + '_instance', instance);
    }

    if(instance.suspended === true) {
        return res.redirect('../../instances?err=SUSPENDED');
   }

    try {
        const response = await axios.post(`http://${instance.Node.address}:${instance.Node.port}/instances/${instance.ContainerId}/stop`, {
            command: instance.StopCommand
        }, {
            auth: {
                username: 'Volq',
                password: instance.Node.apiKey
            },
            headers: { 
                'Content-Type': 'application/json'
            }
        });
        res.send(response.data);
    } catch (error) {
        const errorMessage = error.response && error.response.data ? error.response.data.message : 'Connection to node failed.';
        res.status(500).send(errorMessage);
    }
});

module.exports = router;
