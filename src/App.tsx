import { useState, type ReactNode, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Wand2, 
  Home as HomeIcon, 
  User as UserIcon, 
  Settings, 
  ShieldAlert, 
  Star,
  Menu,
  Lock,
  Mail,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  X
} from "lucide-react";
import { SPELLS, HOUSES, CREATURES, type Spell, type House, type Creature, type User } from "./types";

type Screen = "home" | "spells" | "creatures" | "profile" | "settings" | "admin";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("magisterium_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("magisterium_user");
    setUser(null);
    setCurrentScreen("home");
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-gold"
        >
          <Wand2 className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLogin={(u) => {
      localStorage.setItem("magisterium_user", JSON.stringify(u));
      setUser(u);
    }} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onDiscover={() => setCurrentScreen("spells")} />;
      case "spells":
        return <SpellsScreen />;
      case "creatures":
        return <CreaturesScreen />;
      case "profile":
        return <ProfileScreen user={user} onLogout={handleLogout} onAdmin={() => setCurrentScreen("admin")} />;
      case "admin":
        return user.role === "admin" ? <AdminScreen /> : <HomeScreen onDiscover={() => setCurrentScreen("spells")} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h2 className="text-2xl font-display text-primary italic mb-4 uppercase tracking-widest">Em Construção</h2>
            <p className="text-slate-600 italic">Esta seção do castelo está protegida por um feitiço de barreira.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-primary border-b border-gold/30 p-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <button className="text-gold hover:bg-gold/10 p-2 rounded-full transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-display text-2xl font-bold text-gold tracking-widest uppercase italic">Magisterium</h1>
        <button className="text-gold hover:bg-gold/10 p-2 rounded-full transition-colors">
          <Search className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-primary border-t border-gold/30 p-2 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
        <NavButton 
          active={currentScreen === "home"} 
          onClick={() => setCurrentScreen("home")} 
          icon={<HomeIcon className="w-6 h-6" />} 
          label="Início" 
        />
        <NavButton 
          active={currentScreen === "spells"} 
          onClick={() => setCurrentScreen("spells")} 
          icon={<Wand2 className="w-6 h-6" />} 
          label="Feitiços" 
        />
        <NavButton 
          active={currentScreen === "creatures"} 
          onClick={() => setCurrentScreen("creatures")} 
          icon={<ShieldAlert className="w-6 h-6" />} 
          label="Criaturas" 
        />
        <NavButton 
          active={currentScreen === "profile" || currentScreen === "admin"} 
          onClick={() => setCurrentScreen("profile")} 
          icon={<UserIcon className="w-6 h-6" />} 
          label="Perfil" 
        />
        <NavButton 
          active={currentScreen === "settings"} 
          onClick={() => setCurrentScreen("settings")} 
          icon={<Settings className="w-6 h-6" />} 
          label="Ajustes" 
        />
      </nav>
    </div>
  );
}

function AuthScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [house, setHouse] = useState("gryffindor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isLogin ? "/api/login" : "/api/register";
    const body = isLogin ? { username, password } : { username, password, house };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        onLogin(data);
      } else {
        setError(data.error || "Ocorreu um erro");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 parchment-texture">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm parchment-card p-8 flex flex-col items-center shadow-2xl"
      >
        <div className="bg-primary p-4 rounded-full text-gold mb-6 shadow-lg">
          <Wand2 className="w-10 h-10" />
        </div>
        
        <h2 className="text-3xl font-display font-bold text-primary italic mb-2 uppercase tracking-widest">
          {isLogin ? "Entrar" : "Criar Conta"}
        </h2>
        <p className="text-slate-600 text-sm italic mb-8 font-serif">
          {isLogin ? "Bem-vindo de volta ao castelo" : "Inicia a tua jornada mágica"}
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Nome de utilizador"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border-2 border-gold/30 rounded-lg py-3 pl-10 pr-4 focus:border-primary outline-none transition-all font-serif italic"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="password" 
              placeholder="Palavra-passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border-2 border-gold/30 rounded-lg py-3 pl-10 pr-4 focus:border-primary outline-none transition-all font-serif italic"
              required
            />
          </div>

          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gold">Escolhe a tua Casa</label>
              <select 
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className="w-full bg-white border-2 border-gold/30 rounded-lg py-3 px-4 focus:border-primary outline-none transition-all font-serif italic"
              >
                {HOUSES.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-xs font-bold text-center italic"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-gold font-bold py-4 rounded-lg shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest mt-2 disabled:opacity-50"
          >
            {loading ? "A processar..." : (isLogin ? "Entrar" : "Criar")}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-primary text-sm font-bold hover:underline italic font-serif"
        >
          {isLogin ? "Não tens conta? Cria uma aqui" : "Já tens conta? Entra aqui"}
        </button>
      </motion.div>
    </div>
  );
}

