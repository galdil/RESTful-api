const mongoose = require('mongoose');

var genreSchema = mongoose.Schema({
    device_id: {
        type: String,
        required: true
    },
    risk: {
        type: Number,
        required: true
    },
});

var Device = module.exports = mongoose.model('Device', genreSchema );

//get devices
module.exports.getDevices = (callback) => {
    Device.find(callback);
}

//get device by id

module.exports.getDevice = (device_id, callback) => {
    Device.find({ device_id }, function(err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        if (results.length === 0) {
            callback(null, null);
        } else {
            callback(null, results[0]);
        }
    });
}

//get device by risk

module.exports.getDeviceByRisk = (risk, callback) => {
    Device.find({ risk }, function(err, results) {
        if (err) {
            callback(err, null);
            return;
        }
        if (results.length === 0) {
            callback(null, null);
        } else {
            callback(null, results);
        }
    });
}


//update device
module.exports.updateDevice = (device_id, device, options, callback) => {
    var query = {device_id : device_id};
    var update = {
        risk: device.risk
    }

    Device.findOneAndUpdate(query, update, options, callback);
}

//add device
module.exports.addDevice = (device, callback) => {
    Device.create(device, callback);
}

//delete device
module.exports.removeDevice = (device_id, callback) => {
    var query = {device_id : device_id};
    Device.remove(query, callback);

}

