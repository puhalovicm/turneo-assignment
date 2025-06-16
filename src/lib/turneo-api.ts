export interface TurneoExperience {
  id: string;
  name: string;
  description?: string;
  highlight?: string;
  commission?: number;
  commissionSettings?: Record<string, unknown> | null;
  included?: { name: string; inclusionId: string }[];
  excluded?: { name: string; exclusionId: string }[];
  images?: {
    urlHigh: string;
    urlLow: string;
    altText: string | null;
  }[];
  externalLinks?: { url: string; label?: string }[];
  organizer?: {
    name: string;
    partnerId: string;
    phone: string | null;
    partnerEmail: string;
    partnerRating: number;
    partnerReviews: number;
    logo: string;
    website: string | null;
    aboutUs: string;
    supportEmail: string | null;
  };
  categories?: {
    type: string;
    theme: string[];
    budget: string;
    attendeeType: string;
    locationType: string;
    disabilityAccessible: string;
  };
  meetingPoint?: {
    city: string;
    pickup: boolean;
    address: string;
    country: string;
    latLong: [number, number];
    description: string;
    centralMeetingPoint: boolean;
  };
  location?: {
    city: string;
    address: string;
    country: string;
    latLong: [number, number];
    latitude: number;
    longitude: number;
    description: string;
  };
  pickup?: {
    value: string;
  };
  rating?: {
    score: number;
    reviewsCount: number;
  };
  maxPrice?: {
    unit: string;
    amount: number;
    currency: string;
  };
  minPrice?: {
    unit: string;
    amount: number;
    currency: string;
    freeOfCharge: boolean;
  };
  videos?: string[];
  otherNotes?: string;
  languages?: string;
  meetingPoints?: {
    id: string;
    type: string;
    city: string;
    country: string;
    address: string;
    description: string;
    latitude: number;
    longitude: number;
    timeBeforeStart: number;
    title: string;
  }[];
  supportContact?: { type: string; value: string }[];
  cancellationPolicy?: number;
  propertyId?: string | null;
  tags?: {
    popular: boolean;
    private: string;
    exclusive: boolean;
    likelyToSellOut: boolean;
  };
  bookingType?: string;
  localized?: {
    language: string;
    status: string;
    source: string;
  }[];
  reviews?: Record<string, unknown> | null;
  discount?: Record<string, unknown> | null;
  duration?: string;
  code?: string | null;
  status?: string;
  cutOffTime?: number;
  allowFreePickup?: boolean;
  travellerTypeScores?: Record<string, unknown> | null;
  availableFrom?: string | null;
}

export interface TurneoApiResponse {
  data: TurneoExperience[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}

export interface TurneoApiError {
  success: false;
  message: string;
  error?: string;
  statusCode?: number;
}

export interface TurneoPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TurneoExperience[];
}

export interface TurneoRate {
  id: string;
  rateName: string;
  rateCode: string | null;
  note: string | null;
  description: string | null;
  duration: {
    days: number;
    hours: number;
    minutes: number;
  } | null;
  groupPrice: {
    amount: number;
    currency: string;
  } | null;
  experienceId: string;
  rateTypesPrices: Array<{
    id: string;
    rateType: string;
    rateTypeDescription: string;
    rateTypeCategory: 'Person' | 'Group' | 'Vehicle' | 'Rental' | 'AddOn' | 'Other';
    retailPrice: {
      amount: number;
      currency: string;
    };
    nonCommissionable: boolean;
  }>;
  bookingFields: Array<{
    id: string;
    name: string;
    optional: boolean;
    rateTypes: string[] | null;
  }>;
  dateRange: {
    startDate: string;
    endDate: string;
  } | null;
  startTimes: string[] | null;
  rateRules: {
    privateBooking: boolean;
    individualBooking: boolean;
    minimumGroupRetailPrice?: {
      amount: number;
      currency: string;
    };
    earlyBirdDiscount?: {
      advanceDays: number;
      percentageAmount: number;
    };
  } | null;
  openingTimes: {
    fromTime: string;
    toTime: string;
  } | null;
  availabilitySource: string;
  discounts: Array<{
    id: string;
    startDate: string;
    endDate: string;
    fromTime: string;
    untilTime: string;
    daysOfWeek: number[];
    percentageAmount: number;
  }> | null;
  discount: number | null;
  resources: string[][];
  datesAvailable: string[] | null;
  availableDates?: Array<{
    availabilityId: string;
    availabilityStatus: 'SELLING' | 'SOLD_OUT' | 'CANCELLED' | 'EXPIRED' | 'CLOSED' | 'PRIVATE_SELLING' | 'PRIVATE_SOLD';
    time: string;
    localTime: string;
    availableQuantity: number;
    discount?: number;
  }>;
  rateStatus: 'ACTIVE' | 'INACTIVE';
  maxParticipants: number;
  availabilityType: 'LIVE' | 'ON_REQUEST';
  private: boolean;
  externalId: string | null;
  privateResource: boolean;
}

