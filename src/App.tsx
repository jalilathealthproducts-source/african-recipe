import { useState, ReactNode } from 'react';
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
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Screen = 'discover' | 'profile' | 'upload' | 'premium' | 'market';

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
            { name: 'Jollof Rice', meta: 'West Africa · 45 min', emoji: '🍲', bg: 'bg-[#FFF3E0]' },
            { name: 'Suya', meta: 'Nigeria · 30 min', emoji: '🥩', bg: 'bg-[#F3E5F5]', premium: true },
            { name: 'Egusi Soup', meta: 'West Africa · 60 min', emoji: '🥬', bg: 'bg-[#E8F5E9]' },
            { name: 'Injera', meta: 'Ethiopia · 2 days', emoji: '🫙', bg: 'bg-[#FFF8E1]', premium: true },
          ].map((recipe) => (
            <div key={recipe.name} className="min-w-[140px] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
              <div className={`h-20 flex items-center justify-center text-3xl ${recipe.bg}`}>
                {recipe.emoji}
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
            { name: 'Zobo Drink', meta: 'Nigeria · 20 min', emoji: '🥤', bg: 'bg-[#FCE4EC]' },
            { name: 'Tamarind Juice', meta: 'Senegal · 15 min', emoji: '🍹', bg: 'bg-[#E3F2FD]' },
            { name: 'Kunu Zaki', meta: 'North Nigeria · 1 hr', emoji: '🌿', bg: 'bg-[#F9FBE7]', premium: true },
          ].map((drink) => (
            <div key={drink.name} className="min-w-[140px] bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
              <div className={`h-20 flex items-center justify-center text-3xl ${drink.bg}`}>
                {drink.emoji}
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
    </div>
  );
};

// --- Profile Screen ---

const ProfileScreen = ({ onUploadClick }: { onUploadClick: () => void }) => {
  return (
    <div className="pb-20">
      <div className="bg-brand pt-10 pb-5 px-5 text-center text-white">
        <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 mx-auto mb-3 flex items-center justify-center text-2xl">
          👩🏾‍🍳
        </div>
        <p className="font-serif text-lg font-bold">Mama Adaeze</p>
        <p className="text-[11px] opacity-75 mb-4">@mama_adaeze_cooks</p>
        <button className="px-4 py-1.5 rounded-full bg-white/20 border border-white/40 text-[11px] flex items-center gap-1.5 mx-auto">
          <Mail size={12} /> Message
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4 border-b border-gray-100">
        <div className="text-center">
          <p className="text-lg font-medium">12.4K</p>
          <p className="text-[10px] text-gray-400">Subscribers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">48</p>
          <p className="text-[10px] text-gray-400">Total Dishes</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">₦1,200</p>
          <p className="text-[10px] text-gray-400">Sub Price/mo</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 p-4">
        <button onClick={onUploadClick} className="bg-brand border border-brand text-white p-3 rounded-xl text-[11px] flex flex-col items-center gap-1">
          <Plus size={20} /> Upload New Dish
        </button>
        <button className="bg-gray-50 border border-gray-100 p-3 rounded-xl text-[11px] flex flex-col items-center gap-1 text-gray-900">
          <Star size={20} className="text-brand" /> Premium Recipes
        </button>
        <button className="bg-gray-50 border border-gray-100 p-3 rounded-xl text-[11px] flex flex-col items-center gap-1 text-gray-900">
          <BarChart2 size={20} className="text-brand" /> Analytics
        </button>
        <button className="bg-gray-50 border border-gray-100 p-3 rounded-xl text-[11px] flex flex-col items-center gap-1 text-gray-900">
          <Settings size={20} className="text-brand" /> Settings
        </button>
      </div>

      <div className="px-4">
        <h2 className="text-sm font-medium mb-3">My Dishes</h2>
        <div className="space-y-4">
          {[
            { name: 'Jollof Rice (Special)', views: '4.2K views · 320 saves', emoji: '🍲', badge: 'Free' },
            { name: 'Suya Spice Masterclass', views: '8.1K views · 890 saves', emoji: '🥩', badge: 'Gold', badgeStyle: 'bg-[#FFF8E1] text-[#8B5E00]' },
            { name: 'Egusi Soup Secrets', views: '5.7K views · 640 saves', emoji: '🥬', badge: 'Free' },
          ].map(dish => (
            <div key={dish.name} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
                {dish.emoji}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium leading-tight mb-0.5">{dish.name}</p>
                <p className="text-[10px] text-gray-400">{dish.views}</p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-medium ${dish.badgeStyle || 'bg-brand-light text-brand-dark'}`}>
                {dish.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Upload Screen ---

const UploadScreen = () => {
  return (
    <div className="p-4 pb-24">
      <h2 className="font-serif text-lg font-bold">Upload New Dish</h2>
      <p className="text-[11px] text-gray-400 mb-5">Share your authentic African recipe with the world</p>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5">Dish title</label>
          <input className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm" placeholder="e.g. Traditional Jollof Rice" />
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5">Video content</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50 text-gray-400">
            <Video size={28} className="text-brand mx-auto mb-2" />
            <span className="text-[11px]">Tap to upload cooking video<br/><span className="text-[9px] opacity-70">MP4, MOV up to 500MB</span></span>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5">Ingredient pictures</label>
          <div className="flex gap-2">
            <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">🥬</div>
            <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl">🌶️</div>
            <div className="w-14 h-14 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-brand cursor-pointer">
              <Plus size={20} />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5">Method steps</label>
          <div className="space-y-2.5">
            {[
              "Parboil rice with seasoning and tomato blend...",
              "Add palm oil and remaining ingredients..."
            ].map((step, i) => (
              <div key={i} className="flex gap-3 pb-2.5 border-b border-gray-100">
                <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-[11px] font-medium flex-shrink-0">
                  {i + 1}
                </div>
                <span className="text-xs text-gray-700 pt-0.5">{step}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-brand text-xs pt-1 cursor-pointer">
              <Plus size={14} /> Add step
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-400 block mb-1.5">Tips & tricks</label>
          <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-sm h-20 resize-none" placeholder="Share your secret tips..." />
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <p className="text-[13px] font-medium">Set as Premium Recipe</p>
            <p className="text-[10px] text-gray-400">Only paying subscribers can view</p>
          </div>
          <div className="w-10 h-5.5 rounded-full bg-brand relative cursor-pointer">
            <div className="absolute top-[3px] right-[3px] w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>

        <button className="w-full bg-brand py-3.5 rounded-2xl text-white font-serif font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand/20">
          <Upload size={18} /> Publish Recipe
        </button>
      </div>
    </div>
  );
};

// --- Premium Screen ---

const PremiumScreen = () => {
  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-[#2C2C2A] to-[#444441] p-6 text-center">
        <div className="text-4xl mb-2">👑</div>
        <p className="font-serif text-xl font-black text-gold uppercase">Premium Recipes</p>
        <p className="text-xs text-white/70">Unlock 6–12 exclusive traditional recipes per creator</p>
      </div>

      <div className="m-4 bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-brand p-4 text-center text-white">
          <p className="text-[10px] uppercase tracking-wider opacity-80 mb-1">Monthly Subscription</p>
          <p className="font-serif text-3xl font-black">₦1,200 <span className="text-xs font-normal opacity-70">/ month</span></p>
        </div>
        <div className="p-4 space-y-2">
          {[
            "Access 6–12 premium recipes",
            "Full HD video walkthroughs",
            "Direct message creator",
            "Exclusive spice & ingredient tips",
            "Early access to new dishes"
          ].map(f => (
            <div key={f} className="flex items-center gap-2.5 text-xs">
              <Check size={14} className="text-brand" /> {f}
            </div>
          ))}
          <button className="w-full bg-brand py-3 rounded-xl text-white text-sm font-medium mt-3 shadow-md shadow-brand/10">
            Subscribe Now
          </button>
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-[13px] font-medium mb-3">Locked Premium Recipes</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { name: 'Banga Soup', region: 'Delta, Nigeria', emoji: '🫙' },
            { name: 'Thiéboudienne', region: 'Senegal', emoji: '🥘' },
            { name: 'Nyama Choma', region: 'Kenya', emoji: '🍖' },
            { name: 'Sadza & Greens', region: 'Zimbabwe', emoji: '🌽' },
          ].map(recipe => (
            <div key={recipe.name} className="bg-white border border-gray-100 rounded-xl overflow-hidden relative shadow-sm">
              <div className="h-18 bg-brand-light/40 flex items-center justify-center text-3xl">
                {recipe.emoji}
              </div>
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm">
                <Lock size={10} className="text-white" />
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

// --- Market Screen ---

const MarketScreen = () => {
  return (
    <div className="pb-24">
      <div className="p-4 pb-2">
        <h2 className="font-serif text-lg font-bold">Spice Marketplace</h2>
        <p className="text-[11px] text-gray-400 mb-4">Buy authentic African spices & ingredients from verified sellers</p>
        
        <div className="flex gap-1.5 overflow-x-auto pb-3 scrollbar-none">
          {['All', 'Spices', 'Grains', 'Peppers', 'Leaves', 'Oils'].map((cat, i) => (
            <button key={cat} className={`px-4 py-1.5 rounded-full text-[11px] border whitespace-nowrap ${i === 0 ? 'bg-brand border-brand text-white' : 'bg-transparent border-gray-100 text-gray-400'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 p-4 pt-0">
        {[
          { name: 'Tatashe Pepper', price: '₦800 / kg', seller: 'Bello Spices, Kano', emoji: '🌶️' },
          { name: 'Palm Oil (Raw)', price: '₦1,500 / 5L', seller: 'Delta Farms', emoji: '🫚' },
          { name: 'Uziza Leaves', price: '₦250 / bunch', seller: 'Mama Chidi, PHC', emoji: '🌿' },
          { name: 'Egusi Seeds', price: '₦1,200 / kg', seller: 'Ekene\'s Market', emoji: '🫘' },
        ].map(item => (
          <div key={item.name} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
            <div className="h-20 bg-gray-50 flex items-center justify-center text-3xl">
              {item.emoji}
            </div>
            <div className="p-2.5">
              <p className="text-[12px] font-medium mb-0.5">{item.name}</p>
              <p className="text-[11px] text-brand font-semibold mb-0.5">{item.price}</p>
              <p className="text-[9px] text-gray-400">{item.seller}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4">
        <button className="w-full p-3 rounded-xl border-2 border-dashed border-brand text-brand text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-brand/5 transition-colors">
          <Plus size={16} /> List your spice or ingredient
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('discover');

  const navItems: { id: Screen; label: string; icon: any }[] = [
    { id: 'discover', label: 'Discover', icon: Globe },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'upload', label: 'Upload', icon: Plus },
    { id: 'premium', label: 'Premium', icon: Star },
    { id: 'market', label: 'Market', icon: ChevronRight }, // Ideally a shopping bag icon
  ];

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
              {activeScreen === 'profile' && <ProfileScreen onUploadClick={() => setActiveScreen('upload')} />}
              {activeScreen === 'upload' && <UploadScreen />}
              {activeScreen === 'premium' && <PremiumScreen />}
              {activeScreen === 'market' && <MarketScreen />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

