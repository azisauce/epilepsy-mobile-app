import { firebaseFirestore } from './config';

export const initializeCollections = async () => {
  try {
    // Create a sample course
    await firebaseFirestore().collection('courses').add({
      title: 'Sample Course',
      description: 'This is a sample course',
      content: 'Course content goes here...',
      createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
    });

    console.log('Collections initialized successfully');
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
};