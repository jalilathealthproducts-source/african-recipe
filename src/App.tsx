import { useState, ReactNode, createContext, useContext, useEffect, FormEvent } from 'react';
import { 
  Search, 
  Plus, 
  Star, 
  BarChart2, 
  Settings, 
  Mail, 
  Video, 
  Upload, 
  Check, 
  Lock, 
  Globe,
  MapPin,
  Clock,
  ChevronRight,
  User as UserIcon,
  LogOut,
  LogIn,
  Loader2,
  Phone,
  Edit2,
  Save,
  X,
  Book,
  FileText,
  ShoppingBag,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db, OperationType, handleFirestoreError } from './lib/firebase';

type Screen = 'discover' | 'profile' | 'ebooks' | 'upload' | 'premium' | 'auth' | 'restaurants';

// --- Auth Context ---

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            // Create profile if it doesn't exist
            const newProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              role: 'user',
              createdAt: serverTimestamp()
            };
            try {
              await setDoc(docRef, newProfile);
              setProfile(newProfile);
            } catch (createError) {
              handleFirestoreError(createError, OperationType.CREATE, `users/${user.uid}`);
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// --- Shared Components ---

const Badge = ({ children, variant = 'brand' }: { children: ReactNode, variant?: 'brand' | 'gold' | 'muted' }) => {
  const styles = {
    brand: 'bg-brand-light text-brand-dark',
    gold: 'bg-gold text-white',
    muted: 'bg-gray-100 text-gray-500'
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Market Section ---

const MarketSection = () => {
  return (
    <div className="mt-6 mb-8 px-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-sm font-medium">Spice Marketplace</h2>
          <p className="text-[10px] text-gray-400">Verified authentic African ingredients</p>
        </div>
        <span className="text-xs text-brand cursor-pointer">See all</span>
      </div>
      
      <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-3">
        {['All', 'Spices', 'Grains', 'Peppers', 'Leaves', 'Oils'].map((cat, i) => (
          <button key={cat} className={`px-3 py-1 rounded-full text-[10px] border whitespace-nowrap ${i === 0 ? 'bg-brand border-brand text-white shadow-sm' : 'bg-transparent border-gray-100 text-gray-400'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          { name: 'Tatashe Pepper', price: '₦800 / kg', seller: 'Bello Spices, Kano', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?q=80&w=400&h=300&fit=crop', emoji: '🌶️' },
          { name: 'Palm Oil (Raw)', price: '₦1,500 / 5L', seller: 'Delta Farms', image: 'https://images.unsplash.com/photo-162070612211c-d477bc2a0833?q=80&w=400&h=300&fit=crop', emoji: '🫚' },
          { name: 'Uziza Leaves', price: '₦250 / bunch', seller: 'Mama Chidi, PHC', image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c2ec5?q=80&w=400&h=300&fit=crop', emoji: '🌿' },
          { name: 'Egusi Seeds', price: '₦1,200 / kg', seller: 'Ekene\'s Market', image: 'https://images.unsplash.com/photo-1621460241630-99879237279c?q=80&w=400&h=300&fit=crop', emoji: '🫘' },
        ].map(item => (
          <div key={item.name} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-20 relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm w-6 h-6 rounded flex items-center justify-center text-xs">
                {item.emoji}
              </div>
            </div>
            <div className="p-2">
              <p className="text-[11px] font-medium mb-0.5 truncate">{item.name}</p>
              <p className="text-[10px] text-brand font-semibold mb-0.5">{item.price}</p>
              <p className="text-[9px] text-gray-400 truncate">{item.seller}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-3 p-2.5 rounded-xl border border-dashed border-brand text-brand text-[10px] font-medium flex items-center justify-center gap-1.5 hover:bg-brand/5">
        <Plus size={14} /> List your ingredient
      </button>
    </div>
  );
};

// --- Discover Screen ---

const DiscoverScreen = () => {
  const regions = [
    { icon: '🌍', label: 'West Africa' },
    { icon: '🌿', label: 'East Africa' },
    { icon: '☀️', label: 'North Africa' },
    { icon: '🥘', label: 'Central' },
    { icon: '🍲', label: 'South Africa' },
  ];

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-brand-dark via-brand to-[#D4691E] p-7 pt-9 relative overflow-hidden">
        <div className="absolute -top-5 -right-5 w-30 h-30 rounded-full bg-white/5" />
        <div className="absolute -bottom-7 -left-2 w-20 h-20 rounded-full bg-white/5" />
        
        <h1 className="font-serif text-2xl font-black text-white leading-tight tracking-tight mb-2 uppercase">
          Discover Authentic African Traditional Recipe
        </h1>
        <p className="text-xs text-white/80 mb-4 leading-relaxed max-w-[90%]">
          Explore the rich flavors of African traditional dishes, from the food to the drinks.
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {['English', 'Français', 'العربية', 'Hausa'].map((lang, i) => (
            <span 
              key={lang} 
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${i === 0 ? 'bg-gold border-gold text-white' : 'bg-white/15 border-white/25 text-white'}`}
            >
              {lang}
            </span>
          ))}
        </div>
        
        <div className="bg-white/20 border border-white/30 rounded-xl p-2.5 flex items-center gap-2 text-white/70">
          <Search size={14} />
          <span className="text-sm">Search recipe or ingredient...</span>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium">Browse by Region</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {regions.map(reg => (
            <div key={reg.label} className="flex flex-col items-center gap-1 p-2.5 bg-gray-50 border border-gray-100 rounded-xl min-w-16 flex-shrink-0 cursor-pointer">
              <span className="text-xl">{reg.icon}</span>
              <span className="text-[10px] text-gray-400">{reg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium">All Recipes</h2>
          <span className="text-xs text-brand cursor-pointer">See all</span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-none">
          {[
            { 
              name: 'Jollof Rice', 
              meta: 'West Africa · 45 min', 
              image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&h=300&fit=crop',
              emoji: '🍲', 
              bg: 'bg-[#FFF3E0]' 
            },
            { 
              name: 'Suya', 
              meta: 'Nigeria · 30 min', 
              image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&h=300&fit=crop',
              emoji: '🥩', 
              bg: 'bg-[#F3E5F5]', 
              premium: true 
            },
            { 
              name: 'Egusi Soup', 
              meta: 'West Africa · 60 min', 
              image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&h=300&fit=crop',
              emoji: '🥬', 
              bg: 'bg-[#E8F5E9]' 
            },
            { 
              name: 'Injera', 
              meta: 'Ethiopia · 2 days', 
              image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=400&h=300&fit=crop',
              emoji: '🫙', 
              bg: 'bg-[#FFF8E1]', 
              premium: true 
            },
          ].map((recipe) => (
            <div key={recipe.name} className="min-w-[140px] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex-shrink-0 group cursor-pointer transition-transform hover:scale-[1.02]">
              <div className="h-24 relative overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-sm">
                  {recipe.emoji}
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[12px] font-medium flex items-center gap-1">
                  {recipe.name} {recipe.premium && <Badge variant="gold">Premium</Badge>}
                </p>
                <p className="text-[10px] text-gray-400">{recipe.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium">Drinks & Beverages</h2>
          <span className="text-xs text-brand cursor-pointer">See all</span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-none">
          {[
            { 
              name: 'Zobo Drink', 
              meta: 'Nigeria · 20 min', 
              image: 'https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=400&h=300&fit=crop',
              emoji: '🥤', 
              bg: 'bg-[#FCE4EC]' 
            },
            { 
              name: 'Tamarind Juice', 
              meta: 'Senegal · 15 min', 
              image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=400&h=300&fit=crop',
              emoji: '🍹', 
              bg: 'bg-[#E3F2FD]' 
            },
            { 
              name: 'Kunu Zaki', 
              meta: 'North Nigeria · 1 hr', 
              image: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=400&h=300&fit=crop',
              emoji: '🌿', 
              bg: 'bg-[#F9FBE7]', 
              premium: true 
            },
          ].map((drink) => (
            <div key={drink.name} className="min-w-[140px] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex-shrink-0 group cursor-pointer transition-transform hover:scale-[1.02]">
              <div className="h-24 relative overflow-hidden">
                <img 
                  src={drink.image} 
                  alt={drink.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-sm">
                  {drink.emoji}
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[12px] font-medium flex items-center gap-1">
                  {drink.name} {drink.premium && <Badge variant="gold">Premium</Badge>}
                </p>
                <p className="text-[10px] text-gray-400">{drink.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MarketSection />
      <CommunityFeed />
    </div>
  );
};

// --- Auth Screen ---

const AuthScreen = () => {
  const { signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'user' | 'creator'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: '',
            photoURL: '',
            role: role,
            createdAt: serverTimestamp()
          });
        } catch (setDocError) {
          handleFirestoreError(setDocError, OperationType.CREATE, `users/${user.uid}`);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 pt-12 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-20 h-20 rounded-3xl bg-brand flex items-center justify-center text-4xl mb-6 shadow-xl shadow-brand/20">
        🍲
      </div>
      <h2 className="font-serif text-2xl font-black text-center mb-2">Welcome to AfriRecipe</h2>
      <p className="text-xs text-gray-400 text-center mb-8">Authentic African traditional recipes & spices</p>

      <div className="w-full space-y-4">
        {error && <p className="text-red-500 text-[10px] text-center bg-red-50 p-2 rounded-lg">{error}</p>}
        
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {!isLogin && (
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button 
                type="button"
                onClick={() => setRole('user')}
                className={`flex-1 py-2 rounded-lg text-[11px] font-medium transition-all ${role === 'user' ? 'bg-white shadow-sm text-brand' : 'text-gray-400'}`}
              >
                Join as User
              </button>
              <button 
                type="button"
                onClick={() => setRole('creator')}
                className={`flex-1 py-2 rounded-lg text-[11px] font-medium transition-all ${role === 'creator' ? 'bg-white shadow-sm text-brand' : 'text-gray-400'}`}
              >
                Join as Creator
              </button>
            </div>
          )}

          <input 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm" 
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm" 
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand py-3.5 rounded-2xl text-white font-serif font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] text-gray-300 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button 
          onClick={signInWithGoogle}
          className="w-full bg-white border border-gray-100 py-3.5 rounded-2xl text-gray-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          Continue with Google
        </button>

        <p className="text-center text-[11px] text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-brand font-medium">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

// --- Profile Screen ---

const ProfileScreen = () => {
  const { user, profile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(profile?.displayName || '');
  const [newBio, setNewBio] = useState(profile?.bio || '');
  const [newWhatsappUrl, setNewWhatsappUrl] = useState(profile?.whatsappUrl || '');

  useEffect(() => {
    if (profile) {
      setNewDisplayName(profile.displayName || '');
      setNewBio(profile.bio || '');
      setNewWhatsappUrl(profile.whatsappUrl || '');
    }
  }, [profile]);

  if (!user) return <AuthScreen />;

  const isCreator = profile?.role === 'creator';

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: newDisplayName,
        bio: newBio,
        whatsappUrl: newWhatsappUrl
      });
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24">
      <div className="bg-brand pt-10 pb-6 px-5 text-center text-white relative shadow-lg">
        <div className="absolute top-4 right-4 flex gap-2">
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Edit2 size={16} />
            </button>
          )}
          <button 
            onClick={logout}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>

        <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/50 mx-auto mb-3 flex items-center justify-center text-3xl overflow-hidden shadow-inner">
          {user.photoURL ? <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" /> : (isCreator ? '👩🏾‍🍳' : '👤')}
        </div>

        {isEditing ? (
          <div className="space-y-3 mt-4 max-w-[280px] mx-auto text-left">
            <div>
              <label className="text-[10px] uppercase tracking-wider opacity-70 mb-1 block">Full Name</label>
              <input 
                className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-sm text-white placeholder-white/40 focus:bg-white/20 transition-all outline-none"
                placeholder="Your Name"
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider opacity-70 mb-1 block">Bio / About</label>
              <textarea 
                className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-sm text-white placeholder-white/40 focus:bg-white/20 transition-all outline-none h-20 resize-none"
                placeholder="Tell us about yourself..."
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider opacity-70 mb-1 block">WhatsApp URL</label>
              <input 
                className="w-full bg-white/10 border border-white/20 rounded-xl p-2.5 text-sm text-white placeholder-white/40 focus:bg-white/20 transition-all outline-none"
                placeholder="https://wa.me/..."
                value={newWhatsappUrl}
                onChange={(e) => setNewWhatsappUrl(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex-1 bg-white text-brand py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> Save</>}
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 bg-white/10 text-white py-2.5 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="font-serif text-xl font-bold">{profile?.displayName || user.displayName || 'AfriUser'}</p>
            <p className="text-[11px] opacity-75 mb-3">{user.email}</p>
            {profile?.bio && <p className="text-xs max-w-[240px] mx-auto opacity-90 leading-relaxed mb-4 italic">"{profile.bio}"</p>}
            <div className="flex gap-2 justify-center mb-4">
              <Badge variant={isCreator ? 'gold' : 'brand'}>{isCreator ? 'Creator' : 'App User'}</Badge>
              {profile?.whatsappUrl && (
                <a 
                  href={profile.whatsappUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-1.5 rounded-full bg-green-500/80 border border-green-400 text-[11px] flex items-center gap-1.5 font-medium hover:bg-green-500 transition-colors"
                >
                  <Phone size={12} /> WhatsApp
                </a>
              )}
              <button className="px-4 py-1.5 rounded-full bg-white/20 border border-white/40 text-[11px] flex items-center gap-1.5 font-medium">
                <Mail size={12} /> Message
              </button>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 border-b border-gray-100 bg-white">
        <div className="text-center">
          <p className="text-lg font-medium">{profile?.subscribersCount || '0'}</p>
          <p className="text-[10px] text-gray-400">Subscribers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">0</p>
          <p className="text-[10px] text-gray-400">Total Dishes</p>
        </div>
      </div>

      {isCreator && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-black text-gray-900">Creator Analytics</h3>
            <div className="p-2 bg-brand/5 rounded-lg">
              <BarChart2 size={18} className="text-brand" />
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Top Engaging Regions</p>
              <Globe size={14} className="text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {[
                { name: 'Lagos, Nigeria', percent: 45, color: 'bg-brand' },
                { name: 'Accra, Ghana', percent: 28, color: 'bg-brand' },
                { name: 'London, UK', percent: 15, color: 'bg-brand/60' },
                { name: 'Nairobi, Kenya', percent: 12, color: 'bg-brand/40' },
              ].map((region) => (
                <div key={region.name} className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-gray-700">{region.name}</span>
                    <span className="font-bold text-brand">{region.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${region.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className={`h-full ${region.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-light/30 border border-brand/10 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-brand font-bold uppercase tracking-widest mb-1">Growth Insight</p>
            <p className="text-[11px] text-gray-600 leading-relaxed">Your content is highly popular in <span className="font-bold text-brand">West Africa</span>. Consider sharing more region-specific harvesting tips to further engage this audience.</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Upload Form Component (Relocated from UploadScreen) ---

const UploadForm = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState([
    "Parboil rice with seasoning and tomato blend...",
    "Add palm oil and remaining ingredients..."
  ]);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasImages, setHasImages] = useState(false);

  return (
    <div className="space-y-6">
      {/* Live Preview Card */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl aspect-video relative group">
        {!hasVideo ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 bg-gradient-to-br from-gray-800 to-gray-900">
            <Video size={48} className="mb-2 opacity-20" />
            <p className="text-[10px] uppercase tracking-widest font-bold">Preview will appear here</p>
          </div>
        ) : (
          <div className="absolute inset-0 bg-brand/20 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mx-auto mb-2 bg-white/20">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
              </div>
              <p className="text-xs font-bold uppercase tracking-tight">Cooking Class: {title || 'Untitled Dish'}</p>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-white font-serif text-lg font-bold truncate max-w-[200px]">
                {title || 'Your Traditional Dish'}
              </h4>
              <div className="flex gap-1 mt-1">
                {isPremium && <Badge variant="gold">Premium Class</Badge>}
                <Badge variant="brand">Traditional</Badge>
              </div>
            </div>
            {hasImages && (
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border border-white bg-gray-100 flex items-center justify-center text-sm">🥬</div>
                <div className="w-8 h-8 rounded-full border border-white bg-gray-100 flex items-center justify-center text-sm">🌶️</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute top-4 left-4">
          <div className="px-2 py-1 bg-brand rounded-lg text-[9px] font-bold text-white uppercase tracking-tighter animate-pulse">
            Live Preview
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Dish Title</label>
          <input 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm focus:border-brand outline-none transition-colors" 
            placeholder="e.g. Traditional Jollof Rice"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Video Content</label>
          <div 
            onClick={() => setHasVideo(!hasVideo)}
            className={`border border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group ${hasVideo ? 'bg-brand/5 border-brand/50' : 'bg-gray-50/50 border-gray-200 text-gray-400'}`}
          >
            <Video size={28} className={`${hasVideo ? 'text-brand' : 'text-brand/40'} mx-auto mb-2 transition-colors`} />
            <span className={`text-[11px] ${hasVideo ? 'text-brand font-bold' : 'group-hover:text-gray-600'}`}>
              {hasVideo ? 'Video tutorial uploaded' : 'Tap to upload video tutorial'}
              <br/><span className="text-[9px] opacity-70 font-normal">MP4, MOV up to 500MB</span>
            </span>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Ingredient Pictures</label>
          <div className="flex gap-2">
            {hasImages ? (
              <>
                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shadow-sm">🥬</div>
                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shadow-sm">🌶️</div>
              </>
            ) : null}
            <div 
              onClick={() => setHasImages(!hasImages)}
              className="w-14 h-14 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-brand cursor-pointer hover:bg-brand/5 hover:border-brand/30 transition-all font-bold text-xs"
            >
              {hasImages ? <Plus size={20} /> : 'Add'}
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Step By Step Method</label>
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 items-start">
                <div className="w-6 h-6 rounded-lg bg-brand text-white flex items-center justify-center text-[11px] font-bold shadow-sm flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span className="text-[11px] text-gray-600 leading-relaxed">{step}</span>
              </div>
            ))}
            <button 
              onClick={() => setSteps([...steps, "New step added..."])}
              className="flex items-center gap-1.5 text-brand text-[11px] font-bold p-1 hover:opacity-70 transition-opacity"
            >
              <Plus size={14} /> Add Next Step
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-b border-gray-50">
          <div>
            <p className="text-[12px] font-medium">Set as Premium Recipe</p>
            <p className="text-[9px] text-gray-400 uppercase tracking-tight">
              Currently: <span className={isPremium ? 'text-gold font-bold' : 'text-brand font-bold'}>{isPremium ? 'PAID (PREMIUM)' : 'FREE'}</span>
            </p>
            <p className="text-[8px] text-gray-400 mt-0.5 italic">Creators usually list 6–12 premium dishes</p>
          </div>
          <div 
            onClick={() => setIsPremium(!isPremium)}
            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${isPremium ? 'bg-gold ring-4 ring-gold/10' : 'bg-gray-200 ring-4 ring-gray-100'}`}
          >
            <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${isPremium ? 'left-[25px]' : 'left-[3px]'}`} />
          </div>
        </div>

        <button className="w-full bg-brand py-3.5 rounded-2xl text-white font-serif font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all">
          <Upload size={18} /> Publish Recipe
        </button>
      </div>
    </div>
  );
};

// --- Premium Screen ---

const PremiumScreen = () => {
  const { profile } = useAuth();
  const isCreator = profile?.role === 'creator';

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-[#2C2C2A] to-[#444441] p-6 text-center">
        <div className="text-4xl mb-2">👑</div>
        <p className="font-serif text-xl font-black text-gold uppercase">Premium Access</p>
        <p className="text-xs text-white/70">Elevate your experience on AfriRecipe</p>
      </div>

      <div className="p-4 space-y-4">
        {/* User License */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-brand p-4 text-center text-white">
            <p className="text-[10px] uppercase tracking-wider opacity-80 mb-1">Recipe Enthusiast</p>
            <p className="font-serif text-2xl font-black">₦1,200 <span className="text-xs font-normal opacity-70">/ month</span></p>
          </div>
          <div className="p-4 space-y-2">
            {[
              "Access 6–12 premium recipes",
              "Full HD video walkthroughs",
              "Direct message creators",
              "Exclusive ingredient sourcing"
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-[11px]">
                <Check size={14} className="text-brand" /> {f}
              </div>
            ))}
            <button className="w-full bg-brand py-2.5 rounded-xl text-white text-xs font-bold mt-3">
              Subscribe as User
            </button>
          </div>
        </div>

        {/* Creator License */}
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-gold p-4 text-center text-white">
            <p className="text-[10px] uppercase tracking-wider opacity-80 mb-1">Creator Pro License</p>
            <p className="font-serif text-2xl font-black">₦4,500 <span className="text-xs font-normal opacity-70">/ month</span></p>
          </div>
          <div className="p-4 space-y-2">
            {[
              "Upload & Sell Ebooks",
              "List Products in Marketplace",
              "Advanced Analytics & Insights",
              "Priority Verification Badge",
              "Zero Listing Fees"
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-[11px] text-gray-300">
                <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center">
                  <Check size={10} className="text-gold" />
                </div>
                {f}
              </div>
            ))}
            <button className="w-full bg-gold py-2.5 rounded-xl text-white text-xs font-bold mt-3 shadow-lg shadow-gold/20">
              Go Pro as Creator
            </button>
          </div>
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-[13px] font-medium mb-3">Locked Premium Recipes</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { name: 'Banga Soup', region: 'Delta, Nigeria', emoji: '🫙', image: 'https://images.unsplash.com/photo-1547928501-a6369527376c?q=80&w=400&h=300&fit=crop' },
            { name: 'Thiéboudienne', region: 'Senegal', emoji: '🥘', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&h=300&fit=crop' },
            { name: 'Nyama Choma', region: 'Kenya', emoji: '🍖', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&h=300&fit=crop' },
            { name: 'Sadza & Greens', region: 'Zimbabwe', emoji: '🌽', image: 'https://images.unsplash.com/photo-1515942661900-94b3d197c591?q=80&w=400&h=300&fit=crop' },
          ].map(recipe => (
            <div key={recipe.name} className="bg-white border border-gray-100 rounded-xl overflow-hidden relative shadow-sm group">
              <div className="h-20 relative overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.name} 
                  className="w-full h-full object-cover grayscale opacity-60 transition-all group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                   <Lock size={16} className="text-white/80" />
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[11px] font-medium truncate mb-0.5">{recipe.name}</p>
                <p className="text-[9px] text-gray-400">{recipe.region}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Community Feed Component ---

const CommunityFeed = () => {
  const feed = [
    { id: 1, user: 'Zainab K.', dish: 'Jollof Bliss', image: 'https://images.unsplash.com/photo-1604328700070-08ff901110b8?q=80&w=400&h=400&fit=crop', likes: 24, time: '2h ago' },
    { id: 2, user: 'Kofi A.', dish: 'Palm Nut Soup', image: 'https://images.unsplash.com/photo-1634863212502-d98416ca3861?q=80&w=400&h=400&fit=crop', likes: 18, time: '5h ago' },
    { id: 3, user: 'Amara O.', dish: 'Okra Success', image: 'https://images.unsplash.com/photo-1628102435881-429944dc6b57?q=80&w=400&h=400&fit=crop', likes: 32, time: '8h ago' },
  ];

  return (
    <div className="mt-8 mb-4">
      <div className="flex justify-between items-center mb-4 px-4">
        <div>
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight">Community Results</h2>
          <p className="text-[10px] text-gray-400">See what others are cooking today</p>
        </div>
        <button className="text-brand text-[10px] font-bold uppercase tracking-wider">Join Feed</button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-none">
        {feed.map(post => (
          <div key={post.id} className="min-w-[160px] space-y-2">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
              <img 
                src={post.image} 
                alt={post.dish} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                <div className="bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Star size={10} className="text-gold fill-gold" />
                  <span className="text-[8px] font-bold">{post.likes}</span>
                </div>
                <div className="bg-brand/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-white text-[8px] font-bold">
                  {post.time}
                </div>
              </div>
            </div>
            <div className="px-1">
              <p className="text-[11px] font-bold truncate">{post.dish}</p>
              <p className="text-[9px] text-gray-400">By {post.user}</p>
            </div>
          </div>
        ))}
        <div className="min-w-[140px] flex flex-col items-center justify-center p-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-400 text-center">
          <Camera size={24} className="mb-2 opacity-50" />
          <p className="text-[9px] font-medium leading-tight">Shared your<br/>cook result?</p>
          <button className="mt-2 bg-brand/10 text-brand px-3 py-1 rounded-lg text-[8px] font-bold">Upload Now</button>
        </div>
      </div>
    </div>
  );
};

// --- Marketplace Form Component ---

const MarketplaceForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Product Name</label>
        <input className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm focus:border-brand outline-none transition-colors" placeholder="e.g. Organic Cameroon Pepper" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Price (₦)</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm outline-none" placeholder="1200" type="number" />
        </div>
        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Unit</label>
          <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm outline-none appearance-none">
            <option>per kg</option>
            <option>per 5L</option>
            <option>per bunch</option>
            <option>per pack</option>
          </select>
        </div>
      </div>
      <div>
        <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Product Description</label>
        <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm outline-none h-20 resize-none" placeholder="Describe the origin and quality..." />
      </div>
      <div>
        <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Product Photos</label>
        <div className="flex gap-2">
          <div className="w-16 h-16 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-brand cursor-pointer hover:bg-brand/5">
            <Plus size={20} />
          </div>
        </div>
      </div>
      <button className="w-full bg-brand py-3.5 rounded-2xl text-white font-serif font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all">
        List in Marketplace
      </button>
    </div>
  );
};

// --- Upload Screen ---

const UploadScreen = () => {
  const { profile } = useAuth();
  const isCreator = profile?.role === 'creator';
  const isPro = profile?.subscription === 'pro';
  const [uploadType, setUploadType] = useState<'dish' | 'ebook' | 'market' | 'cook' | 'restaurant'>('cook');

  return (
    <div className="pb-24 p-4">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-black text-brand mb-1">Upload & Share</h2>
        <p className="text-xs text-gray-400">Share your cook results or manage your creations</p>
      </div>

      <div className="space-y-6">
        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto scrollbar-none">
          <button 
            onClick={() => setUploadType('cook')}
            className={`flex-1 min-w-[100px] py-2 text-[10px] font-bold rounded-lg transition-all ${uploadType === 'cook' ? 'bg-white shadow-sm text-brand' : 'text-gray-400'}`}
          >
            Cook Result
          </button>
          {isCreator && (
            <>
              <button 
                onClick={() => setUploadType('dish')}
                className={`flex-1 min-w-[100px] py-2 text-[10px] font-bold rounded-lg transition-all ${uploadType === 'dish' ? 'bg-white shadow-sm text-brand' : 'text-gray-400'}`}
              >
                Recipe
              </button>
              <button 
                onClick={() => setUploadType('ebook')}
                className={`flex-1 min-w-[100px] py-2 text-[10px] font-bold rounded-lg transition-all ${uploadType === 'ebook' ? 'bg-white shadow-sm text-brand' : 'text-gray-400'}`}
              >
                Ebook
              </button>
              <button 
                onClick={() => setUploadType('market')}
                className={`flex-1 min-w-[100px] py-2 text-[10px] font-bold rounded-lg transition-all ${uploadType === 'market' ? 'bg-white shadow-sm text-brand' : 'text-gray-400'}`}
              >
                Shop
              </button>
              <button 
                onClick={() => setUploadType('restaurant')}
                className={`flex-1 min-w-[100px] py-2 text-[10px] font-bold rounded-lg transition-all ${uploadType === 'restaurant' ? 'bg-white shadow-sm text-brand' : 'text-gray-400'}`}
              >
                Restaurant
              </button>
            </>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          {uploadType === 'cook' ? (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">What did you cook?</label>
                <input className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm outline-none" placeholder="e.g. Jollof Rice with Dodo" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Photo</label>
                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50 text-gray-400 hover:bg-brand/5 hover:border-brand/30 transition-all cursor-pointer group">
                  <Camera size={32} className="text-brand/40 group-hover:text-brand mx-auto mb-2 transition-colors" />
                  <span className="text-[11px] group-hover:text-gray-600">Snap or select your dish photo</span>
                </div>
              </div>
              <button className="w-full bg-brand py-3.5 rounded-2xl text-white font-serif font-black text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all">
                Post to Feed
              </button>
            </div>
          ) : uploadType === 'dish' ? (
            <UploadForm />
          ) : (uploadType === 'ebook' || uploadType === 'market') && !isPro ? (
            <div className="py-8 text-center px-4">
              <div className="w-14 h-14 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-4">
                {uploadType === 'ebook' ? <Book className="text-brand" size={24} /> : <ShoppingBag className="text-brand" size={24} />}
              </div>
              <h3 className="font-serif text-lg font-bold mb-2">Creator Pro Required</h3>
              <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                The {uploadType === 'ebook' ? 'Ebook Publishing' : 'Marketplace Selling'} feature is part of our professional toolkit. Upgrade to Creator Pro to start earning from your digital guides and products.
              </p>
              <button className="bg-brand text-white px-8 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-brand/20">
                Upgrade to Creator Pro
              </button>
            </div>
          ) : uploadType === 'ebook' ? (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Ebook Title</label>
                <input className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm focus:border-brand outline-none transition-colors" placeholder="e.g. Traditional Healing Diets" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Category</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm focus:border-brand outline-none transition-colors appearance-none">
                  <option>Diet Ebook</option>
                  <option>Health Conditions</option>
                  <option>Life Stage & Lifestyle</option>
                  <option>Children Hygiene Food</option>
                  <option>Specialty & Occasion</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">PDF File</label>
                <div className="border border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/50 text-gray-400 hover:bg-brand/5 hover:border-brand/30 transition-all cursor-pointer group">
                  <FileText size={28} className="text-brand/40 group-hover:text-brand mx-auto mb-2 transition-colors" />
                  <span className="text-[11px] group-hover:text-gray-600">Select ebook file (PDF)<br/><span className="text-[9px] opacity-70">Up to 50MB</span></span>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Cover Image</label>
                <div className="w-20 h-28 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-brand cursor-pointer hover:bg-brand/5">
                  <Plus size={20} />
                </div>
              </div>
              <button className="w-full bg-brand py-3.5 rounded-2xl text-white font-serif font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all">
                Publish Ebook
              </button>
            </div>
          ) : uploadType === 'restaurant' ? (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Restaurant Name</label>
                <input className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm outline-none" placeholder="e.g. Mama Africa Kitchen" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Physical Address</label>
                <div className="relative">
                  <input className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 pl-9 text-sm outline-none" placeholder="Street, City, State" />
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Best Specialty Dish</label>
                <input className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm outline-none" placeholder="e.g. Authentic Jollof Rice" />
              </div>
              <div>
                <label className="text-[11px] font-medium text-gray-400 block mb-1.5 uppercase tracking-wider">Store Front Photo</label>
                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50 text-gray-400 hover:bg-brand/5 hover:border-brand/30 transition-all cursor-pointer group">
                  <Camera size={32} className="text-brand/40 group-hover:text-brand mx-auto mb-2 transition-colors" />
                  <span className="text-[11px] group-hover:text-gray-600">Upload restaurant exterior or dining area</span>
                </div>
              </div>
              <button className="w-full bg-brand py-3.5 rounded-2xl text-white font-serif font-black text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all">
                Submit Registration
              </button>
            </div>
          ) : (
            <MarketplaceForm />
          )}
        </div>
      </div>
    </div>
  );
};

// --- Ebook Screen ---

const EbookScreen = () => {
  const categories = [
    { title: 'Diet Ebook', icon: '🥗', count: 12 },
    { title: 'Health Conditions', icon: '🏥', count: 8 },
    { title: 'Life Stage & Lifestyle', icon: '🌅', count: 15 },
    { title: 'Children Hygiene Food', icon: '👶', count: 6 },
    { title: 'Specialty & Occasion', icon: '🎉', count: 4 },
  ];

  const featuredEbooks = [
    { title: 'African Healing Herbs', cat: 'Health', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&h=500&fit=crop', price: '₦2,500' },
    { title: 'Pregnancy Nutrition', cat: 'Life Stage', image: 'https://images.unsplash.com/photo-1550951298-5c7b95a66bfc?q=80&w=400&h=500&fit=crop', price: 'Free' },
    { title: 'Pure Baby Pure Food', cat: 'Hygiene', image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=400&h=500&fit=crop', price: '₦1,800' },
  ];

  return (
    <div className="pb-24">
      <div className="p-4 bg-white border-b border-gray-100">
        <h2 className="font-serif text-2xl font-black text-brand mb-1">Ebook Library</h2>
        <p className="text-xs text-gray-400 text-pretty">Professional guides on traditional health and nutrition</p>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-8">
          {categories.map(cat => (
            <div key={cat.title} className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between aspect-square">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="text-[11px] font-black leading-tight mb-1">{cat.title}</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase">{cat.count} Books</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg font-black text-gray-900">Featured Guides</h3>
          <button className="text-brand text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {featuredEbooks.map(book => (
            <div key={book.title} className="min-w-[150px] space-y-2">
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-gray-200 relative group">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-2 right-2 bg-brand text-white text-[8px] font-bold px-2 py-1 rounded-full">
                  {book.price}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold truncate">{book.title}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-tight">{book.cat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Restaurant Screen ---

const RestaurantScreen = () => {
  const restaurants = [
    { 
      name: "Mama Africa's Kitchen", 
      location: "Yaba, Lagos", 
      dist: "1.2km",
      specialty: "Smokey Jollof",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&h=300&fit=crop",
      rating: 4.8
    },
    { 
      name: "The Suya Spot", 
      location: "Osu, Accra", 
      dist: "3.5km",
      specialty: "Beef Suya",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400&h=300&fit=crop",
      rating: 4.5
    },
    { 
      name: "Nairobi Native", 
      location: "Westlands, Nairobi", 
      dist: "5.0km",
      specialty: "Ugali & Sukuma",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&h=300&fit=crop",
      rating: 4.9
    },
  ];

  return (
    <div className="pb-24">
      <div className="p-5 bg-white border-b border-gray-100 flex justify-between items-end">
        <div>
          <h2 className="font-serif text-2xl font-black text-brand mb-1">Local Restaurants</h2>
          <p className="text-xs text-gray-400">Discover authentic tastes near you</p>
        </div>
        <div className="p-2 bg-brand/5 rounded-xl">
          <MapPin size={20} className="text-brand" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Register CTA */}
        <div className="bg-brand rounded-2xl p-5 text-white shadow-xl shadow-brand/20 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
          <h3 className="font-serif text-lg font-bold mb-1">Own a Restaurant?</h3>
          <p className="text-[11px] opacity-90 mb-4 leading-relaxed">List your physical location and reach thousands of traditional food lovers in your city.</p>
          <button className="bg-white text-brand px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm transition-transform active:scale-95">
            Register Location
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2 scrollbar-none">
          {['All Nearby', 'Top Rated', 'Open Now', 'New Arrival'].map((filter, i) => (
            <button key={filter} className={`px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap font-medium border ${i === 0 ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-100 text-gray-400'}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {restaurants.map(rest => (
            <div key={rest.name} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex gap-3 p-2.5 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                <img 
                  src={rest.image} 
                  alt={rest.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight">{rest.name}</h4>
                    <div className="flex items-center gap-0.5 bg-gold/10 px-1.5 py-0.5 rounded text-gold">
                      <Star size={10} className="fill-gold" />
                      <span className="text-[9px] font-bold">{rest.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-gray-400">
                    <MapPin size={10} />
                    <span className="text-[10px]">{rest.location}</span>
                    <span className="text-[10px] opacity-50">· {rest.dist}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="px-2 py-0.5 bg-brand-light/50 text-brand-dark rounded text-[9px] font-bold">
                    {rest.specialty}
                  </div>
                  <button className="text-brand text-[10px] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Navigate <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [activeScreen, setActiveScreen] = useState<Screen>('discover');

  const navItems: { id: Screen; label: string; icon: any }[] = [
    { id: 'discover', label: 'Home', icon: Globe },
    { id: 'restaurants', label: 'Restaurants', icon: MapPin },
    { id: 'ebooks', label: 'Ebooks', icon: Book },
    { id: 'upload', label: 'Upload', icon: Plus },
    { id: 'premium', label: 'Premium', icon: Star },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-brand mb-2" size={32} />
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Loading AfriRecipe</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex justify-center">
      <div className="w-full max-w-[420px] bg-white relative shadow-2xl min-h-screen overflow-hidden flex flex-col">
        {/* Navigation Tabs (Top) */}
        <div className="flex gap-1 px-3 py-2 bg-gray-50 border-b border-gray-100 overflow-x-auto scrollbar-none sticky top-0 z-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`px-3 py-1.5 rounded-full border text-xs whitespace-nowrap transition-all duration-200 ${
                activeScreen === item.id 
                  ? 'bg-brand border-brand text-white shadow-md' 
                  : 'bg-transparent border-gray-200 text-gray-400 hover:border-brand/40 hover:text-brand'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Screens with Transitions */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, scale: 0.98, x: 5 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeScreen === 'discover' && <DiscoverScreen />}
              {activeScreen === 'restaurants' && <RestaurantScreen />}
              {activeScreen === 'ebooks' && <EbookScreen />}
              {activeScreen === 'profile' && <ProfileScreen />}
              {activeScreen === 'upload' && (user ? <UploadScreen /> : <AuthScreen />)}
              {activeScreen === 'premium' && <PremiumScreen />}
              {activeScreen === 'auth' && <AuthScreen />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

