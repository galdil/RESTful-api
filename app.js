const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();



//bringing the device.js
Device = require('./models/device');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());



// Connect to Mongooses
mongoose.connect('mongodb://localhost:27017/devices')
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    return;
});
//var db = mongoose.connection;

app.get('/', (req, res) => {
    res.send('Welcome! Please use /api');
});


//get all the devices

app.get('/api/devices', (req, res) => {
    Device.getDevices((err, devices) => {
        if(err){
            throw err;
        }

        res.json(devices);
    });
});

//add new device

app.post('/api/devices', (req, res) => {
    var device = req.body;

    //validating the risk is in the range of 0-100

    if((parseInt(device.risk) < 0) || (parseInt(device.risk) > 100)){
        res.send({message: "The risk value should be 0-100"})
        return;
    }

    //validating that there isn't a device with the same device id

    Device.getDevice(device.device_id, (err, deviceInDB) => {
        if(!(deviceInDB === null)){
            res.send({message: "There is already a device with this id" })
            return;
        }
        Device.addDevice(device, (err, device) => {
            if(err || !device){
                throw err;
            }

            res.json(device);
        });
    })
});


//get device by id

app.get('/api/devices/:device_id', (req, res) => {
    Device.getDevice(req.params.device_id, (err, device) => {
        if(device === null){
            return res.status(404).send({
                message: "Device not found with id " + req.params.device_id
            });
        }

        res.json(device);
    });
});

//update a device

app.put('/api/devices/:device_id', (req, res) => {
    var device_id = req.params.device_id;
    var device = {device_id: device_id, risk: req.body.risk}

    //validating the risk is in the range of 0-100

    if((parseInt(device.risk) < 0) || (parseInt(device.risk) > 100)){
        res.send({message: "The risk value should be 0-100"})
        return;
    }

    //validating that there isn't a device with the same device id

    Device.getDevice(device.device_id, (err, deviceInDB) => {
        if((deviceInDB === null)){
            res.send({message: "There isn't a device with this id" })
            return;
        }
        Device.updateDevice(device_id, device, {}, (err, device) => {
            if(err || !device){
                throw err;
            }

            res.json(device);
        });
    })
});

app.delete('/api/devices/:device_id', (req, res) => {
    var device_id = req.params.device_id;


    //validating that there is a device with this device id

    Device.getDevice(device_id, (err, deviceInDB) => {
        if((deviceInDB === null)){
            res.send({message: "There isn't a device with this id" })
            return;
        }
        Device.removeDevice(device_id, (err) => {
            if(err){
                throw err;
            }

            res.send({message: "device has been successfully deleted"})
        });
    })
});

//get devices with a given risk

app.get('/api/devices/risk/:risk', (req, res) => {
    Device.getDeviceByRisk(req.params.risk, (err, devices) => {
        if(devices === null){
            return res.status(404).send({
                message: "Device not found with risk " + req.params.risk
            });
        }

        res.json(devices);
    });
});

//get histogram of risks

app.get('/api/risks', (req, res) => {
    Device.getDevices((err, devices) => {
        if(err){
            throw err;
        }
        else{
            var h_Risks = new Array(101).fill(0);
            devices.forEach((element) => {
                var risk = element.risk;
                h_Risks[risk]++;
            });
            var result = "";
            for(i = 0; i < h_Risks.length; i++){
                result += "risk " + i + ":" + h_Risks[i] + " ";
            }
        }

        res.json(h_Risks);
    });
});

app.listen(3000, function(){
    console.log('Listening on port',this.address().port);
});







