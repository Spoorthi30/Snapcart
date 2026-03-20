/* eslint-disable */

'use client'

import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
})

export default function MapClient({
  position,
  setPosition,
}: {
  position: [number, number]
  setPosition: (pos: [number, number]) => void
}) {
  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={position}
        icon={markerIcon}
        draggable
        eventHandlers={{
          dragend: (e: any) => {
            const { lat, lng } = e.target.getLatLng()
            setPosition([lat, lng])
          },
        }}
      />
    </MapContainer>
  )
}
