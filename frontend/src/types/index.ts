export type UserRole = 'CUSTOMER' | 'ADMIN';

export type User = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
};

export type Session = {
  token: string;
  user: User;
};

export type TravelPackage = {
  id: number;
  title: string;
  destination: string;
  durationDays: number;
  price: number;
  availableSeats: number;
  itinerary: string;
  imageUrl?: string;
  hotelDetails?: string;
  transport?: string;
  status?: string;
};

export type Traveller = {
  id?: number;
  fullName: string;
  age: number;
  passportNo: string;
  nationality: string;
};

export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'PAYMENT_FAILED' | 'CANCELLED' | 'COMPLETED' | 'REFUND_REQUESTED' | 'REFUNDED';

export type Booking = {
  id: number;
  travelDate: string;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  package: TravelPackage;
  user: User;
  travellers: Traveller[];
  payment?: {
    id: number;
    amount: number;
    method: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    transactionRef?: string;
    paidAt?: string;
  };
};

export type CreatePackagePayload = {
  title: string;
  destination: string;
  durationDays: number;
  price: number;
  availableSeats: number;
  itinerary: string;
  imageUrl?: string;
  hotelDetails?: string;
  transport?: string;
};
