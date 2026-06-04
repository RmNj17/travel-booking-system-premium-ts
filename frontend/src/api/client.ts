import {
  Booking,
  BookingStatus,
  CreatePackagePayload,
  Session,
  TravelPackage,
} from "../types";

const API_BASE_URL = "http://localhost:3000";

type RequestOptions = RequestInit & { token?: string };

type ApiErrorResponse = { message?: string };

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const data = (await response.json().catch(() => null)) as
    | ApiErrorResponse
    | T
    | null;

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      data.message
        ? data.message
        : "Something went wrong. Please try again.";
    throw new ApiError(String(message), response.status);
  }

  return data as T;
}

export const api = {
  login: (payload: { email: string; password: string }) =>
    request<Session>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  register: (payload: { fullName: string; email: string; password: string }) =>
    request<Session>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getPackages: (destination?: string) =>
    request<TravelPackage[]>(
      `/packages${destination ? `?destination=${encodeURIComponent(destination)}` : ""}`,
    ),

  createPackage: (token: string, payload: CreatePackagePayload) =>
    request<TravelPackage>("/packages", {
      token,
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updatePackage: (
    token: string,
    packageId: number,
    payload: CreatePackagePayload,
  ) =>
    request<TravelPackage>(`/packages/${packageId}`, {
      token,
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deletePackage: (token: string, packageId: number) =>
    request<void>(`/packages/${packageId}`, {
      token,
      method: "DELETE",
    }),

  createBooking: (
    token: string,
    payload: {
      packageId: number;
      travelDate: string;
      travellers: Array<{
        fullName: string;
        age: number;
        passportNo: string;
        nationality: string;
      }>;
    },
  ) =>
    request<Booking>("/bookings", {
      token,
      method: "POST",
      body: JSON.stringify(payload),
    }),

  payBooking: (token: string, bookingId: number, success: boolean) =>
    request<Booking>(`/bookings/${bookingId}/pay`, {
      token,
      method: "POST",
      body: JSON.stringify({ success }),
    }),

  getMyBookings: (token: string) =>
    request<Booking[]>("/bookings/mine", { token }),

  getAllBookings: (token: string) => request<Booking[]>("/bookings", { token }),

  updateBookingStatus: (
    token: string,
    bookingId: number,
    status: BookingStatus,
  ) =>
    request<Booking>(`/bookings/${bookingId}/status`, {
      token,
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
