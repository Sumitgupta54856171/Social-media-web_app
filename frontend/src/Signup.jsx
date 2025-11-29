
import { useContext,useState ,useEffect} from "react";
import { Authcontext } from "./context";
import { User, Mail, Lock, Eye, EyeOff, Facebook, Chrome, ArrowRight, Sparkles } from "lucide-react";


// -------------------------------------------

// UNCOMMENT YOUR REAL IMPORT:
// import { Authcontext } from "./context";

function Signup() {
    // --- YOUR ORIGINAL LOGIC (UNCHANGED) ---
    const { register,message } = useContext(Authcontext);
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [username, setusername] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        register(username, email, password);
    };
    // ---------------------------------------

    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#F3F4F6] flex items-center justify-center p-4 font-sans relative overflow-hidden">

            {/* Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

            {/* Main Card */}
            <div className={`
        w-full max-w-[1100px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] z-10
        transition-all duration-1000 ease-out transform
        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
      `}>

                {/* LEFT SIDE: Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative bg-white">

                    {/* Logo/Brand (Top Left) */}
                    <div className={`absolute top-8 left-8 flex items-center gap-2 transition-opacity duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">N</div>
                        <span className="font-bold text-slate-800 tracking-tight">Nebula</span>
                    </div>

                    <div className="max-w-[380px] mx-auto w-full mt-12 md:mt-0">

                        {/* Header Section */}
                        <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                                Create Account
                            </h1>
                            <p className="text-slate-500 mb-8 text-base leading-relaxed">
                                Join the galaxy of productivity. It only takes a minute.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Username Input */}
                            <div
                                className={`group transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                            >
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Username</label>
                                <div className={`
                  relative flex items-center bg-slate-50 border rounded-xl overflow-hidden transition-all duration-300
                  ${focusedField === 'username' ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white' : 'border-slate-200 hover:border-slate-300'}
                `}>
                                    <div className="pl-4 text-slate-400">
                                        <User size={20} strokeWidth={1.5} className={`${focusedField === 'username' ? 'text-blue-500' : ''} transition-colors`} />
                                    </div>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setusername(e.target.value)}
                                        onFocus={() => setFocusedField('username')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full py-3.5 px-4 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                                        placeholder="johndoe"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div
                                className={`group transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                            >
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                                <div className={`
                  relative flex items-center bg-slate-50 border rounded-xl overflow-hidden transition-all duration-300
                  ${focusedField === 'email' ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white' : 'border-slate-200 hover:border-slate-300'}
                `}>
                                    <div className="pl-4 text-slate-400">
                                        <Mail size={20} strokeWidth={1.5} className={`${focusedField === 'email' ? 'text-blue-500' : ''} transition-colors`} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setemail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full py-3.5 px-4 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                                        placeholder="hello@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div
                                className={`group transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                            >
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                                <div className={`
                  relative flex items-center bg-slate-50 border rounded-xl overflow-hidden transition-all duration-300
                  ${focusedField === 'password' ? 'border-blue-500 ring-4 ring-blue-500/10 bg-white' : 'border-slate-200 hover:border-slate-300'}
                `}>
                                    <div className="pl-4 text-slate-400">
                                        <Lock size={20} strokeWidth={1.5} className={`${focusedField === 'password' ? 'text-blue-500' : ''} transition-colors`} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setpassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full py-3.5 px-4 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="pr-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                                    </button>
                                </div>
                            </div>

                            {/* Main Button */}
                            <div className={`transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="group w-full bg-[#0F172A] text-white rounded-xl py-3.5 font-bold shadow-lg shadow-slate-900/20 hover:shadow-slate-900/40 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden relative"
                                >
                                    <span className="relative z-10">Sign Up</span>
                                    <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />

                                    {/* Subtle shine effect on hover */}
                                    <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className={`relative py-2 transition-all duration-700 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                                <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-slate-400 font-medium">OR SIGN UP WITH</span></div>
                            </div>

                            {/* Socials */}
                            <div className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-[800ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <button type="button" className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 group">
                                    <Chrome size={20} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">Google</span>
                                </button>
                                <button type="button" className="flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 group">
                                    <Facebook size={20} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
                                    <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">Facebook</span>
                                </button>
                            </div>

                            <p className={`text-center text-slate-500 text-sm mt-6 transition-all duration-700 delay-[900ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                                Already have an account? <a href="#" className="text-blue-600 font-semibold hover:underline">Log In</a>
                            </p>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDE: Clean Cosmic Art (Slightly different elements for Signup) */}
                <div className="hidden md:block w-1/2 relative overflow-hidden bg-[#050b14]">

                    {/* CSS Stars Background */}
                    <div className="absolute inset-0 stars-container">
                        {[...Array(30)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute bg-white rounded-full animate-twinkle"
                                style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 2 + 1}px`,
                                    height: `${Math.random() * 2 + 1}px`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    opacity: Math.random() * 0.7
                                }}
                            />
                        ))}
                    </div>

                    {/* Nebula Gradients (Warmer tones for Signup) */}
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-float-slow"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[100px] mix-blend-screen animate-float-reverse"></div>

                    {/* Glass Card Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-12 z-10">
                        <div className={`
               p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl max-w-sm w-full
               transition-all duration-1000 delay-500 transform text-center
               ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
             `}>
                            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                                <Sparkles className="text-white w-8 h-8 animate-pulse" />
                            </div>

                            <h3 className="text-white font-bold text-xl mb-3">Start Your Journey</h3>
                            <p className="text-indigo-100/70 text-sm leading-relaxed mb-6">
                                Join thousands of creators and teams who are building the future with Nebula.
                            </p>

                            <div className="flex justify-center -space-x-3">
                                {[1,2,3,4].map((_,i) => (
                                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#050b14] bg-gray-800 overflow-hidden z-${10-i}`}>
                                        <img src={`https://i.pravatar.cc/100?img=${10+i}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-[#050b14] bg-white flex items-center justify-center text-xs font-bold text-slate-800 z-0">
                                    +2k
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* Custom CSS for Animations */}
            <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 50px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, -40px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-float-slow {
          animation: float-slow 18s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 15s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 5s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
        </div>
    );
}

export default Signup;