/* eslint-disable */

import axios from 'axios'

const emitEventHandler = async(event:string,data:any,socketId?:string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`;
    console.log(`Attempting to emit ${event} to ${url}`);
    await axios.post(url, {event, data, socketId});
    console.log("Emit successful");
    // await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`,{event,data,socketId})
  } catch (error : any) {
    // console.log(error)
    console.error("Socket Notification Failed:", error.response?.data || error.message);
  }
}

export default emitEventHandler