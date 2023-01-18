export type SeatsReservation = {
  code: string;
  expiration: string;
  registration: string;
  seats: number;
  timestamp: string;
  seats_at_event: number;
  waitlist_spots: number;
};

export type ReserveSeatsInput = {
  registration: string;
  seats: number;
  waitlist: boolean;
};

export type UpdateReserveSeatsInput = { code: string } & ReserveSeatsInput;
