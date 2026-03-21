import type { Dispatch, SetStateAction } from "react";

export type Terrain = {
  id: number;
  name: string;
  description: string;
};

export type BookingPackage = {
  duration: string;
  durationLabel: string;
  time: string;
  range: string;
  price: string;
  type: string;
};

export type Booking = {
  date: string;
  terrain: Terrain | null;
  package: BookingPackage | null;
  time: string;
  name: string;
  phone: string;
  email: string;
};

export type BookingSetter = Dispatch<SetStateAction<Booking>>;

export type TerrainAvailability = {
  terrain_id: number;
  hasAnyFreeSlot: boolean;
};

export type BookedSlot = {
  start_time: string;
  end_time: string;
};

export type ReservationActionState =
  | {
      success?: boolean;
      error?: string;
    }
  | null;
