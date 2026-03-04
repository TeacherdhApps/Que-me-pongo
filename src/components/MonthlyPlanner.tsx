
import { useState, useMemo, memo } from 'react';
import { useWeeklyPlan } from '../hooks/useWardrobe';
import { OutfitEditor } from './OutfitEditor';
import type { ClothingItem } from '../types';

interface DayCellProps {
    date: Date;
    outfit?: { items: ClothingItem[] };
    isToday: boolean;
    onEdit: (day: { name: string; date: string }) => void;
    dayName: string;
    dateKey: string;
}

const PlannerDayCell = memo(({ date, outfit, isToday, onEdit, dayName, dateKey }: DayCellProps) => {
    const hasOutfit = outfit && outfit.items.length > 0;

    return (
        <button
            onClick={() => onEdit({ name: dayName, date: dateKey })}
            className={`
                aspect-square rounded-2xl p-2 transition-all relative flex flex-col items-center justify-center animate-fade
                ${isToday ? 'bg-black text-white' : 'bg-white hover:bg-zinc-100'}
                ${hasOutfit ? 'ring-2 ring-black ring-inset' : ''}
            `}
        >
            <span className={`text-[10px] font-bold ${isToday ? '' : 'text-zinc-700'}`}>
                {date.getDate()}
            </span>

            {hasOutfit && (
                <div className="flex -space-x-1 mt-1">
                    {outfit.items.slice(0, 3).map(itm => (
                        <img
                            key={itm.id}
                            src={itm.image}
                            loading="lazy"
                            className="w-4 h-4 rounded-full border border-white object-cover"
                        />
                    ))}
                    {outfit.items.length > 3 && (
                        <div className="w-4 h-4 rounded-full bg-zinc-100 border border-white flex items-center justify-center text-[6px] font-bold">
                            +{outfit.items.length - 3}
                        </div>
                    )}
                </div>
            )}
        </button>
    );
});

PlannerDayCell.displayName = 'PlannerDayCell';

const MonthlySkeleton = () => (
    <div className="bg-zinc-50 rounded-[3rem] p-10 border border-zinc-100 animate-pulse">
        <div className="grid grid-cols-7 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className="h-2 w-8 bg-zinc-200 rounded mx-auto"></div>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="aspect-square bg-white rounded-2xl p-2 flex flex-col items-center justify-center gap-2">
                    <div className="w-4 h-2 bg-zinc-100 rounded"></div>
                    <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-zinc-50 border border-zinc-100"></div>
                        <div className="w-4 h-4 rounded-full bg-zinc-50 border border-zinc-100"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

interface MonthlyPlannerProps {
    onViewChange: (view: 'week' | 'month') => void;
}

export function MonthlyPlanner({ onViewChange }: MonthlyPlannerProps) {
    const { plan, isLoading, updateDay } = useWeeklyPlan();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [editingDay, setEditingDay] = useState<{ name: string, date: string } | null>(null);

    const formatDateKey = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startPadding = (firstDay.getDay() + 6) % 7;

        const days = [];

        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }, [currentDate]);

    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <div className="animate-fade">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">
                        {monthNames[currentDate.getMonth()]} <span className="text-zinc-300">{currentDate.getFullYear()}</span>
                    </h2>
                    <div className="flex gap-4 mt-2 mb-4">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                            className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-[8px] hover:scale-110 transition-transform"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                            className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-[8px] hover:scale-110 transition-transform"
                        >
                            →
                        </button>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => onViewChange('week')}
                            className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity pb-1"
                        >
                            Semana
                        </button>
                        <button
                            onClick={() => onViewChange('month')}
                            className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1"
                        >
                            Mes
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <MonthlySkeleton />
            ) : (
                <div className="bg-zinc-50 rounded-[3rem] p-10 border border-zinc-100">
                    <div className="grid grid-cols-7 gap-4 mb-8">
                        {dayNames.map(d => (
                            <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-4">
                        {daysInMonth.map((date, idx) => {
                            if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;

                            const dateKey = formatDateKey(date);
                            const outfit = plan[dateKey];
                            const isToday = date.toDateString() === new Date().toDateString();

                            return (
                                <PlannerDayCell
                                    key={date.toISOString()}
                                    date={date}
                                    outfit={outfit}
                                    isToday={isToday}
                                    onEdit={setEditingDay}
                                    dayName={dayNames[(date.getDay() + 6) % 7]}
                                    dateKey={dateKey}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {editingDay && (
                <OutfitEditor
                    editingDay={editingDay}
                    plan={plan}
                    updateDay={updateDay}
                    onClose={() => setEditingDay(null)}
                />
            )}
        </div>
    );
}
