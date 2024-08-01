export interface UserType {
  id?: string,
  email: string,
  firstName: string,
  lastName: string,
  password?: string,
  createdAt?: Date
}
export interface ClientType {
  id: string,
  fullName: string,
  address: string,
  email: string,
  phone: string,
  createdAt?: Date,
  userId: string
}

export interface ServiceType {
  id?: string,
  name: string,
  total: number,
  deposit: number,
  userId: string
  date: string
}