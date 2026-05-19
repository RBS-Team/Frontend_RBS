import mmrgl from 'mmr-gl';
import { useEffect, useRef, useState } from 'react';
import { Star, X, Navigation } from 'lucide-react'; // ДОБАВЛЕНО: иконка Navigation
import defaultAvatar from '../../static/imgs/avatarka.jpg';

interface Master {
    id: string;
    name: string;
    specialty: string;
    avatar_url: string;
    rating: number;
    reviews: number;
    location: string;
    priceFrom: number;
    lat: number;
    lon: number;
}

interface MapComponentProps {
    masters: Master[];
    onMasterSelect?: (master: Master) => void;
}

export function MapComponent({ masters, onMasterSelect }: MapComponentProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const userMarkerRef = useRef<any>(null); // ДОБАВЛЕНО: реф для маркера пользователя
    const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
    const [isLocating, setIsLocating] = useState(false); // ДОБАВЛЕНО: статус поиска

    const handleFindMe = () => {
        if (!navigator.geolocation) {
            alert('Геолокация не поддерживается вашим браузером');
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { longitude, latitude } = position.coords;

                if (!mapRef.current) return;
                mapRef.current.flyTo({
                    center: [longitude, latitude],
                    zoom: 14,
                    essential: true
                });
                if (userMarkerRef.current) {
                    userMarkerRef.current.remove();
                }
                const el = document.createElement('div');
                el.className = 'custom-marker user-navigation-marker-root';
                el.style.cursor = 'pointer';
                el.style.zIndex = '999';
                el.innerHTML = `
            <div class="marker-body" style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; position: relative;">
                
                <div style="position: absolute; width: 44px; height: 44px; background: rgba(244, 43, 255, 0.25); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
           
                <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0px 4px 6px rgba(255, 43, 244, 0.4)); animation: floatArrow 3s ease-in-out infinite;">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://w3.org">
                        <defs>
                            <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                 <stop offset="0%" stop-color="#ff66cc" />  
                                 <stop offset="100%" stop-color="#cc0066" />
                            </linearGradient>
                        </defs>
                        <path d="M12 2L2 22L12 18L22 22L12 2Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                        <path d="M12 3L3.5 20.5L12 17L20.5 20.5L12 3Z" fill="url(#arrowGrad)"/>
                    </svg>
                </div>
                
            </div>
        `;
                userMarkerRef.current = new mmrgl.Marker({ element: el, anchor: "center", offset: [0, 0] })
                    .setLngLat([longitude, latitude])
                    .addTo(mapRef.current);

                setIsLocating(false);
            },

            (error) => {
                setIsLocating(false);
                console.error('Ошибка геолокации:', error);
                if (error.code === 1) {
                    alert('Вы запретили доступ к геолокации в браузере.');
                } else {
                    alert('Не удалось определить местоположение.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleMarkerClick = (master: Master) => {
        setSelectedMaster(master);
        if (onMasterSelect) {
            onMasterSelect(master);
        }
    };

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mmrgl.accessToken = '609dfba3ded70ca888edb0036acc2e94e12607e50d039a9b7a7d60f9abf23e15';

        const map = new mmrgl.Map({
            container: mapContainerRef.current,
            zoom: 10,
            center: [0, 0],
            style: 'mmr://api/styles/main_style.json',
            hash: true,
        });

        mapRef.current = map;
        map.on('render', () => {
            map.triggerRepaint();
        });

        map.on('load', () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            const bounds = new mmrgl.LngLatBounds();
            let validMarkersCount = 0;

            masters.forEach((master) => {
                const rawLng = parseFloat(master.lon as any);
                const rawLat = parseFloat(master.lat as any);

                if (isNaN(rawLng) || isNaN(rawLat)) {
                    return;
                }

                const lng = parseFloat(rawLng.toFixed(6));
                const lat = parseFloat(rawLat.toFixed(6));

                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.style.cursor = 'pointer';
                el.innerHTML = `
                    <div style="position: relative; width: 56px; height: 56px;">
                        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 8px; background: rgba(0,0,0,0.2); border-radius: 50%; filter: blur(4px);"></div>
                        <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 48px; height: 48px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); overflow: hidden; background: white;">
                            <img src="${master.avatar_url || defaultAvatar}" alt="${master.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                        <div style="position: absolute; top: 40px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid white;"></div>
                        ${master.rating > 4 ? `
            <div style="position: absolute; top: -4px; right: -4px; background:  linear-gradient(to right, #22c55e, #15803d); color: white; font-size: 10px; padding: 2px 6px; border-radius: 12px; display: flex; align-items: center; gap: 2px;">
                <span>${master.rating}</span>
            </div>
        ` : `<div  style="position: absolute; top: -4px; right: -4px; background: linear-gradient(to right, #ef4444, #f97316); color: white; font-size: 10px; padding: 2px 6px; border-radius: 12px; display: flex; align-items: center; gap: 2px;">` +
                    `<span> ${master.rating} </span></div>`}      
                    </div>
                `;

                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleMarkerClick(master);
                });

                const marker = new mmrgl.Marker({ element: el, anchor: "center", offset: [0, -8] })
                    .setLngLat([lng, lat])
                    .addTo(map);

                markersRef.current.push(marker);
                bounds.extend([lng, lat]);
                validMarkersCount++;
            });

            if (validMarkersCount > 0) {
                map.fitBounds(bounds, { padding: 100, maxZoom: 14 });
            }
        });

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
            // ДОБАВЛЕНО: очистка маркера пользователя при размонтировании
            if (userMarkerRef.current) {
                userMarkerRef.current.remove();
            }
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [masters]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            <button
                onClick={handleFindMe}
                disabled={isLocating}
                className="absolute top-4 right-4 p-3 bg-white hover:bg-gray-100 disabled:bg-gray-200 text-pink-700 rounded-xl shadow-lg transition-all z-10 flex items-center justify-center border border-pink-200 hover:text-pink-700"
                title="Найти мою позицию"
            >
                <Navigation size={20} className={isLocating ? "animate-pulse text-pink-500" : ""} />
            </button>

            {selectedMaster && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 z-10 w-80 max-w-[calc(100vw-2rem)]">
                    <div className="p-4">
                        <button
                            onClick={() => setSelectedMaster(null)}
                            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <div className="flex items-start gap-3 mb-3">
                            <img
                                src={selectedMaster.avatar_url || defaultAvatar}
                                alt={selectedMaster.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm mb-0.5 truncate font-semibold">{selectedMaster.name}</h4>
                                <p className="text-xs text-gray-600 truncate">{selectedMaster.specialty}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs mb-3">
                            <div className="flex items-center gap-1">
                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                <span className="font-medium">{selectedMaster.rating}</span>
                                <span className="text-gray-500">({selectedMaster.reviews} отзывов)</span>
                            </div>
                            <span className="text-pink-600 font-semibold">от {selectedMaster.priceFrom} ₽</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
