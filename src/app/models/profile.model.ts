export interface Profile {
  id:string;
  uid: string;
  email: string;
  role: UserRole;
  created_on: string;
  displayName: string;
  idDomaine: string;
  last_connected: string;
  photoURL: string;
}

export const enum UserRole {
  Admin = "admin",
  User = "user",
}
