"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ events }) {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden">
      <MapContainer
        center={[0.0236, 37.9062]} // Kenya default
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {events.map((event) => (
          <Marker key={event.id} position={[event.lat, event.lng]}>
            <Popup>
              <strong>{event.title}</strong>
              <br />
              {event.location}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}