export interface TurneoRatesPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TurneoRate[];
}

export interface TurneoOrderRequest {
  travelerInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  bookings: TurneoBookingData[];
  emailNotification?: string[];
  utmMedium?: string;
}

export interface TurneoBookingData {
  id?: string;
  availabilityId: string;
  rateId: string;
  ratesQuantity: Array<{
    rateType: 'Adult' | 'Child' | 'Infant';
    quantity: number;
  }>;
  reseller: {
    name: string;
    partnerId: string;
    logo?: string;
    metadata?: Record<string, string>;
  };
  additionalInformation?: Record<string, string>;
  notes?: {
    fromSeller?: string;
    fromTraveler?: string;
    fromOrganizer?: string;
  };
  resellerReference?: string;
  meetingPoint?: {
    type: 'CENTRAL_MEETING_POINT' | 'HOTEL_PICKUP';
    address: string;
    description?: string;
  };
  privateGroup?: {
    privateRequested: boolean;
    startingTime?: string;
  };
  travelerInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface TurneoOrderResponse {
  id: string; 
  status: string; 
  finalPrice?: {
    amount: number; 
    currency: string; 
  };
  resellerReference?: string | null; 
  utmMedium?: string | null; 
  travelerInformation: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  bookings: Array<{
    id?: string; 
    availabilityId: string; 
    rateId: string;
    ratesQuantity: Array<{
      rateType: 'Adult' | 'Child' | 'Infant';
      quantity: number;
    }>;
    reseller: {
      name: string;
      partnerId: string;
      logo?: string; 
      metadata?: Record<string, string>; 
    };
    travelerInformation: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    additionalInformation?: Record<string, string>; 
    notes?: {
      fromSeller?: string;
      fromTraveler?: string;
      fromOrganizer?: string;
    };
    resellerReference?: string;
    meetingPoint?: {
      type: 'CENTRAL_MEETING_POINT' | 'HOTEL_PICKUP';
      address: string;
      description?: string;
    };
    bookingStatus: 'ON_HOLD' | 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED' | 'REJECTED';
    bookingCreated: string; 
    bookingLastModified: string; 
    localTime?: string; 
    time?: string;
    privateGroup?: boolean;
    cancellation?: {
      cancelledBy?: 'Traveler' | 'Organizer' | 'Reseller' | 'Admin';
      cancelledAt?: string; 
      cancelledReason?: string;
      cancellationFeeAmount?: number;
      cancellationFeeCurrency?: string;
    };
    price: {
      finalRetailPrice: {
        amount: number;
        currency: string; 
      };
      netRate: {
        amount: number; 
        currency: string; 
      };
      retailPriceBreakdown: Array<{
        rateType: 'Adult' | 'Child' | 'Infant';
        quantity: number;
        retailPrice: {
          amount: number; 
          currency: string; 
        };
      }>;
    };
    payment: {
      processedBy: 'TURNEO' | 'TURNEO_LINK' | 'RESELLER_CONCIERGE' | 'RESELLER_ROOM';
      status: 'PAYMENT_PENDING' | 'PAYMENT_COLLECTED' | 'REFUNDED';
      code?: string; 
    };
    experience: TurneoExperience; 
  }>;
}

const TURNEO_API_URL = process.env.NEXT_PUBLIC_TURNEO_API_URL;
const TURNEO_API_KEY = process.env.TURNEO_API_KEY;

if (!TURNEO_API_URL) {
  throw new Error('NEXT_PUBLIC_TURNEO_API_URL is not defined in environment variables');
}

if (!TURNEO_API_KEY) {
  throw new Error('TURNEO_API_KEY is not defined in environment variables');
}

export async function fetchExperiences(params?: {
  page?: number;
}): Promise<TurneoPaginatedResponse | TurneoApiError> {
  try {
    const url = new URL(`${TURNEO_API_URL}/experiences`);
    if (params?.page) url.searchParams.append('page', params.page.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': TURNEO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `API request failed: ${response.status} ${response.statusText}`,
        error: errorData.message || 'Unknown error',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return {
      count: data.count ?? 0,
      next: data.next ?? null,
      previous: data.previous ?? null,
      results: Array.isArray(data.results) ? data.results : [],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function fetchExperienceById(experienceId: string): Promise<TurneoExperience | TurneoApiError> {
  try {
    const url = `${TURNEO_API_URL}/experiences/${experienceId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': TURNEO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `API request failed: ${response.status} ${response.statusText}`,
        error: errorData.message || 'Unknown error',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching experience:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function fetchRates(params?: {
  experienceId?: string;
  validFrom?: string;
  validTo?: string;
  page?: number;
}): Promise<TurneoRatesPaginatedResponse | TurneoApiError> {
  try {
    const url = new URL(`${TURNEO_API_URL}/experiences/${params?.experienceId}/rates`);
    if (params?.validFrom) url.searchParams.append('from', params.validFrom);
    if (params?.validTo) url.searchParams.append('until', params.validTo);
    if (params?.page) url.searchParams.append('page', params.page.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-api-key': TURNEO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `API request failed: ${response.status} ${response.statusText}`,
        error: errorData.message || 'Unknown error',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return {
      count: data.count ?? 0,
      next: data.next ?? null,
      previous: data.previous ?? null,
      results: Array.isArray(data.results) ? data.results : [],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function fetchRateById(rateId: string, experienceId: string): Promise<TurneoRate | TurneoApiError> {
  try {
    const url = `${TURNEO_API_URL}/experiences/${experienceId}/rates/${rateId}`;
    
    const response = await fetch(url, {
      headers: {
        'x-api-key': TURNEO_API_KEY!,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `API request failed: ${response.status} ${response.statusText}`,
        error: errorData.message || 'Unknown error',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rate by ID:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch rate',
    };
  }
}

export async function createOrder(orderData: TurneoOrderRequest): Promise<TurneoOrderResponse | TurneoApiError> {
  try {
    const url = `${TURNEO_API_URL}/orders`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': TURNEO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Order creation failed: ${response.status} ${response.statusText}`,
        error: errorData.message || errorData.error || 'Unknown error',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create order',
    };
  }
}

export async function fetchOrderById(orderId: string): Promise<TurneoOrderResponse | TurneoApiError> {
  try {
    const url = `${TURNEO_API_URL}/orders/${orderId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': TURNEO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Failed to fetch order: ${response.status} ${response.statusText}`,
        error: errorData.message || errorData.error || 'Unknown error',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch order',
    };
  }
}

export async function addBookingToOrder(orderId: string, bookingData: TurneoBookingData): Promise<TurneoOrderResponse | TurneoApiError> {
  try {
    const url = `${TURNEO_API_URL}/orders/${orderId}/add`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': TURNEO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Failed to add booking to order: ${response.status} ${response.statusText}`,
        error: errorData.message || errorData.error || 'Unknown error',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding booking to order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to add booking to order',
    };
  }
}

export async function removeBookingFromOrder(orderId: string, bookingIds: string[]): Promise<TurneoOrderResponse | TurneoApiError> {
  try {
    const url = `${TURNEO_API_URL}/orders/${orderId}/remove`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': TURNEO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        expireBookings: bookingIds
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Failed to remove booking from order: ${response.status} ${response.statusText}`,
        error: errorData.message || errorData.error || 'Unknown error',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error removing booking from order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to remove booking from order',
    };
  }
}

export async function confirmOrder(orderRequest: TurneoOrderRequest, orderId: string): Promise<TurneoOrderResponse | TurneoApiError> {
  try {
    const url = `${TURNEO_API_URL}/orders/${orderId}/confirm`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': TURNEO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(orderRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: `Failed to confirm order: ${response.status} ${response.statusText}`,
        error: errorData.message || errorData.error || 'Unknown error',
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error confirming order:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to confirm order',
    };
  }
} 