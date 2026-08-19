import { User } from '../types';
import { mockUsers } from '../data/users';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const USERS_KEY = 'lms_users';
const CURRENT_USER_KEY = 'lms_current_user';

// Initialize users in localStorage if not present
const getStoredUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  if (!users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    return mockUsers;
  }
  return JSON.parse(users);
};

export const authService = {
  async login(email: string, password: string): Promise<User> {
    await delay();
    const users = getStoredUsers();
    
    // Quick Demo Validation
    if (email === 'employee@example.com' && password === 'employee123') {
      const user = users.find(u => u.email === email);
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
      }
    }
    
    if (email === 'hr@example.com' && password === 'admin123') {
      const user = users.find(u => u.email === email);
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
      }
    }

    // Generic match
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && password) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }

    throw new Error('Invalid email or password. Please use employee@example.com / employee123 or hr@example.com / admin123.');
  },

  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    if (!userJson) return null;
    return JSON.parse(userJson);
  },

  async updateProfile(userId: string, updatedData: Partial<User>): Promise<User> {
    await delay();
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
      throw new Error('User not found.');
    }

    const updatedUser = { ...users[index], ...updatedData };
    users[index] = updatedUser;
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // If updating currently logged in user
    const curUser = await this.getCurrentUser();
    if (curUser && curUser.id === userId) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }

    return updatedUser;
  },

  async getEmployees(): Promise<User[]> {
    await delay(300);
    const users = getStoredUsers();
    return users.filter(u => u.role === 'employee');
  },

  async getEmployeeById(employeeId: string): Promise<User> {
    await delay(300);
    const users = getStoredUsers();
    const user = users.find(u => u.id === employeeId);
    if (!user) throw new Error('Employee not found');
    return user;
  }
};
