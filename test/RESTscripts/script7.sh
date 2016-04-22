#!/bin/bash
# this test script should find a match, both rides start within 30 minutes of each other, this ride is within 15 minutes.
clear
echo "Testing Matching functionality"

# Remove any existing documents from the appropriate models
mongo test --eval "printjson(db.PostedTrips.remove({}))"
mongo test --eval "printjson(db.RideRequests.remove({}))"
mongo test --eval "printjson(db.Matches.remove({}))"

# Get the URL for the host we are running on
URL=$(./getURL.sh)
echo "$URL"

# Post a trip
echo "Posting a trip"
curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d '{"postedTrip":{  "driverId": "1",
  "startAddress": { "street": "123 Main St", "city": "San Diego", "state": "CA", "zip": "92173"},
  "startGeopoint": {
    "lat": 32.552591,
    "lng": -117.043562
  },
  "destAddress": {"street": "456 Ocean Blvd", "city": "Oceanside", "state": "CA", "zip": "92054"},
  "destGeopoint": {
    "lat": 33.183633,
    "lng": -117.369560
  },
  "startDate": "2016-04-08",
  "startTime": 1800000,
  "estEndTime": "10:00AM",
  "seatsAvailable": 1,
  "pickupRadius": 2,
  "isRoundTrip": false,
  "vehicleId": "1",
  "estSharedExpense": 10,
  "sameGender": true,
  "ageRange": "20-60",
  "likesDogs": true,
  "beenRated": false,
  "createDate": "2016-04-08",
  "state": "new"}}' $URL"PostedTrips/postAndSearch"

# Request a ride
echo "Request a ride"
curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d '{"requestedRide":{
  "riderId": "2",
  "startAddress": { "street": "1326 Otono St", "city": "San Diego", "state": "CA", "zip": "92154"},
  "startGeopoint": {
    "lat": 32.572802,
    "lng": -117.052205
  },
  "destAddress": {"street": "456 Ocean Blvd", "city": "Oceanside", "state": "CA", "zip": "92054"},
  "destGeopoint": {
    "lat": 33.183633,
    "lng": -117.369560
  },
  "startDate": "2016-04-08",
  "startTime": 1800100,
  "seatsRequired": 1,
  "needRoundTrip": true,
  "sameGender": true,
  "ageRange": "18-70",
  "likesDogs": true,
  "bike": true,
  "wheelchair": true,
  "beenRated": false,
  "state": "new",
  "createDate": "2016-04-08"
}}' $URL"RideRequests/requestRideAndSearch"

# Get Matched trips
echo "Get the matched trip"
curl -i -H "Accept: application/json" $URL"Matches" > temp
# Verify that 'tripId', 'rideId', and 'state' are what we expect
awk -F\" '/date:/{print $(NF-1)}' temp >> results

scriptName="script7"

grep -F "matched" "temp" &> /dev/null
if [ $? = 0 ]; then
   echo "$scriptName" : " Success" >> results
else 
   echo "$scriptName" : " Failure" >> results
fi