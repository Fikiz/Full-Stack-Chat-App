import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'
import upload from '../../lib/upload'

const ChatBox = () => {

  const { userData, messageId, chatUser, messages, setMessages,chatVisible,setChatVisible } = useContext(AppContext)



  const [input, setInput] = useState('');
  const [showHelp, setShowHelp] = useState(false); // State for showing help component
  const sendMessage = async () => {
    try {
      if (input && messageId) {
        // Update messages in the 'messages' collection
        await updateDoc(doc(db, 'messages', messageId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        });

        // Update chatsData in both users' chat lists
        const userIds = [chatUser.rId, userData.id];
        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshop = await getDoc(userChatsRef);

          if (userChatsSnapshop.exists()) {
            const userChatData = userChatsSnapshop.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messageId);

            if (chatIndex !== -1) {
              userChatData.chatsData[chatIndex].lastMessage = input;
              userChatData.chatsData[chatIndex].updatedAt = Date.now();
              if (userChatData.chatsData[chatIndex].rId === userData.id) {
                userChatData.chatsData[chatIndex].messageSeen = false;
              }
              await updateDoc(userChatsRef, {
                chatsData: userChatData.chatsData
              });
            }
          }
        });

        setInput(''); // Clear input after sending
      }
    } catch (error) {
      toast(error.message);
    }

  };

  const sendImage = async (e) => {
    try {
      const fileUrl = await upload(e.target.files[0])

      if (fileUrl && messageId) {
        await updateDoc(doc(db, 'messages', messageId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileUrl,
            createdAt: new Date()
          })
        })
        const userIds = [chatUser.rId, userData.id];
        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id);
          const userChatsSnapshop = await getDoc(userChatsRef);

          if (userChatsSnapshop.exists()) {
            const userChatData = userChatsSnapshop.data();
            const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messageId);

            if (chatIndex !== -1) {
              userChatData.chatsData[chatIndex].lastMessage = 'Image';
              userChatData.chatsData[chatIndex].updatedAt = Date.now();
              if (userChatData.chatsData[chatIndex].rId === userData.id) {
                userChatData.chatsData[chatIndex].messageSeen = false;
              }
              await updateDoc(userChatsRef, {
                chatsData: userChatData.chatsData
              });
            }
          }
        });


      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const convertTimestamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    if (hour > 12) {
      return hour - 12 + ':' + minutes + 'PM'
    }
    else {
      return hour + ':' + minutes + 'AM'
    }
  }

  useEffect(() => {
    if (messageId) {
      const unSub = onSnapshot(doc(db, 'messages', messageId), (res) => {
        setMessages(res.data().messages.reverse())
        console.log(res.data().messages.reverse());

      })
      return () => {
        unSub();
      }
    }
  }, [messageId])

  return chatUser ? (
    <div className={`chat-box ${chatVisible? '' : 'hidden'}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p> {chatUser.userData.name}
           {Date.now() - chatUser.userData.lastSeen <= 70000 ? <img className='dot' src={assets.green_dot} alt="" /> : null}
        </p>

        <img onClick={() => setChatVisible} className='help' src={assets.help_icon} alt="" />
        <img onClick={() => setChatVisible(false)} src={assets.arrow_icon} className='arrow' alt="" />
      </div>

      <div className="chat-msg">

        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? 's-msg' : 'r-msg'}>
             {msg["image"]
              ? <img className='msg-img' src={msg.image} alt="" />
              : <p className='msg'>{msg.text}</p>
            } 
            
            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{convertTimestamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}



      </div>

      <div className="chat-input">
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Send a message' />
        <input onChange={sendImage} type="file" id='image' accept='image/png, image.jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  )
    : <div className={`chat-welcome ${chatVisible? '' : 'hidden'}`}>
      <img src={assets.fk} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
}

export default ChatBox