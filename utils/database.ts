import { User, UserRole } from './types';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface DatabaseUser extends AuthUser {
  role: UserRole;
  carbonPoints: number;
  walletBalance: number;
  createdAt: string;
  lastLogin: string;
}

class Database {
  private users: DatabaseUser[] = [];
  private currentUser: DatabaseUser | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('agriloop_database');
      if (stored) {
        const data = JSON.parse(stored);
        this.users = data.users || [];
        this.currentUser = data.currentUser || null;
      }
    } catch (error) {
      console.error('Failed to load database:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = {
        users: this.users,
        currentUser: this.currentUser
      };
      localStorage.setItem('agriloop_database', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  }

  registerUser(authData: AuthUser, role: UserRole): DatabaseUser {
    const existingUser = this.users.find(u => u.email === authData.email);
    
    if (existingUser) {
      // Update existing user
      existingUser.role = role;
      existingUser.lastLogin = new Date().toISOString();
      this.currentUser = existingUser;
    } else {
      // Create new user
      const newUser: DatabaseUser = {
        ...authData,
        role,
        carbonPoints: this.getDefaultCarbonPoints(role),
        walletBalance: this.getDefaultWalletBalance(role),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      this.users.push(newUser);
      this.currentUser = newUser;
    }
    
    this.saveToStorage();
    return this.currentUser;
  }

  getCurrentUser(): DatabaseUser | null {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    this.saveToStorage();
  }

  updateUserPoints(points: number) {
    if (this.currentUser) {
      this.currentUser.carbonPoints += points;
      this.saveToStorage();
    }
  }

  updateUserBalance(amount: number) {
    if (this.currentUser) {
      this.currentUser.walletBalance += amount;
      this.saveToStorage();
    }
  }

  private getDefaultCarbonPoints(role: UserRole): number {
    switch (role) {
      case UserRole.FARMER: return 1250;
      case UserRole.BUYER: return 350;
      case UserRole.BIOGAS: return 800;
      case UserRole.HOUSEHOLD: return 50;
      default: return 0;
    }
  }

  private getDefaultWalletBalance(role: UserRole): number {
    switch (role) {
      case UserRole.FARMER: return 45000;
      case UserRole.BUYER: return 500000;
      case UserRole.BIOGAS: return 250000;
      default: return 0;
    }
  }
}

export const database = new Database();