export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export interface UserResponse {
  id: number;
  google_id: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture: string;
  created_at: string;
  updated_at: string;
  last_login_at: string;
}
