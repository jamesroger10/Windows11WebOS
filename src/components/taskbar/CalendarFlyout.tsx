import React, { useState } from 'react';
import { useSystemStore } from '../../stores/useSystemStore';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';

export const CalendarFlyout: React.FC = () => {
  const { isCalendarOpen, currentTime } = useSystemStore();
  const [viewDate, setViewDate] = useState(new Date());

  if (!isCalendarOpen) return null;

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Days calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days: { day: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

  // Blank slots for previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ day: 0, isCurrentMonth: false, isToday: false });
  }

  // Current month days
  const today = currentTime.getDate();
  const isActualCurrentMonth =
    currentTime.getFullYear() === currentYear && currentTime.getMonth() === currentMonth;

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      isCurrentMonth: true,
      isToday: isActualCurrentMonth && d === today,
    });
  }

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 right-3 w-80 win-acrylic win-flyout-shadow rounded-xl p-4 text-white z-[9999] animate-win-flyout border border-white/10"
    >
      {/* Date Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <div className="text-2xl font-semibold tracking-tight">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="text-xs text-sky-400 font-medium mt-0.5">
          {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Month Navigator */}
      <div className="flex items-center justify-between py-2 text-xs font-semibold">
        <span>{monthNames[currentMonth]} {currentYear}</span>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-zinc-400 mb-1">
        {daysOfWeek.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((slot, idx) => (
          <div
            key={idx}
            className={`h-8 flex items-center justify-center rounded-full text-[12px] transition-colors ${
              !slot.isCurrentMonth
                ? 'opacity-0'
                : slot.isToday
                ? 'bg-sky-500 font-bold text-white shadow-sm'
                : 'text-zinc-200 hover:bg-white/10 cursor-pointer'
            }`}
          >
            {slot.day > 0 ? slot.day : ''}
          </div>
        ))}
      </div>

      {/* Notifications section */}
      <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Bell size={14} className="text-zinc-400" />
          <span>No new notifications</span>
        </div>
      </div>
    </div>
  );
};
