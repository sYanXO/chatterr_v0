import { useEffect, useRef, useState } from "react"


function App() {
  const [messages,setMessages] = useState(["hi there","hi there to you too"]);
  const wsRef = useRef();
  useEffect(()=>{
    const ws = new WebSocket("http://localhost:8080");
    ws.onmessage = (event)=>{
      setMessages(m=>[...m, event.data])
    }
    wsRef.current=ws;
    ws.onopen = () =>{
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId : "red"
        }
      }))
    }
    return ()=> { // added clean up alternative for React stric mode
      ws.close();
    }
  },[])

  return (
    <div className="h-screen bg-black">
      <br /> <br /> <br />
      <div className="h-[85vh]">
        {messages.map(message => 
          <div className="m-8">
            <span className="bg-white text-black rounded p-4 m-8">{message}</span>
          </div>)}
      </div>
        <div className="w-full bg-white flex">
          <input id="message" className="flex-1 p-4" placeholder="Type your message"></input>
          <button onClick={()=>{
            const message = document.getElementById("message")?.value
            wsRef.current.send(JSON.stringify({
              type : "chat",
              payload : {
                message : message
              }
            }))
          }} className="bg-purple-600">
            Send
          </button>
        </div>
    </div>
  )
}

export default App
