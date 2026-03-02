
import { useState } from 'react';
import { useWardrobe } from '../hooks/useWardrobe';
import type { ClothingItem, WeeklyPlan, DailyOutfit, Category } from '../types';
import { Categories } from '../types';

interface OutfitEditorProps {
    editingDay: { name: string, date: string };
    plan: WeeklyPlan;
    updateDay: (day: string, outfit: DailyOutfit) => void;
    onClose: () => void;
}

export function OutfitEditor({ editingDay, plan, updateDay, onClose }: OutfitEditorProps) {
    const { wardrobe } = useWardrobe();
    const [openSection, setOpenSection] = useState<Category | null>(null);

    const toggleSection = (cat: Category) => {
        setOpenSection(prev => prev === cat ? null : cat);
    };

    const formatDisplayDate = (dateKey: string) => {
        const [y, m, d] = dateKey.split('-');
        return `${d}/${m}/${y}`;
    };

    const toggleItemInDay = (item: ClothingItem) => {
        const currentOutfit = plan[editingDay.date] || { day: editingDay.name, date: editingDay.date, items: [] };
        const isSelected = currentOutfit.items.find(i => i.id === item.id);

        const nextItems = isSelected
            ? currentOutfit.items.filter(i => i.id !== item.id)
            : [...currentOutfit.items, item];

        updateDay(editingDay.date, { ...currentOutfit, items: nextItems });
    };

    return (
        <div className="fixed inset-0 z-[110] bg-white flex flex-col p-8 animate-fade">
            <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex flex-col">
                        <h3 className="text-4xl font-black uppercase tracking-tighter">{editingDay.name}</h3>
                        <span className="text-sm font-bold text-zinc-400 mt-2">{formatDisplayDate(editingDay.date)}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-black text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        Listo
                    </button>
                </div>

                <div className="overflow-y-auto no-scrollbar pb-12 space-y-3">
                    {([
                        { key: Categories.TOP, icon: 'fa-shirt' },
                        { key: Categories.BOTTOM, icon: 'fa-socks' },
                        { key: Categories.SHOES, icon: 'fa-shoe-prints' },
                        { key: Categories.ACCESSORY, icon: 'fa-gem' },
                    ] as const).map(({ key, icon }) => {
                        const items = wardrobe.filter(item => item.category === key);
                        if (items.length === 0) return null;
                        const isOpen = openSection === key;

                        return (
                            <div key={key} className="space-y-4">
                                <button
                                    onClick={() => toggleSection(key)}
                                    className={`w-full flex items-center justify-between px-6 py-4 rounded-3xl transition-all ${isOpen ? 'bg-black text-white' : 'bg-zinc-50 hover:bg-zinc-100 text-black'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <i className={`fas ${icon} text-[10px] ${isOpen ? 'text-white' : 'text-zinc-400'}`}></i>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{key}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-bold ${isOpen ? 'text-zinc-500' : 'text-zinc-300'}`}>
                                            {items.length} {items.length === 1 ? 'pieza' : 'piezas'}
                                        </span>
                                        <i className={`fas fa-chevron-down text-[8px] transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 px-2 animate-fade py-4">
                                        {items.map(item => {
                                            const active = plan[editingDay.date]?.items.find(i => i.id === item.id);
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => toggleItemInDay(item)}
                                                    className={`relative aspect-[3/4] rounded-[2rem] overflow-hidden transition-all shadow-sm group ${active ? 'ring-4 ring-black scale-95 shadow-xl' : 'opacity-60 hover:opacity-100'}`}
                                                >
                                                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                                    {active && (
                                                        <div className="absolute top-3 right-3 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center z-10">
                                                            <i className="fas fa-check text-[10px]"></i>
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm py-2 px-3 text-[8px] font-bold text-white uppercase tracking-widest translate-y-full transition-transform group-hover:translate-y-0">
                                                        {item.name}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
