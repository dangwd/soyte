export interface DashboardStats {
  evaluate: {
    ratingDistribution: {
      star5: number;
      star4: number;
      star3: number;
      star2: number;
      star1: number;
      star0: number; // Không đánh giá
    };
  };
  overview: {
    total: number;
    accepted: number;
    pending: number;
    averageRating: number;
  };
  reflect: {
    tiendo: {
      daLam: number;
      dangLam: number;
      chuaLam: number;
    };
    danhgia: {
      dat: number;
      khongDat: number;
    };
  };
  trend: {
    date: string;
    count: number;
  }[];
  summary: any[];
  categories: any[];
}

export interface FeedbackItem {
  id?: string;
  _id?: string;
  type?: string;
  info?: any;
  created_at?: string;
  createdAt?: string;
  date?: string;
  name?: string;
  fullName?: string;
  creator_name?: string;
  form_id?: string;
  [key: string]: any;
}
