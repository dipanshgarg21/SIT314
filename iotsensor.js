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

// Updated sensordata format
const sensordata = {
  id: 0,
  name: "temperaturesensor",
  address: "221 Burwood Hwy, Burwood VIC 3125",
  data: [
    {
      time: Date.now(),
      temperature: 20.00
    }
  ]
}

console.log(JSON.stringify(sensordata));

// Push data for Plotly

parser.on('data', data => {
  
  // Update sensordata with new temperature value
  sensordata.data.push({
    time: Date.now(),
    temperature: parseFloat(data)
  });
  
  console.log(sensordata.data[sensordata.data.length - 1].temperature);
  
  plotlyData.x.push((new Date()).toISOString());
  plotlyData.y.push(sensordata.data[sensordata.data.length - 1].temperature);
  
  const graphOptions = {
    filename: "iot-performance",
    fileopt: "overwrite"
  };
  plotly.plot(plotlyData, graphOptions, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
  });

// Update existing sensor document in MongoDB or create a new one if it doesn't exist
Sensor.findOneAndUpdate(
    { id: sensordata.id },
    { $push: { data: sensordata.data[sensordata.data.length - 1] } },
    { new: true, upsert: true }
)
.then(doc => {
    console.log(doc);
})
.catch(error => {
    console.error(error);
});
})
}
