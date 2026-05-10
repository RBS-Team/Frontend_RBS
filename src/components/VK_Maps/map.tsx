import mmrgl from 'mmr-gl';
import { useEffect } from 'react';

import 'mmr-gl/dist/mmr-gl.css';

export function MapComponent() {
    useEffect(() => {
        mmrgl.accessToken = '609dfba3ded70ca888edb0036acc2e94e12607e50d039a9b7a7d60f9abf23e15';

        const map = new mmrgl.Map({
            container: 'map',
            zoom: 8,
            center: [37.6165, 55.7505],
            style: 'mmr://api/styles/main_style.json',
            hash: true,
        });

        return () => {
            if (map) map.remove();
        };
    }, []);

    return <div  id="map" style={{ width: '100%' , height: '100%' , color:"dark" }} />;
}