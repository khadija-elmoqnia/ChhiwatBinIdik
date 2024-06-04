import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig'; // Assurez-vous d'importer correctement votre config Firebase

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        console.log('Fetching analytics data...');
        const querySnapshot = await getDocs(collection(firestore, 'analytics'));
        const data = querySnapshot.docs.map(doc => doc.data());
        console.log('Fetched data:', data);
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>
      <ul>
        {analyticsData.map((entry, index) => (
          <li key={index}>
            <p>Event: {entry.event}</p>
            <p>Page Path: {entry.page_path}</p>
            <p>Timestamp: {entry.timestamp.toDate().toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalyticsDashboard;
