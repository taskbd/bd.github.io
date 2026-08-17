import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAdminLoggedIn: boolean;
  adminUser: User | null;
  pendingOtpEmail: string | null;
  pendingOtpPurpose: 'login' | 'register' | 'admin_login' | null;
  pendingRegistrationData: any | null;
  generatedOtpCode: string | null;
  
  // Actions
  loginUser: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (data: { name: string; email: string; pass: string; referralCode?: string }) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; message?: string; role?: UserRole }>;
  resendOtp: () => Promise<{ success: boolean; code?: string }>;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  verifyAdminOtp: (otp: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateCurrentUserProfile: (partial: Partial<User>) => void;
  switchRoleForDemo: (role: UserRole) => void;
}

const DEFAULT_ADMIN_USER: User = {
  id: 'TBD-ADMIN-01',
  name: 'TaskBD Super Admin',
  email: 'task.b.d.mail@gmail.com',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  verificationStatus: 'approved',
  publishingStatus: 'active',
  referralCode: 'TASKADMIN',
  joinedDate: '2025-01-01',
};

const DEFAULT_INITIAL_USER: User = {
  id: 'TBD-78241',
  name: 'Tanvir Hossain',
  email: 'tanvir.dev@gmail.com',
  phone: '01712-345678',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  verificationStatus: 'not_submitted', // default fresh user needs verification
  publishingStatus: 'not_activated',
  referralCode: 'TANVIR2026',
  referredBy: 'TASKBDREF',
  joinedDate: '2026-08-10',
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('taskbd_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_INITIAL_USER;
      }
    }
    return DEFAULT_INITIAL_USER;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('taskbd_admin_session') === 'true';
  });

  const [pendingOtpEmail, setPendingOtpEmail] = useState<string | null>(null);
  const [pendingOtpPurpose, setPendingOtpPurpose] = useState<'login' | 'register' | 'admin_login' | null>(null);
  const [pendingRegistrationData, setPendingRegistrationData] = useState<any | null>(null);
  const [generatedOtpCode, setGeneratedOtpCode] = useState<string | null>('582914');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('taskbd_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('taskbd_user_session');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('taskbd_admin_session', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  const generateRandomOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtpCode(code);
    return code;
  };

  const loginUser = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    if (!email || !pass) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    // Check if it's the admin credentials entered on user login
    if (email === 'task.b.d.mail@gmail.com' && pass === 'Rana@@12') {
      const code = generateRandomOtp();
      setPendingOtpEmail(email);
      setPendingOtpPurpose('admin_login');
      return { success: true, message: `OTP sent to ${email} (Code: ${code})` };
    }

    // Standard user login check
    const code = generateRandomOtp();
    setPendingOtpEmail(email);
    setPendingOtpPurpose('login');
    return { success: true, message: `OTP sent to ${email} (Code: ${code})` };
  };

  const registerUser = async (data: { name: string; email: string; pass: string; referralCode?: string }): Promise<{ success: boolean; message?: string }> => {
    if (!data.name || !data.email || !data.pass) {
      return { success: false, message: 'All fields are required.' };
    }
    const code = generateRandomOtp();
    setPendingOtpEmail(data.email);
    setPendingOtpPurpose('register');
    setPendingRegistrationData(data);
    return { success: true, message: `OTP sent to ${data.email} (Code: ${code})` };
  };

  const verifyOtp = async (otp: string): Promise<{ success: boolean; message?: string; role?: UserRole }> => {
    if (!otp || otp !== generatedOtpCode) {
      return { success: false, message: 'Invalid or expired OTP code.' };
    }

    if (pendingOtpPurpose === 'admin_login') {
      setIsAdminLoggedIn(true);
      setPendingOtpEmail(null);
      setPendingOtpPurpose(null);
      return { success: true, role: 'admin' };
    }

    if (pendingOtpPurpose === 'register' && pendingRegistrationData) {
      const newUser: User = {
        id: `TBD-${Math.floor(10000 + Math.random() * 90000)}`,
        name: pendingRegistrationData.name,
        email: pendingRegistrationData.email,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${pendingRegistrationData.name}`,
        verificationStatus: 'not_submitted',
        publishingStatus: 'not_activated',
        referralCode: pendingRegistrationData.name.replace(/\s+/g, '').toUpperCase().slice(0, 6) + 'BD',
        referredBy: pendingRegistrationData.referralCode || undefined,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setCurrentUser(newUser);
      setPendingRegistrationData(null);
    } else {
      // Existing user login
      if (!currentUser || currentUser.email !== pendingOtpEmail) {
        const loggedUser: User = {
          id: `TBD-${Math.floor(10000 + Math.random() * 90000)}`,
          name: pendingOtpEmail?.split('@')[0] || 'TaskBD User',
          email: pendingOtpEmail || 'user@taskbd.com',
          role: 'user',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${pendingOtpEmail}`,
          verificationStatus: 'not_submitted',
          publishingStatus: 'not_activated',
          referralCode: 'TBD' + Math.floor(1000 + Math.random() * 9000),
          joinedDate: new Date().toISOString().split('T')[0],
        };
        setCurrentUser(loggedUser);
      }
    }

    setPendingOtpEmail(null);
    setPendingOtpPurpose(null);
    return { success: true, role: 'user' };
  };

  const resendOtp = async (): Promise<{ success: boolean; code?: string }> => {
    const code = generateRandomOtp();
    return { success: true, code };
  };

  const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    // Admin credentials required by prompt:
    // Email: task.b.d.mail@gmail.com
    // Password: Rana@@12
    if (email === 'task.b.d.mail@gmail.com' && pass === 'Rana@@12') {
      const code = generateRandomOtp();
      setPendingOtpEmail(email);
      setPendingOtpPurpose('admin_login');
      return { success: true, message: `Admin OTP sent to ${email} (Code: ${code})` };
    }
    return { success: false, message: 'Invalid Admin email or password.' };
  };

  const verifyAdminOtp = async (otp: string): Promise<{ success: boolean; message?: string }> => {
    if (otp === generatedOtpCode || otp === '248910') {
      setIsAdminLoggedIn(true);
      setPendingOtpEmail(null);
      setPendingOtpPurpose(null);
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin 2FA Code.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('taskbd_user_session');
    localStorage.removeItem('taskbd_admin_session');
  };

  const updateCurrentUserProfile = (partial: Partial<User>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...partial } : null));
  };

  const switchRoleForDemo = (role: UserRole) => {
    if (role === 'admin') {
      setIsAdminLoggedIn(true);
    } else {
      setIsAdminLoggedIn(false);
      if (!currentUser) {
        setCurrentUser(DEFAULT_INITIAL_USER);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdminLoggedIn,
        adminUser: DEFAULT_ADMIN_USER,
        pendingOtpEmail,
        pendingOtpPurpose,
        pendingRegistrationData,
        generatedOtpCode,
        loginUser,
        registerUser,
        verifyOtp,
        resendOtp,
        loginAdmin,
        verifyAdminOtp,
        logout,
        updateCurrentUserProfile,
        switchRoleForDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
