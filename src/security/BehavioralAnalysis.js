/*src/security/BehavioralAnalysis.js
export class UserBehaviorTracker {
    constructor() {
      this.userPatterns = new Map();
      this.anomalyThreshold = 0.7;
    }
    
    recordActivity(userId, activity) {
      if (!this.userPatterns.has(userId)) {
        this.userPatterns.set(userId, {
          loginTimes: [],
          locationData: [],
          deviceInfo: [],
          behaviors: []
        });
      }
      
      const userProfile = this.userPatterns.get(userId);
      
      switch (activity.type) {
        case 'login':
          userProfile.loginTimes.push({
            timestamp: activity.timestamp,
            dayOfWeek: activity.timestamp.getDay(),
            hourOfDay: activity.timestamp.getHours()
          });
          break;
        
        case 'location':
          userProfile.locationData.push({
            latitude: activity.latitude,
            longitude: activity.longitude,
            timestamp: activity.timestamp
          });
          break;
        
        case 'device':
          userProfile.deviceInfo.push({
            userAgent: activity.userAgent,
            screenSize: activity.screenSize,
            timestamp: activity.timestamp
          });
          break;
        
        case 'behavior':
          userProfile.behaviors.push({
            action: activity.action,
            target: activity.target,
            timestamp: activity.timestamp
          });
          break;
      }
      
      // Limit stored history to prevent memory issues
      this.truncateHistory(userProfile);
    }
    
    truncateHistory(userProfile) {
      const MAX_ITEMS = 100;
      
      if (userProfile.loginTimes.length > MAX_ITEMS) {
        userProfile.loginTimes = userProfile.loginTimes.slice(-MAX_ITEMS);
      }
      
      if (userProfile.locationData.length > MAX_ITEMS) {
        userProfile.locationData = userProfile.locationData.slice(-MAX_ITEMS);
      }
      
      if (userProfile.deviceInfo.length > MAX_ITEMS) {
        userProfile.deviceInfo = userProfile.deviceInfo.slice(-MAX_ITEMS);
      }
      
      if (userProfile.behaviors.length > MAX_ITEMS * 2) {
        userProfile.behaviors = userProfile.behaviors.slice(-MAX_ITEMS * 2);
      }
    }
    
    detectAnomalies(userId, currentActivity) {
      if (!this.userPatterns.has(userId)) {
        // Not enough data to detect anomalies
        return { score: 0, anomalies: [] };
      }
      
      const userProfile = this.userPatterns.get(userId);
      const anomalies = [];
      
      // Check time pattern anomalies
      if (currentActivity.type === 'login' && userProfile.loginTimes.length >= 5) {
        const timeAnomaly = this.checkTimePatternAnomaly(
          userProfile.loginTimes, 
          {
            dayOfWeek: currentActivity.timestamp.getDay(),
            hourOfDay: currentActivity.timestamp.getHours()
          }
        );
        
        if (timeAnomaly > this.anomalyThreshold) {
          anomalies.push({
            type: 'unusual_login_time',
            score: timeAnomaly,
            detail: 'Login occurred at an unusual time'
          });
        }
      }
      
      // Check location anomalies
      if (currentActivity.type === 'location' && userProfile.locationData.length >= 3) {
        const locationAnomaly = this.checkLocationAnomaly(
          userProfile.locationData,
          {
            latitude: currentActivity.latitude,
            longitude: currentActivity.longitude
          }
        );
        
        if (locationAnomaly > this.anomalyThreshold) {
          anomalies.push({
            type: 'unusual_location',
            score: locationAnomaly,
            detail: 'Access from unusual location'
          });
        }
      }
      
      // Calculate overall anomaly score
      const overallScore = anomalies.length > 0
        ? anomalies.reduce((sum, a) => sum + a.score, 0) / anomalies.length
        : 0;
        
      return {
        score: overallScore,
        anomalies
      };
    }
    
    checkTimePatternAnomaly(loginHistory, currentLogin) {
      // Count occurrences of this day/hour combination
      const matches = loginHistory.filter(login => 
        login.dayOfWeek === currentLogin.dayOfWeek && 
        Math.abs(login.hourOfDay - currentLogin.hourOfDay) <= 2
      );
      
      const matchRatio = matches.length / loginHistory.length;
      return 1 - matchRatio; // Higher score = more anomalous
    }
    
    checkLocationAnomaly(locationHistory, currentLocation) {
      // Simple distance-based anomaly detection
      // In a real system, you might use more sophisticated geospatial algorithms
      
      // Calculate distances from current to all previous locations
      const distances = locationHistory.map(loc => 
        this.calculateDistance(
          loc.latitude, loc.longitude,
          currentLocation.latitude, currentLocation.longitude
        )
      );
      
      // Find minimum distance to any previous location
      const minDistance = Math.min(...distances);
      
      // Scale to 0-1 range (0 = same location, 1 = very far)

*/
