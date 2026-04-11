import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Space, TimeSlot, Booking, WaitlistEntry, SlotStatus, BookingStatus } from '../types/booking';
import { generateMockSlots } from './mock-data';
import { addHoursToTime, formatLocalDateKey } from '@/lib/booking-utils';
import { FALLBACK_BOOKING_DURATION_HOURS } from '@/lib/booking/duration';

interface CustomerBookingInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  acceptedPolicies: boolean;
  adminNotes?: string;
}

interface ManualBookingInput extends CustomerBookingInput {
  space: Space;
  date: string;
  startTime: string;
}

interface BookingState {
  // Data
  slots: TimeSlot[];
  bookings: Booking[];
  waitlists: WaitlistEntry[];

  // Actions - Customer
  bookSlot: (slotId: string, bookingData: CustomerBookingInput) => Booking;
  createBookingRequest: (bookingData: ManualBookingInput) => Booking;
  cancelBooking: (bookingId: string) => boolean;
  rescheduleBooking: (oldBookingId: string, newSlotId: string) => Booking | null;
  joinWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'createdAt'>) => void;

  // Actions - Admin
  updateSlotStatus: (slotId: string, status: SlotStatus) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  addAdminNote: (bookingId: string, note: string) => void;
  toggleBookingTag: (bookingId: string, tag: string) => void;
  bulkBlockDay: (space: Space, date: string) => void;
  bulkOpenDay: (space: Space, date: string) => void;
  
  // Helpers
  getAvailableSlots: (space: Space, date: string) => TimeSlot[];
  getNextAvailableSlot: (space: Space, date: string, time: string) => TimeSlot | null;
  getUserBookings: (email: string) => Booking[];
}

