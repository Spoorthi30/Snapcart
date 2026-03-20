/* eslint-disable */


import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet"
import { ILocation } from "./DeliveryBoy"
import L, { LatLngExpression } from "leaflet"
import 'leaflet/dist/leaflet.css'
import { useEffect } from "react"

interface IProps{
  userLocation : ILocation
  deliveryBoyLocation : ILocation
}

function ReCenter({positions}:{positions : [number,number]}){
  const map = useMap()
  useEffect(()=>{
    if(positions[0]!==0 && positions[1]!==0){
      map.setView(positions,map.getZoom(),{
        animate:true
      })
    }
  },[positions,map])
  return null
}

const LiveMap = ({userLocation,deliveryBoyLocation}:IProps) => {

  const deliveryBoyIcon = L.icon({
    iconUrl : "https://cdn-icons-png.flaticon.com/128/9561/9561839.png",
    iconSize : [45,45]
  })

  const userIcon = L.icon({
    iconUrl : "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize : [45,45]
  })

  const center =[userLocation.latitude,userLocation.longitude]

  const linePosition = 
    deliveryBoyLocation && userLocation 
    ? [
      [userLocation.latitude,userLocation.longitude],
      [deliveryBoyLocation.latitude,deliveryBoyLocation.longitude]
    ]
    : []


  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow relative z-2">
      <MapContainer center={center as LatLngExpression} zoom={13} scrollWheelZoom className="h-full w-full">
        <ReCenter positions={center as any}/>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[userLocation.latitude,userLocation.longitude]} icon={userIcon}>
              <Popup>Delivery Address</Popup>
            </Marker>

            {deliveryBoyLocation && <Marker position={[deliveryBoyLocation.latitude,deliveryBoyLocation.longitude]} icon={deliveryBoyIcon}>
              <Popup>Delivery Boy</Popup>
            </Marker>}

            <Polyline positions={linePosition as any} color="green"/>

          </MapContainer>
    </div>
  )
}

export default LiveMap