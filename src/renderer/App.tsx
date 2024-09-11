/* eslint-disable jsx-a11y/media-has-caption */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { DataConnection, Peer } from 'peerjs';
import './App.css';
import { useEffect, useRef, useState } from 'react';
const upObj = {
  direction: 0,
  velocity: 100,
};
const downObj = {
  direction: 180,
  velocity: 100,
};
const leftObj = {
  direction: 270,
  velocity: 100,
};
const rightObj = {
  direction: 90,
  velocity: 100,
};
function Hello() {
  const [peerId, setPeerId] = useState('');
  const peerRef = useRef(new Peer());
  const connectionRef = useRef<DataConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  function connect() {
    connectionRef.current = peerRef.current.connect(peerId);
  }
  function call() {
    if (!localStreamRef.current) return;
    const call = peerRef.current.call(peerId, localStreamRef.current);
    call.on('stream', (remoteStream) => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = remoteStream;
    });
  }
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        localStreamRef.current = stream;
      })
      .catch((err) => {
        console.error(err);
      });
    peerRef.current.on('connection', (conn) => {
      connectionRef.current = conn;
      conn.on('data', (data) => {
        console.log(data);
      });
    });
    window.onkeydown = (e) => {
      if (!connectionRef.current) return;
      switch (e.key) {
        case 'ArrowUp':
          connectionRef.current.send(JSON.stringify(upObj));
          break;
        case 'ArrowDown':
          connectionRef.current.send(JSON.stringify(downObj));
          break;
        case 'ArrowLeft':
          connectionRef.current.send(JSON.stringify(leftObj));
          break;
        case 'ArrowRight':
          connectionRef.current.send(JSON.stringify(rightObj));
          break;
        default:
          break;
      }
    };
  }, []);
  return (
    <div className="w-screen h-screen">
      <video className="w-screen h-screen" ref={videoRef} />
      <input
        className="fixed top-0"
        type="text"
        onChange={(e) => setPeerId(e.target.value as string)}
      />
      <button className=" fixed top-0 left-64" onClick={connect}>
        connect
      </button>
      <button className=" fixed top-0 left-96" onClick={call}>
        call
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
