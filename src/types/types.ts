export interface UserType {
  id?: String,
  email: String,
  firstName: String,
  lastName: String,
  password?: String,
  createdAt?: Date
}
export interface ClientType {
  id?: String,
  fullName: String,
  address: String,
  email: String,
  phone: String,
  createdAt?: Date,
  userId: String
}