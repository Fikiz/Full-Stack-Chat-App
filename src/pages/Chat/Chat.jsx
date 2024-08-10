import React, { useContext, useEffect,useState } from 'react'
import './Chat.css'
import LeftSideBar from '../../components/Left-Side-Bar/LeftSideBar'
import RightSideBar from '../../components/Right-Side-Bar/RightSideBar'
import ChatBox from '../../components/Chat-box/ChatBox'
import { AppContext } from '../../context/AppContext'

const Chat = () => {

  const {chatData,userData} = useContext(AppContext)
  const [loading,SetLoading] = useState(true)

  useEffect(() => {
    if(chatData,userData) {
      SetLoading(false)
    }
  },[chatData,userData])

  return (
    <div className='chat'>
      {
        loading 
        ? <p className='loading'>Loading...</p>
        : <div className="chat-container">
            <LeftSideBar />
            <ChatBox />
            <RightSideBar />
          </div>
      }
      
    </div>
  )
}

export default Chat