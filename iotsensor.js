const mongoose = require('mongoose');
const Sensor = require('./models/sensor');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const COMMPORT = "COM4";
const plotly = require("plotly")("dipanshgarg_99", "9hwZn58Is74CHMYSkfoK");

const port = new SerialPort({path: `${COMMPORT}`,baudRate: 9600});
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
const uri = "mongodb://0.0.0.0:27017/localDatabase";

const plotlyData = {
  x: [],
  y: [],
  type: "scatter"
};

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    setInterval(sensortest, 10000);
  })
  .catch(error => {
    console.error("MongoDB connection error:", error);
  });

function sensortest(){


const sensordata = {
  id: 0,
  name: "temperaturesensor",
  address: "221 Burwood Hwy, Burwood VIC 3125",
  time: Date.now(),
  temperature: 20.00
}

console.log(JSON.stringify(sensordata));

// Push data for Plotly

parser.on('data', data => {
  sensordata.temperature = parseFloat(data);
  console.log(sensordata.temperature);
  
  plotlyData.x.push((new Date()).toISOString());
  plotlyData.y.push(sensordata.temperature);
  
  const graphOptions = {
    filename: "iot-performance",
    fileopt: "overwrite"
  };
  plotly.plot(plotlyData, graphOptions, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
  });

  const newSensor = new Sensor({
    id: sensordata.id,
    name: sensordata.name,
    address: sensordata.address,
    time: sensordata.time,
    temperature: sensordata.temperature
  });

  newSensor.save()
    .then(doc => {
      console.log(doc);
    })
    .catch(error => {
      console.error(error);
    });
  })
}