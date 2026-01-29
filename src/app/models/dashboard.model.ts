export interface BusinessSummary {
  id: number;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  priceLevel: string;
  isNew: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  newReviews: number;
  pendingRequests: number;
  
  // Γράφημα
  trafficData: { 
    month: string; 
    value: number 
  }[];
  
  recentActivity: {
    name: string;
    role: string;
    date: string;
    status: string;
  }[];

  latestBusinesses: BusinessSummary[];
}