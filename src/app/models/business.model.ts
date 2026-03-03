export interface Business {
  id: number;
  name: string;
  category: 'Attraction' | 'Restaurant' | 'Hotel' | 'Cafe';
  categoryType: string;
  moodTags: string[];
  isSuspectedScam: boolean;
  isHiddenGem: boolean;
  address: string;
  longitude: number;
  latitude: number;
  city: string;
  country: string;
  phone: string;
  priceRange: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  reviews?: number;
  location: string;
}

export interface TopBusiness {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  priceLevel: string;
}
