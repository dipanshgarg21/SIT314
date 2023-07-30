// In this code, the the .csv file can also be generated
// when the arduino is connected to a dataLogger
// hence the parts where dataLogger was used is commented out

//#include <SD.h>

#define sensorPin A0
#define ledPin A1
#define motorPin 6

//const int chipSelect = 10; // Pin 10 used for the SD card module

void setup()
{
  pinMode(ledPin, OUTPUT);
  pinMode(motorPin, OUTPUT);
  Serial.begin(9600);
  
/*    if (!SD.begin(chipSelect)) {;	//Only works if data logger available
    while (1);
  }


  File dataFile = SD.open("data.csv", FILE_WRITE);
  if (dataFile) {
    dataFile.println("Time,Moisture (%)");
    dataFile.close();
  }
*/
}

void loop()
{
	delay(10);							// Allow power to settle
	int val = analogRead(sensorPin);	// Read the analog value form sensor
    int moisturePercentage = map(val, 0, 1023, 0, 100);
    analogWrite(ledPin, map(val, 0, 1023, 255, 0));
 //   logData(moisturePercentage);
  	Serial.println(moisturePercentage);
      waterPlant(moisturePercentage);
}

/*
void logData(int moisturePercentage) {
  File dataFile = SD.open("data.csv", FILE_WRITE);
  if (dataFile) {
    unsigned long currentTime = millis();
    dataFile.print(currentTime);
    dataFile.print(",");
    dataFile.println(moisturePercentage);
    dataFile.close();
  }
}

*/

void waterPlant(int moistureVal) {
  if(moistureVal < 30){
    delay(100);
  	digitalWrite(motorPin, HIGH);
  	Serial.println("Motor ON");
  }
  else{
    delay(100);
    digitalWrite(motorPin, LOW);
    Serial.println("Motor OFF");
  }

}
