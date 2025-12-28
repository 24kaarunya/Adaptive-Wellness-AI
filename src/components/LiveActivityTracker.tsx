'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, MapPin, Footprints, Clock, TrendingUp, Navigation } from 'lucide-react';

interface LiveActivityTrackerProps {
  activityType: string;
  onComplete: (data: {
    duration: number;
    steps: number;
    distance: number;
    calories: number;
    route: Array<{ lat: number; lng: number; timestamp: number }>;
  }) => void;
  onCancel: () => void;
}

export default function LiveActivityTracker({ activityType, onComplete, onCancel }: LiveActivityTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [calories, setCalories] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [route, setRoute] = useState<Array<{ lat: number; lng: number; timestamp: number }>>([]);
  const [lastPosition, setLastPosition] = useState<GeolocationPosition | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const stepCounterRef = useRef(0);
  const stepSimulationRef = useRef<NodeJS.Timeout | null>(null);
  const accelerationRef = useRef({ x: 0, y: 0, z: 0 });
  const lastStepTime = useRef(Date.now());

  useEffect(() => {
    requestPermissions();
    return () => {
      stopTracking();
    };
  }, []);

  const requestPermissions = async () => {
    try {
      // Request location permission
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setPermissionGranted(permission.state === 'granted' || permission.state === 'prompt');
      
      // Request motion sensor permission (for iOS 13+)
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        const motionPermission = await (DeviceMotionEvent as any).requestPermission();
        console.log('Motion permission:', motionPermission);
      }
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const startTracking = () => {
    setIsTracking(true);
    setIsPaused(false);

    // Start timer
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    // Start GPS tracking
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newPoint = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: Date.now(),
          };
          
          setRoute(prev => [...prev, newPoint]);
          
          // Calculate distance if we have a previous position
          if (lastPosition) {
            const dist = calculateDistance(
              lastPosition.coords.latitude,
              lastPosition.coords.longitude,
              position.coords.latitude,
              position.coords.longitude
            );
            setDistance(prev => prev + dist);
            
            // Calculate speed (m/s)
            const timeDiff = (Date.now() - (lastPosition.timestamp || 0)) / 1000;
            if (timeDiff > 0) {
              const speed = (dist / timeDiff) * 3.6; // Convert to km/h
              setCurrentSpeed(speed);
              
              // Update steps based on actual movement
              if (speed > 0.5) { // Moving at least 0.5 km/h
                const stepsFromSpeed = Math.floor(dist / 0.75); // ~0.75m per step
                if (stepsFromSpeed > 0) {
                  stepCounterRef.current += stepsFromSpeed;
                  setSteps(stepCounterRef.current);
                  calculateCalories(stepCounterRef.current);
                }
              }
            }
          }
          
          setLastPosition(position);
        },
        (error) => {
          console.error('GPS error:', error);
          // Continue with simulation even if GPS fails
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }

    // Try to use device motion sensors if available
    if (window.DeviceMotionEvent) {
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        (DeviceMotionEvent as any).requestPermission()
          .then((permission: string) => {
            if (permission === 'granted') {
              window.addEventListener('devicemotion', handleDeviceMotion);
            }
          })
          .catch((error: any) => console.log('Motion permission denied:', error));
      } else {
        window.addEventListener('devicemotion', handleDeviceMotion);
      }
    }
  };

  const handleDeviceMotion = (event: DeviceMotionEvent) => {
    if (!isTracking || isPaused) return;

    const acceleration = event.accelerationIncludingGravity;
    if (acceleration && acceleration.x !== null && acceleration.y !== null && acceleration.z !== null) {
      const magnitude = Math.sqrt(
        Math.pow(acceleration.x - accelerationRef.current.x, 2) +
        Math.pow(acceleration.y - accelerationRef.current.y, 2) +
        Math.pow(acceleration.z - accelerationRef.current.z, 2)
      );

      // Detect step (threshold-based) - sensitive threshold for walking
      const now = Date.now();
      if (magnitude > 0.8 && now - lastStepTime.current > 250) { // At least 250ms between steps
        stepCounterRef.current++;
        setSteps(stepCounterRef.current);
        calculateCalories(stepCounterRef.current);
        lastStepTime.current = now;
        console.log('Step detected via motion sensor:', stepCounterRef.current);
      }

      accelerationRef.current = {
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z,
      };
    }
  };

  const startStepSimulation = () => {
    // Automatically count steps based on activity type
    const stepsPerMinute = activityType === 'Running' ? 160 : activityType === 'Cycling' ? 100 : 120; // Walking default
    const stepInterval = (60 * 1000) / stepsPerMinute; // ms per step
    const metersPerStep = activityType === 'Running' ? 1.0 : activityType === 'Cycling' ? 5.0 : 0.75;
    
    stepSimulationRef.current = setInterval(() => {
      if (!isPaused) {
        stepCounterRef.current++;
        setSteps(stepCounterRef.current);
        calculateCalories(stepCounterRef.current);
        
        // Also update distance
        setDistance(prev => prev + metersPerStep);
      }
    }, stepInterval);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const calculateCalories = (stepCount: number) => {
    // Rough calorie calculation: ~0.04-0.05 calories per step
    const caloriesPerStep = activityType === 'Running' ? 0.05 : 0.04;
    setCalories(Math.round(stepCount * caloriesPerStep));
  };

  const addManualStep = () => {
    if (isTracking && !isPaused) {
      stepCounterRef.current++;
      setSteps(stepCounterRef.current);
      calculateCalories(stepCounterRef.current);
      // Also update distance
      const metersPerStep = activityType === 'Running' ? 1.0 : 0.75;
      setDistance(prev => prev + metersPerStep);
    }
  };

  const pauseTracking = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resumeTracking = () => {
    setIsPaused(false);
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    window.removeEventListener('devicemotion', handleDeviceMotion);
  };

  const handleComplete = () => {
    stopTracking();
    onComplete({
      duration,
      steps,
      distance,
      calories,
      route,
    });
  };

  const handleCancel = () => {
    stopTracking();
    onCancel();
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters.toFixed(0)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
  };

  return (
    <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl shadow-2xl p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Live {activityType}</h2>
        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
          <div className={`w-2 h-2 rounded-full ${isTracking && !isPaused ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm">{isTracking && !isPaused ? 'Tracking' : isPaused ? 'Paused' : 'Ready'}</span>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Duration */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm opacity-80">Duration</span>
          </div>
          <p className="text-3xl font-bold">{formatDuration(duration)}</p>
        </div>

        {/* Steps */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Footprints className="w-5 h-5" />
            <span className="text-sm opacity-80">Steps</span>
          </div>
          <p className="text-3xl font-bold">{steps.toLocaleString()}</p>
        </div>

        {/* Distance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5" />
            <span className="text-sm opacity-80">Distance</span>
          </div>
          <p className="text-3xl font-bold">{formatDistance(distance)}</p>
        </div>

        {/* Calories */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm opacity-80">Calories</span>
          </div>
          <p className="text-3xl font-bold">{calories}</p>
        </div>
      </div>

      {/* Current Speed */}
      {currentSpeed > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              <span className="text-sm opacity-80">Current Speed</span>
            </div>
            <p className="text-2xl font-bold">{currentSpeed.toFixed(1)} km/h</p>
          </div>
        </div>
      )}

      {/* Permission Notice */}
      {!permissionGranted && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 mb-6">
          <p className="text-sm">
            📍 Location permission needed for accurate tracking. Please allow location access when prompted.
          </p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3">
        {!isTracking ? (
          <button
            onClick={startTracking}
            className="flex-1 bg-white text-primary-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <Play className="w-5 h-5" />
            Start Tracking
          </button>
        ) : (
          <>
            {!isPaused ? (
              <button
                onClick={pauseTracking}
                className="flex-1 bg-white/20 backdrop-blur-sm font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/30 transition"
              >
                <Pause className="w-5 h-5" />
                Pause
              </button>
            ) : (
              <button
                onClick={resumeTracking}
                className="flex-1 bg-white text-primary-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition"
              >
                <Play className="w-5 h-5" />
                Resume
              </button>
            )}
            <button
              onClick={handleComplete}
              className="flex-1 bg-green-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition"
            >
              <Square className="w-5 h-5" />
              Finish
            </button>
          </>
        )}
        <button
          onClick={handleCancel}
          className="bg-red-500/20 backdrop-blur-sm font-bold py-4 px-6 rounded-xl hover:bg-red-500/30 transition"
        >
          Cancel
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 text-xs opacity-70">
        <p>💡 Keep your phone with you for accurate step counting</p>
        <p>💡 GPS works best outdoors with clear sky view</p>
      </div>
    </div>
  );
}
