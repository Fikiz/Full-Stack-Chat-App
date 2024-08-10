import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword,signOut } from 'firebase/auth';
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore"; // Import 'doc'

import { toast } from 'react-toastify';

const firebaseConfig = {
  apiKey: "AIzaSyCj3b7goCAT6sI6KMxt1oJ7Ac21Yvh1LS4",
  authDomain: "chat-app-gs-352bb.firebaseapp.com",
  projectId: "chat-app-gs-352bb",
  storageBucket: "chat-app-gs-352bb.appspot.com",
  messagingSenderId: "682692854149",
  appId: "1:682692854149:web:67533475995657ada204ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// signup logic
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Correctly reference and create the user document
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: '',
      avatar: '',
      bio: 'Hey, buddy',
      lastSeen: Date.now()
    });

    // Correctly reference and create the chat document
    await setDoc(doc(db, 'chats', user.uid), {
      chatsData: []
    });

    toast.success('User created successfully');
  } catch (error) {
    console.error("Error creating user or saving to Firestore:", error);
    toast.error(error.code.split('/')[1].split('-').join(' '))
  }
};

// login logic
const login = async (email, password) => {
  try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful');
  } catch (error) {
      console.error('Login Error:', error);
      toast.error(error.code.split('/')[1].split('-').join(' '));
  }
}

// logout logic
const logout = async() => {
   try {
    await signOut(auth)
   } catch (error) {
    console.error(error)
  
   }
}

const resetPass = async(email) => {
  if(!email) {
    toast.error('Enter your email')
    return null;
  }

  try {
    const userRef = collection(db,'users');
    const q = query(userRef,where('email','==',email))
    const querySnap = await getDocs(q);

    if(!querySnap.empty) {
      await sendPasswordResetEmail(auth,email);
      toast.success('Reset Email Sent')
    }
    else{
      toast.error('Email doesn`t exists')
    }
  } catch (error) {
    console.error(error)
    toast.error(error.message)
  }
}

export { signup,login,logout,auth,db,resetPass };
