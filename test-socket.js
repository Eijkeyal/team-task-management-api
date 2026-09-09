import { io } from "socket.io-client";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhOWQzNGZmZTIwMjMzNWY0NGZmMmVlZCIsImVtYWlsIjoiYWRtaW5AdGFza21hbmFnZXIuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzg4NzIxMDM3LCJleHAiOjE3ODg3MjE5Mzd9.q_8QvVvK2vCg895izOFLRv1VaJ5TDfZRadDXn0x9nlE";

const socket = io("http://localhost:3000", {
  auth: {
    token,
  },
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Socket connection error:", error.message);
});

socket.on("taskAssigned", (data) => {
  console.log("Task assigned notification:");
  console.log(data);
});

socket.on("taskStatusChanged", (data) => {
  console.log("Task status changed notification:");
  console.log(data);
});
