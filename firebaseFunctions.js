// firebaseFunctions.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from './fireBase';  // Firebase config dosyanız doğru import edilmelidir

export const saveUserProfile = async (userId, name, description, skills) => {
    try {
        const userRef = doc(db, 'users', userId);  // 'users' koleksiyonuna userId ile veriyi ekliyoruz
        await setDoc(userRef, {
            name: name,
            description: description,
            skills: skills,
        });
        console.log('Profile saved successfully');
    } catch (error) {
        console.error('Error saving profile:', error);
    }
};
