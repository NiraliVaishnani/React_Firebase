import logo from './logo.svg';
import './App.css';

import { getDatabase, ref, push, set, onChildAdded } from "firebase/database";
import { auth } from 'firebase/auth';
import { useEffect, useState } from 'react';
//import { GoogleAuthProvider } from "firebase/auth";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";



function App() {
  const [user, setuser] = useState("");
  const [chats, setchats] = useState([])
  const [msg, setmsg] = useState("")
  const database = getDatabase();
  const db = getDatabase();
  const chatListRef = ref(db, 'chats');
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const googleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        console.log(`Access token`, token);
        // The signed-in user info.
        const user = result.user;
        console.log({ name: result.user.displayName, email: result.user.email })
        setuser({ name: result.user.displayName, email: result.user.email });
        console.log(`User info`, user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

  }

  useEffect(() => {
    onChildAdded(chatListRef, (data) => {
      console.log("MESSAGES")
      //   console.log(data.val());
      console.log("QWE", chats, data.val(), chats.length)
      setchats([...chats, data.val()]);
      updateHeight();
    }, 100);
  }, [setchats])

  const updateHeight = () => {
    // console.log("{{{{{{{{{");
    const el = document.getElementById('chat');

    // el.scrollTop = el.scrollHeight;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
    else {
      // console.log("9999999")
    }
  }
  const handleMessage = () => {
    console.log("Message")
    // Create a new post reference with an auto-generated id
    const chatRef = push(chatListRef);
    set(chatRef, {
      user, message: msg
    });
    setmsg('');
  }
  console.log("chatlist", chats)
  return (
    <>

      {user ? null : (<><button onClick={googleLogin}>Google SignIn</button></>)}
      {user.email ? (<div> <h1>User:{user.name}</h1>
        <div id="chat">
          {chats.map((c, index) => (
            <div key={index} className={`container ${c.user.email === user.email ? 'me' : " "}`}>
              <p className={`chatbox ${c.user.email === user.email ? 'me' : " "}`}>
                <strong>{c.user.name}</strong>
                <span>{c.message}</span>
              </p>
            </div>
          ))}  </div>
        <div className="btm-chatbox">
          <input type="text" value={msg} placeholder="Enter your chat" onChange={(e) => setmsg(e.target.value)} style={{ flexGrow: 1, padding: "20px" }}></input>
          <button type="button" style={{ backgroundColor: "cadetblue" }} onClick={handleMessage}>Send</button>
        </div></div>) : null}

    </>
  );
}

export default App;
