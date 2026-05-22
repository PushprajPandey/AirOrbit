export type FlightStatus = 'scheduled' | 'delayed' | 'cancelled' | 'departed';

export type BookingStatus = 'confirmed' | 'rescheduled' | 'cancelled';

export type SeatClass = 'economy' | 'business' | 'first';

export interface Flight {
  id: string;
  flight_no: string;
  origin: string;
  destination: string;
  departs_at: string;
  arrives_at: string;
  aircraft_type: string | null;
  status: FlightStatus;
  base_price: number;
  origin_lat: number | null;
  origin_lon: number | null;
  dest_lat: number | null;
  dest_lon: number | null;
}

export interface Seat {
  id: string;
  flight_id: string;
  seat_number: string;
  class: SeatClass;
  is_available: boolean;
  extra_fee: number;
}

export interface BookingRow {
  id: string;
  user_id: string;
  flight_id: string;
  seat_id: string;
  status: BookingStatus;
  booked_at: string;
  total_price: number;
  pnr_code: string;
}

export interface Booking extends BookingRow {
  flight?: Flight;
  seat?: Seat;
  passengers?: Passenger[];
}

export interface Passenger {
  id: string;
  booking_id: string;
  full_name: string;
  passport_no: string;
  nationality: string;
  dob: string;
}

export interface Reschedule {
  id: string;
  booking_id: string;
  old_flight_id: string;
  new_flight_id: string;
  requested_at: string;
  fee_charged: number;
}

export interface ClassPricing {
  economy: number;
  business: number;
  first: number;
}

export interface RouteFlight {
  id: string;
  flight_no: string;
  departs_at: string;
  arrives_at: string;
  base_price: number;
  aircraft_type: string | null;
  origin_lat: number | null;
  origin_lon: number | null;
  dest_lat: number | null;
  dest_lon: number | null;
}

export type Database = {
  public: {
    Tables: {
      flights: {
        Row: Flight;
        Insert: Omit<Flight, 'id'>;
        Update: Partial<Omit<Flight, 'id'>>;
        Relationships: [];
      };
      seats: {
        Row: Seat;
        Insert: Omit<Seat, 'id'>;
        Update: Partial<Omit<Seat, 'id'>>;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: Omit<BookingRow, 'id' | 'booked_at'>;
        Update: Partial<Omit<BookingRow, 'id'>>;
        Relationships: [];
      };
      passengers: {
        Row: Passenger;
        Insert: Omit<Passenger, 'id'>;
        Update: Partial<Omit<Passenger, 'id'>>;
        Relationships: [];
      };
      reschedules: {
        Row: Reschedule;
        Insert: Omit<Reschedule, 'id' | 'requested_at'>;
        Update: Partial<Omit<Reschedule, 'id'>>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      reserve_seat: {
        Args: {
          p_seat_id: string;
          p_flight_id: string;
          p_user_id: string;
          p_total_price: number;
          p_pnr_code: string;
        };
        Returns: string;
      };
      cancel_booking: {
        Args: {
          p_booking_id: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      get_routes_between: {
        Args: {
          p_origin: string;
          p_destination: string;
        };
        Returns: RouteFlight;
        SetofOptions: {
          to: 'flights';
          from: 'flights';
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
