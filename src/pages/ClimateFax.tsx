import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileNav } from "@/components/MobileNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Copyright from '@/components/Copyright';

// Define the type for the location data
interface LocationData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
}

// Define the type for the climate risk data
interface ClimateRiskData {
  location: string;
  wildfireRisk: string;
  seaLevelRise: string;
  extremeWeather: string;
}

// Default location if geolocation fails
const DEFAULT_LATITUDE = 34.0522; // Example: Los Angeles latitude
const DEFAULT_LONGITUDE = -118.2437; // Example: Los Angeles longitude

const ClimateFaxApp = () => {
  const [locationData, setLocationData] = useState<LocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
  });
  const [address, setAddress] = useState<string>("");
  const [climateRisk, setClimateRisk] = useState<ClimateRiskData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to handle geolocation success
  const handleGeolocationSuccess = useCallback((position: GeolocationPosition) => {
    setLocationData({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      error: null,
    });
  }, []);

  // Function to handle geolocation error
  const handleGeolocationError = useCallback((error: GeolocationPositionError) => {
    setLocationData({
      latitude: null,
      longitude: null,
      accuracy: null,
      error: error.message,
    });
  }, []);

  // Function to get the user's location
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError
      );
    } else {
      setLocationData({
        latitude: null,
        longitude: null,
        accuracy: null,
        error: "Geolocation is not supported by this browser.",
      });
    }
  }, [handleGeolocationError, handleGeolocationSuccess]);

  // Function to fetch climate risk data
  const fetchClimateRisk = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      // Simulate fetching data from an API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock climate risk data
      const mockClimateRisk: ClimateRiskData = {
        location: address || `Lat: ${latitude}, Lng: ${longitude}`,
        wildfireRisk: "High",
        seaLevelRise: "Moderate",
        extremeWeather: "Increasing",
      };

      setClimateRisk(mockClimateRisk);
    } catch (error) {
      console.error("Error fetching climate risk data:", error);
      setClimateRisk(null);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Function to handle address submission
  const handleAddressSubmit = useCallback(async () => {
    if (address) {
      // Geocode the address to get latitude and longitude
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json`;

      try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data && data.length > 0) {
          const latitude = parseFloat(data[0].lat);
          const longitude = parseFloat(data[0].lon);

          setLocationData({
            latitude,
            longitude,
            accuracy: null,
            error: null,
          });

          await fetchClimateRisk(latitude, longitude);
        } else {
          console.error("Unable to geocode address");
          setLocationData({
            latitude: null,
            longitude: null,
            accuracy: null,
            error: "Unable to geocode address",
          });
          setClimateRisk(null);
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
        setLocationData({
          latitude: null,
          longitude: null,
          accuracy: null,
          error: "Error geocoding address",
        });
        setClimateRisk(null);
      }
    }
  }, [address, fetchClimateRisk]);

  // useEffect to get user's location on component mount
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // useEffect to fetch climate risk data when location data is available
  useEffect(() => {
    if (locationData.latitude && locationData.longitude) {
      fetchClimateRisk(locationData.latitude, locationData.longitude);
    } else {
      // Use default location if geolocation fails
      fetchClimateRisk(DEFAULT_LATITUDE, DEFAULT_LONGITUDE);
    }
  }, [locationData, fetchClimateRisk]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="KNOW YOUR RISK" showBackButton={false}>
        <div className="flex flex-col items-center justify-center w-full">
          <div className="text-2xl font-bold relative">
            <span className="text-black">Climate</span>
            <span className="text-orange-500">FAX</span>
            <span className="absolute top-0 right-0 -mt-1 -mr-3 text-xs">
              ®
            </span>
          </div>
        </div>
      </MobileHeader>

      <main className="flex-1 overflow-auto p-4 pb-20">
        <Card className="mb-4 shadow-sm">
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Enter an address to assess climate risk, or use your current
              location:
            </p>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Button onClick={handleAddressSubmit}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Go
              </Button>
            </div>
            {locationData.error && (
              <p className="text-red-500 text-sm">{locationData.error}</p>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <Card className="shadow-sm">
            <CardContent>
              <p className="text-center text-gray-500">
                Loading climate risk data...
              </p>
            </CardContent>
          </Card>
        ) : climateRisk ? (
          <>
            <Card className="mb-4 shadow-sm">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">
                  Climate Risk Assessment for {climateRisk.location}
                </h3>
                <p className="text-sm text-gray-500">
                  Here's what you should know:
                </p>
              </CardContent>
            </Card>

            <Card className="mb-4 shadow-sm">
              <CardContent>
                <h4 className="text-md font-semibold mb-2">Wildfire Risk</h4>
                <p className="text-sm text-gray-500">
                  {climateRisk.wildfireRisk}
                </p>
              </CardContent>
            </Card>

            <Card className="mb-4 shadow-sm">
              <CardContent>
                <h4 className="text-md font-semibold mb-2">Sea Level Rise</h4>
                <p className="text-sm text-gray-500">
                  {climateRisk.seaLevelRise}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent>
                <h4 className="text-md font-semibold mb-2">Extreme Weather</h4>
                <p className="text-sm text-gray-500">
                  {climateRisk.extremeWeather}
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="shadow-sm">
            <CardContent>
              <p className="text-center text-gray-500">
                No climate risk data available for this location.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNav />
      <Copyright />
    </div>
  );
};

export default ClimateFaxApp;
