# WebRTC-electron

A simple practice project using WebRTC video streaming with an Electron application and a Node.js signaling server.

This project demonstrates peer-to-peer video communication between two clients using SDP offers/answers and ICE candidates.

(*Note*: This project was completed as barebones practice for my internship, and may be unfinished/unpolished)
---

## Features

* Real-time video streaming via WebRTC
* Electron desktop app client
* Node.js signaling server using Socket.IO
* STUN server support (Google STUN)
* SDP offer/answer connection flow

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/jonahrudzki/WebRTC-electron.git
cd WebRTC-electron
```

---

### 2. Install dependencies

```bash
npm install
```

---

## Running the App

### Start Electron client

```bash
npm start
```

---

### Start signaling server

In a separate terminal:

```bash
node server.js
```

Then open:

```
http://localhost:8080
```

This acts as the second client.

---

## How to Connect

1. Open Electron app (Client A)
2. Open browser tab at [http://localhost:8080](http://localhost:8080) (Client B)
3. Click "Create SDP Offer"
4. Accept/handle the offer on the second client
5. Connection is established and video streams begin

---

## Notes

* Ensure camera permissions are enabled
* Both clients must be able to reach the signaling server
* WebRTC works on localhost without HTTPS, but production requires HTTPS
* If connection fails, refresh both clients and retry offer creation

---

## Tech Stack

* WebRTC
* Electron
* Node.js
* Socket.IO
* HTML / JavaScript