const createBookingRecord = (
  bookingData: ManualBookingInput,
  overrides?: Partial<Pick<Booking, 'date' | 'startTime' | 'endTime' | 'space' | 'status'>>,
): Booking => {
  const space = overrides?.space ?? bookingData.space;
  const date = overrides?.date ?? bookingData.date;
  const startTime = overrides?.startTime ?? bookingData.startTime;
  const endTime = overrides?.endTime ?? addHoursToTime(startTime, FALLBACK_BOOKING_DURATION_HOURS);

  return {
    id: `bk-${Date.now()}`,
    reference: `BP-${space.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: bookingData.customerName,
    customerEmail: bookingData.customerEmail,
    customerPhone: bookingData.customerPhone,
    space,
    date,
    startTime,
    endTime,
    status: overrides?.status ?? 'confirmed',
    acceptedPolicies: bookingData.acceptedPolicies,
    createdAt: new Date().toISOString(),
    tags: [],
    adminNotes: bookingData.adminNotes,
  };
};

const getSeedBooking = (): Booking => ({
  id: 'mock-bk-1',
  reference: 'BP-VSL-0925',
  customerName: 'Alice Client',
  customerEmail: 'alice@example.com',
  customerPhone: '+1 555-1234',
  space: 'vsl',
  date: formatLocalDateKey(new Date()),
  startTime: '09:00',
  endTime: '11:00',
  status: 'confirmed',
  acceptedPolicies: true,
  createdAt: new Date().toISOString(),
  tags: ['VIP'],
  adminNotes: 'Requested specific ambient lighting.',
});

const ensureArray = <T>(value: unknown, fallback: T[]) =>
  Array.isArray(value) ? (value as T[]) : fallback;

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      slots: generateMockSlots(),
      bookings: [getSeedBooking()],
      waitlists: [],

      bookSlot: (slotId, data) => {
        let newBooking: Booking | null = null;
        set((state) => {
          const slotIndex = state.slots.findIndex(s => s.id === slotId);
          if (slotIndex === -1 || state.slots[slotIndex].status !== 'available') return state;

          const slot = state.slots[slotIndex];
          newBooking = createBookingRecord(
            {
              ...data,
              space: slot.space,
              date: slot.date,
              startTime: slot.startTime,
            },
            {
              endTime: slot.endTime,
              status: 'confirmed',
            },
          );

          const newSlots = [...state.slots];
          newSlots[slotIndex] = { ...slot, status: 'booked' };

          // Buffer logic: If slot is booked, we should theoretically block overlapping buffers here.
          // For mock simplicity, we just mark the specific slot booked.
          
          return {
            slots: newSlots,
            bookings: [...state.bookings, newBooking]
          };
        });
        if (!newBooking) throw new Error("Slot unavailable");
        return newBooking;
      },

      createBookingRequest: (data) => {
        let createdBooking: Booking | null = null;

        set((state) => {
          const matchingSlotIndex = state.slots.findIndex(
            (slot) =>
              slot.space === data.space &&
              slot.date === data.date &&
              slot.startTime === data.startTime,
          );

          if (matchingSlotIndex !== -1) {
            const matchingSlot = state.slots[matchingSlotIndex];

            if (matchingSlot.status !== 'available') {
              throw new Error('Selected slot is no longer available.');
            }

            createdBooking = createBookingRecord(data, {
              endTime: matchingSlot.endTime,
              status: 'confirmed',
            });

            const newSlots = [...state.slots];
            newSlots[matchingSlotIndex] = { ...matchingSlot, status: 'booked' };

            return {
              bookings: [...state.bookings, createdBooking],
              slots: newSlots,
            };
          }

          createdBooking = createBookingRecord(data, {
            status: 'pending',
          });

          return {
            bookings: [...state.bookings, createdBooking],
          };
        });

        if (!createdBooking) {
          throw new Error('Unable to create booking request.');
        }

        return createdBooking;
      },

      cancelBooking: (bookingId) => {
        let success = false;
        set((state) => {
          const bookingIndex = state.bookings.findIndex(b => b.id === bookingId);
          if (bookingIndex === -1) return state;

          const booking = state.bookings[bookingIndex];
          const newBookings = [...state.bookings];
          newBookings[bookingIndex] = { ...booking, status: 'cancelled' };

          // Free up the slot
          const newSlots = state.slots.map((s): TimeSlot => 
            (s.space === booking.space && s.date === booking.date && s.startTime === booking.startTime)
              ? { ...s, status: 'available' }
              : s
          );

          success = true;
          return { bookings: newBookings, slots: newSlots };
        });
        return success;
      },

      rescheduleBooking: (oldId, newSlotId) => {
        let rescheduledObj: Booking | null = null;
        set((state) => {
          const oldIndex = state.bookings.findIndex(b => b.id === oldId);
          if (oldIndex === -1) return state;
          
          const oldBooking = state.bookings[oldIndex];
          const slotIndex = state.slots.findIndex(s => s.id === newSlotId);
          if (slotIndex === -1 || state.slots[slotIndex].status !== 'available') return state;

          const newSlot = state.slots[slotIndex];

          const newBookings = [...state.bookings];
          newBookings[oldIndex] = { ...oldBooking, status: 'rescheduled' };

          rescheduledObj = {
            ...oldBooking,
            id: `bk-${Date.now()}`,
            reference: `${oldBooking.reference}-R`,
            status: 'confirmed',
            date: newSlot.date,
            startTime: newSlot.startTime,
            endTime: newSlot.endTime,
            createdAt: new Date().toISOString(),
          };
          newBookings.push(rescheduledObj);

          let newSlots = [...state.slots];
          // mark new booked
          newSlots[slotIndex] = { ...newSlot, status: 'booked' };
          // free old
          newSlots = newSlots.map((s): TimeSlot => 
            (s.space === oldBooking.space && s.date === oldBooking.date && s.startTime === oldBooking.startTime)
              ? { ...s, status: 'available' }
              : s
          );

          return { bookings: newBookings, slots: newSlots };
        });
        return rescheduledObj;
      },

      joinWaitlist: (entry) => {
        set(state => ({
          waitlists: [...state.waitlists, { ...entry, id: `wl-${Date.now()}`, createdAt: new Date().toISOString() }]
        }));
      },

      updateSlotStatus: (slotId, status) => {
        set(state => ({
          slots: state.slots.map(s => s.id === slotId ? { ...s, status } : s)
        }));
      },

      updateBookingStatus: (bookingId, status) => {
        set(state => ({
          bookings: state.bookings.map(b => b.id === bookingId ? { ...b, status } : b)
        }));
      },

      addAdminNote: (bookingId, note) => {
         set(state => ({
           bookings: state.bookings.map(b => b.id === bookingId ? { ...b, adminNotes: note } : b)
         }));
      },

      toggleBookingTag: (bookingId, tag) => {
        set(state => ({
          bookings: state.bookings.map(b => {
             if (b.id !== bookingId) return b;
             const hasTag = b.tags.includes(tag);
             return { ...b, tags: hasTag ? b.tags.filter(t => t !== tag) : [...b.tags, tag] };
          })
        }));
      },

      bulkBlockDay: (space, date) => {
        set(state => ({
          slots: state.slots.map(s => (s.space === space && s.date === date) ? { ...s, status: 'blocked' } : s)
        }));
      },

      bulkOpenDay: (space, date) => {
        set(state => ({
          slots: state.slots.map(s => (s.space === space && s.date === date) ? { ...s, status: 'available' } : s)
        }));
      },

      getAvailableSlots: (space, date) => {
        return get().slots.filter(s => s.space === space && s.date === date && s.status === 'available');
      },

      getNextAvailableSlot: (space, date, time) => {
        // basic mock logic: find first available after this date
        const slots = get().slots.filter(s => s.space === space && s.status === 'available');
        // sort by date then time
        slots.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
        return slots.find(s => s.date > date || (s.date === date && s.startTime > time)) || null;
      },

      getUserBookings: (email) => {
        return get().bookings.filter(b => b.customerEmail.toLowerCase() === email.toLowerCase());
      }
    }),
    {
      name: 'black-pepper-booking-storage',
      merge: (persistedState, currentState) => {
        const typedState = persistedState as Partial<BookingState> | undefined;

        return {
          ...currentState,
          slots: ensureArray<TimeSlot>(typedState?.slots, currentState.slots),
          bookings: ensureArray<Booking>(typedState?.bookings, currentState.bookings),
          waitlists: ensureArray<WaitlistEntry>(
            typedState?.waitlists,
            currentState.waitlists,
          ),
        };
      },
    }
  )
);
