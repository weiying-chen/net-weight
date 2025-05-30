import { useState } from 'react';
import {
  APIProvider,
  Map as MapBase,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';
import { IconLoader2 } from '@tabler/icons-react';

type MapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string | number;
};

export function Map({ lat, lng, zoom = 15, height = 200 }: MapProps) {
  const [apiLoaded, setApiLoaded] = useState(false);
  const position = { lat, lng };

  return (
    <div
      className="relative w-full overflow-hidden rounded bg-subtle"
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {!apiLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-subtle">
          <IconLoader2 size={24} className="animate-spin text-muted" />
        </div>
      )}
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        onLoad={() => setApiLoaded(true)}
      >
        {apiLoaded && (
          <MapBase
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID!}
            defaultCenter={position}
            defaultZoom={zoom}
            controlSize={24}
            // style={{ width: '100%', height: '100%' }}
          >
            <AdvancedMarker position={position} />
          </MapBase>
        )}
      </APIProvider>
    </div>
  );
}
