import mmrgl from 'mmr-gl';
import { useEffect, useRef, useState } from 'react';
import { Star, X } from 'lucide-react';

interface Master {
    id: string;
    name: string;
    specialty: string;
    imageUrl: string;
    rating: number;
    reviews: number;
    location: string;
    priceFrom: number;
    lat: number;
    lng: number;
}

interface MapComponentProps {
    masters: Master[];
    onMasterSelect?: (master: Master) => void;
}

export function MapComponent({ masters, onMasterSelect }: MapComponentProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);

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
            // Очищаем старые маркеры
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            // Добавляем маркеры для каждого мастера
            masters.forEach((master) => {
                // Создаем DOM элемент для маркера
                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.style.cursor = 'pointer';
                el.style.cursor = 'pointer';
                console.log(master);
                // HTML структура маркера с фото мастера
                el.innerHTML = `
          <div style="position: relative; width: 56px; height: 56px;">
            <!-- Тень маркера -->
            <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 32px; height: 8px; background: rgba(0,0,0,0.2); border-radius: 50%; filter: blur(4px);"></div>

            <!-- Капля маркера -->
            <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 48px; height: 48px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); overflow: hidden; background: white;">
              <img src="${master.imageUrl}" alt="${master.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(236, 72, 153, 0.3), transparent);"></div>
            </div>

            <!-- Хвостик маркера -->
            <div style="position: absolute; top: 40px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid white; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));"></div>

            <!-- Рейтинг бейдж -->
            <div style="position: absolute; top: -4px; right: -4px; background: linear-gradient(to right, #facc15, #f97316); color: white; font-size: 10px; padding: 2px 6px; border-radius: 12px; display: flex; align-items: center; gap: 2px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-weight: 600;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span>${master.rating}</span>
            </div>
          </div>
        `;

                // Добавляем обработчик клика
                el.addEventListener('click', () => {
                    setSelectedMaster(master);
                    if (onMasterSelect) {
                        onMasterSelect(master);
                    }
                });

                // Создаем и добавляем маркер на карту
                const marker = new mmrgl.Marker({ element: el, anchor: "center",offset: [0, -8] })
                    .setLngLat([master.lng, master.lat])
                    .addTo(map);

                markersRef.current.push(marker);
            });

            // Центрируем карту по всем маркерам
            if (masters.length > 0) {
                const bounds = new mmrgl.LngLatBounds();
                masters.forEach(master => {
                    bounds.extend([master.lng, master.lat]);
                });
                map.fitBounds(bounds, { padding: 100, maxZoom: 14 });
            }
        });

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [masters, onMasterSelect]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            {/* Попап с информацией о выбранном мастере */}
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
                                src={selectedMaster.imageUrl}
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

                        <button
                            onClick={() => {
                                if (onMasterSelect) {
                                    onMasterSelect(selectedMaster);
                                }
                            }}
                            className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                        >
                            Записаться
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
