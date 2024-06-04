import { collection, addDoc } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';
import { firestore, analytics } from '../../config/firebaseConfig'; // Assurez-vous d'importer correctement votre config Firebase

const logPageView = async (pagePath) => {
  try {
    if (analytics) {
      logEvent(analytics, 'page_view', { page_path: pagePath });
      await addDoc(collection(firestore, 'analytics'), {
        event: 'page_view',
        page_path: pagePath,
        timestamp: new Date(),
      });
      console.log('Logged page_view event and saved to Firestore:', { page_path: pagePath });
    }
  } catch (error) {
    console.error('Error logging page view event:', error);
  }
};

export { logPageView };
