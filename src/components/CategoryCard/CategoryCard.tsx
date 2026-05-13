import {useNavigate} from "react-router-dom";

interface CategoryCardProps {
    name: string;
    imageUrl: string;
    count: number;
    onClickCategory: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export function CategoryCard({ name, avatar_url, masters_count, onClickCategory }: CategoryCardProps) {

    return (
        <div className="group cursor-pointer" onClick={onClickCategory}>
            <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-3">
                <img
                    src={avatar_url}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="mb-1">{name}</h3>
                    <p className="text-sm text-white/80">Найдено {masters_count} специалистов</p>
                </div>
            </div>
        </div>
    );
}