function ProfileScreen({ user, onLogout, onAdmin }: { user: User, onLogout: () => void, onAdmin: () => void }) {
  const house = HOUSES.find(h => h.id === user.house) || HOUSES[0];

  return (
    <div className="flex flex-col p-6">
      <div className="parchment-card p-8 flex flex-col items-center text-center shadow-xl mb-8">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg border-4"
          style={{ backgroundColor: house.color, borderColor: house.accent }}
        >
          <span className="material-symbols-outlined text-5xl text-white">{house.icon}</span>
        </div>
        
        <h2 className="text-3xl font-display text-primary italic mb-1 uppercase tracking-widest">
          {user.username}
        </h2>
        <p className="text-gold font-bold uppercase tracking-widest text-sm mb-4">
          Membro da Casa {house.name}
        </p>
        
        <div className="w-full h-px bg-gold/30 my-6"></div>
        
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-primary/5 p-4 rounded-lg border border-gold/20">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Nível Mágico</p>
            <p className="text-xl font-display text-primary">Bruxo Iniciante</p>
          </div>
          <div className="bg-primary/5 p-4 rounded-lg border border-gold/20">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Pontos da Casa</p>
            <p className="text-xl font-display text-primary">150</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {user.role === "admin" && (
          <button 
            onClick={onAdmin}
            className="w-full bg-gold text-primary font-bold py-4 rounded-lg shadow-md hover:bg-gold/90 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <ShieldCheck className="w-5 h-5" />
            Painel de Administração
          </button>
        )}

        <button 
          onClick={onLogout}
          className="w-full bg-white border-2 border-primary text-primary font-bold py-4 rounded-lg shadow-md hover:bg-primary/5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>
    </div>
  );
}

function AdminScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [house, setHouse] = useState("gryffindor");
  const [role, setRole] = useState<"user" | "admin">("user");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const endpoint = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
    const method = editingUser ? "PUT" : "POST";
    const body = editingUser 
      ? { username, house, role } 
      : { username, password, house, role };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchUsers();
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tens a certeza que queres expulsar este bruxo do castelo?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setHouse("gryffindor");
    setRole("user");
    setEditingUser(null);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setUsername(user.username);
    setHouse(user.house);
    setRole(user.role);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-primary italic uppercase tracking-widest">Gestão de Bruxos</h2>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-primary text-gold p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Wand2 className="w-8 h-8 text-gold animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map(u => (
            <div key={u.id} className="parchment-card p-4 flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${u.role === 'admin' ? 'bg-gold' : 'bg-primary'}`}>
                  <span className="material-symbols-outlined text-xl">
                    {HOUSES.find(h => h.id === u.house)?.icon || 'person'}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-primary">{u.username}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">{u.house} • {u.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(u)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm parchment-card p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-display font-bold text-primary italic mb-6 uppercase tracking-widest">
                {editingUser ? "Editar Bruxo" : "Novo Bruxo"}
              </h3>

              <form onSubmit={handleCreateOrUpdate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gold">Nome</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white border border-gold/30 rounded py-2 px-3 focus:border-primary outline-none font-serif italic"
                    required
                  />
                </div>

                {!editingUser && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gold">Palavra-passe</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-gold/30 rounded py-2 px-3 focus:border-primary outline-none font-serif italic"
                      required
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gold">Casa</label>
                  <select 
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    className="w-full bg-white border border-gold/30 rounded py-2 px-3 focus:border-primary outline-none font-serif italic"
                  >
                    {HOUSES.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gold">Cargo</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as "user" | "admin")}
                    className="w-full bg-white border border-gold/30 rounded py-2 px-3 focus:border-primary outline-none font-serif italic"
                  >
                    <option value="user">Utilizador</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary text-gold font-bold py-3 rounded shadow-lg hover:bg-primary/90 transition-all uppercase tracking-widest mt-4"
                >
                  {editingUser ? "Atualizar" : "Criar Bruxo"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? "text-gold scale-110" : "text-gold/50 hover:text-gold/80"}`}
    >
      <div className={active ? "drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" : ""}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function HomeScreen({ onDiscover }: { onDiscover: () => void }) {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section 
        className="h-[60vh] relative flex flex-col items-center justify-center text-center p-6 bg-cover bg-center border-b-4 border-gold"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://picsum.photos/seed/hogwarts/1200/800')` }}
      >
        <motion.h2 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-[0_2px_10px_rgba(212,175,55,0.8)]"
        >
          Bem-vindo ao Magisterium
        </motion.h2>
        <p className="text-xl text-parchment italic mb-8 max-w-xs mx-auto font-serif">
          "Onde o impossível ganha vida e o destino é escrito em ouro."
        </p>
        <button 
          onClick={onDiscover}
          className="bg-gold text-primary font-bold py-4 px-10 rounded-full hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.5)] uppercase tracking-widest text-sm"
        >
          Descobrir Minha Casa
        </button>
      </section>

      {/* Houses */}
      <section className="p-6">
        <h3 className="text-3xl text-center font-display font-bold mb-2 text-primary uppercase italic">As Grandes Casas</h3>
        <div className="w-16 h-1 bg-gold mx-auto mb-8"></div>
        <div className="grid grid-cols-1 gap-6">
          {HOUSES.map((house) => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      </section>
    </div>
  );
}

function HouseCard({ house }: { house: House, key?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="parchment-card p-6 text-center flex flex-col items-center"
      style={{ borderTop: `12px solid ${house.color}` }}
    >
      <div className="mb-4" style={{ color: house.color }}>
        <span className="material-symbols-outlined text-5xl">{house.icon}</span>
      </div>
      <h4 className="text-2xl font-display font-bold mb-2 uppercase tracking-wider" style={{ color: house.color }}>
        {house.name}
      </h4>
      <p className="text-sm text-slate-700 italic font-serif">
        {house.description}
      </p>
      <div className="mt-4 flex gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: house.color }}></div>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: house.accent }}></div>
      </div>
    </motion.div>
  );
}

function SpellsScreen() {
  return (
    <div className="flex flex-col">
      <div 
        className="h-48 relative flex flex-col justify-end p-6 bg-cover bg-center border-b-4 border-gold"
        style={{ backgroundImage: `linear-gradient(to top, rgba(14, 26, 64, 0.9), transparent), url('https://picsum.photos/seed/library/1200/800')` }}
      >
        <h2 className="text-white text-3xl font-display font-bold italic drop-shadow-lg">Livro de Feitiços</h2>
        <p className="text-gold text-sm italic mt-1 font-sans uppercase tracking-widest">A arte arcana dos encantamentos</p>
      </div>

      <div className="p-4 grid grid-cols-1 gap-6">
        {SPELLS.map((spell) => (
          <SpellCard key={spell.id} spell={spell} />
        ))}
      </div>
    </div>
  );
}

function SpellCard({ spell }: { spell: Spell, key?: string }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="spell-card-glow parchment-card p-5 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="bg-primary/10 p-3 rounded-full text-primary">
          <span className="material-symbols-outlined text-3xl">{spell.icon}</span>
        </div>
        <div className="flex text-gold">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < spell.stars ? "fill-gold" : "text-gold/30"}`} 
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-display font-bold text-primary italic">{spell.name}</h3>
        <p className="text-[10px] text-gold font-sans font-bold uppercase tracking-wider mt-1">
          Nível de Dificuldade: {spell.difficulty}
        </p>
      </div>
      <p className="text-slate-700 text-sm leading-relaxed font-serif italic">
        {spell.description}
      </p>
      <button className="mt-2 w-full py-2 bg-primary text-gold text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors rounded-sm shadow-md">
        Estudar Encanto
      </button>
    </motion.div>
  );
}

function CreaturesScreen() {
  return (
    <div className="flex flex-col">
      <div 
        className="h-48 relative flex flex-col justify-end p-6 bg-cover bg-center border-b-4 border-gold"
        style={{ backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent), url('https://picsum.photos/seed/forest/1200/800')` }}
      >
        <h2 className="text-white text-3xl font-display font-bold italic drop-shadow-lg">Criaturas Mágicas</h2>
        <p className="text-gold text-sm italic mt-1 font-sans uppercase tracking-widest">Guia dos seres fantásticos</p>
      </div>

      <div className="p-4 grid grid-cols-1 gap-8">
        {CREATURES.map((creature) => (
          <CreatureCard key={creature.id} creature={creature} />
        ))}
      </div>
    </div>
  );
}

function CreatureCard({ creature }: { creature: Creature, key?: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="parchment-card overflow-hidden flex flex-col"
    >
      <div className="h-48 overflow-hidden border-b border-gold/30">
        <img 
          src={creature.image} 
          alt={creature.name} 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-2xl font-display font-bold text-primary italic">{creature.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Perigo:</span>
          <div className="flex text-gold">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < creature.danger ? "fill-gold" : "text-gold/30"}`} 
              />
            ))}
          </div>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed font-serif italic">
          {creature.description}
        </p>
        <button className="mt-2 w-full py-3 bg-primary text-gold font-display font-bold tracking-widest border border-gold hover:bg-primary/90 transition-colors uppercase text-xs">
          Ver Detalhes
        </button>
      </div>
    </motion.div>
  );
}
