import { Space, TimeSlot } from '../types/booking';
import { formatLocalDateKey } from '@/lib/booking-utils';

export const generateMockSlots = (): TimeSlot[] => {
  const spaces: Space[] = ['vsl', 'vsr', 'arcade'];
  const slots: TimeSlot[] = [];
  
  // Generate for exactly the next 30 days
  const today = new Date();
  
  for (let d = 0; d < 30; d++) {
    const current = new Date(today);
    current.setDate(today.getDate() + d);
    const dateStr = formatLocalDateKey(current);
    const isWeekend = current.getDay() === 0 || current.getDay() === 6;

    spaces.forEach(space => {
      // 6 time slots per day
      const dailyHours = [9, 11, 13, 15, 17, 19];
      dailyHours.forEach(hour => {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 2).toString().padStart(2, '0')}:00`;
        
        // Randomly scatter statuses for realism
        const rand = Math.random();
        let status: TimeSlot['status'] = 'available';
        const isPeakTime = isWeekend || hour >= 17;
        let label = isPeakTime ? (isWeekend ? 'Weekend Rate' : 'Peak Time') : undefined;
        const priceModifier = isPeakTime ? 1.5 : undefined;

        if (rand > 0.85) status = 'booked';
        else if (rand > 0.75) status = 'blocked';
        else if (rand > 0.70) {
          status = 'buffer-blocked'; // To mock standard gaps
          label = 'System Buffer';
        }

        slots.push({
          id: `slot-${space}-${dateStr}-${startTime.replace(':','')}`,
          space,
          date: dateStr,
          startTime,
          endTime,
          status,
          label,
          isPeakTime,
          priceModifier,
          bufferBefore: 30, // 30 min buffer mapping
          bufferAfter: 30
        });
      });
    });
  }

  return slots;
};
