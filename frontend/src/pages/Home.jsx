import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MessageCircle,
  ShieldCheck,
  Download,
  Check,
  Play,
  Star,
  ArrowRight,
  ChevronUp,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const navItems = ["Messenger", "Blog", "Email templates", "Authentication", "Bonus page"];

const features = [
  "Customer First Content-focused Displaying Effects",
  "High Definition full-screen & Background",
  "Try for Free, Forever!",
];

const experts = ["Project Manager", "Product Designer", "Marketing Lead", "Engineering Lead"];

const themeFeatures = [
  {
    title: "Color and font variety choices",
    desc: "Effortlessly modify colors and fonts, or select from available choices.",
  },
  {
    title: "RTL Support",
    desc: "Supports multi-languages and direction-aware layouts including RTL interfaces.",
  },
  {
    title: "Dark extension",
    desc: "Dark mode and extension-friendly patterns to scale your interface system.",
  },
];

const pricingPlans = [
  {
    name: "Advanced",
    price: "$90.00",
    desc: "Instant message delivery. Typing indicators to show when the other party is typing.",
    points: ["Chat Support", "Integration With CRM", "Customer Service Priority"],
  },
  {
    name: "Free Plan",
    price: "$70.00",
    desc: "Responsive design for various devices (desktop, tablet, mobile).",
    points: ["Concurrent Chats", "File Sharing", "Custom Branding"],
  },
  {
    name: "Professional",
    price: "$110.00",
    desc: "Ability to send and receive images, files, and other multimedia.",
    points: ["Multi-language Support", "Chat History Storage", "Security features"],
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-slate-950/85 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight">Chatzy</h1>
          <nav className="hidden lg:flex items-center gap-6 text-sm text-slate-300">
            {navItems.map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </nav>
          <Link
            to={isAuthenticated ? "/chat" : "/login"}
            className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold"
          >
            {isAuthenticated ? "Open Chat" : "Sign in"}
          </Link>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-indigo-300">
              <MessageCircle size={14} /> Chat Messenger Template
            </p>
            <h2 className="mt-4 text-4xl md:text-5xl font-black leading-tight">
              Easy to use our <span className="text-indigo-400">chat app</span> attractive and clean design
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl">
              Desktop app style experience with dark and light aesthetics, modern interaction blocks, and landing sections inspired by Chatzy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#" className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold inline-flex items-center gap-2">
                <Download size={16} /> Documentation
              </a>
              <a href="#" className="px-5 py-3 rounded-xl border border-white/20 hover:border-white/40 inline-flex items-center gap-2">
                <Play size={16} /> App stores
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 to-violet-500/10 p-6">
            <div className="grid grid-cols-2 gap-4">
              {["Messenger", "Calls", "Files", "Groups"].map((card) => (
                <div key={card} className="h-28 rounded-2xl bg-slate-900/70 border border-white/10 p-4 flex items-end font-semibold">
                  {card}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-indigo-300 font-semibold">Exclusive Features</p>
            <h3 className="text-3xl font-black mt-2">We Provide Best Feature For App Design And Coding</h3>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-28 rounded-2xl bg-white/5 border border-white/10" />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white text-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-3xl bg-slate-100 border border-slate-200 p-6 h-80" />
            <div>
              <h3 className="text-3xl font-black">All-in-one responsive app for you</h3>
              <p className="mt-3 text-slate-600">
                Built for product presentation, team communication, and social-ready experiences.
              </p>
              <ul className="mt-6 space-y-3">
                {features.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="text-emerald-500 mt-0.5" size={18} />
                    <p className="font-semibold">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-indigo-300 font-semibold">See Our Team work</p>
            <h3 className="text-4xl font-black mt-2">Efficient teamwork for every enterprise</h3>
            <p className="mt-3 text-slate-300">Offer help with branding campaigns, product presentation, and social media advertisements.</p>
            <a href="#" className="mt-6 inline-flex px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-semibold">Chatzy for enterprise</a>
          </div>
          <div className="h-80 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 to-purple-500/15" />
        </section>

        <section className="bg-slate-900/60 py-16 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <p className="text-indigo-300 font-semibold">Our Team</p>
              <h3 className="text-4xl font-black mt-2">Our experts</h3>
            </div>
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {experts.map((role) => (
                <article key={role} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="h-36 rounded-xl bg-slate-800" />
                  <p className="mt-4 text-sm text-indigo-300">{role}</p>
                  <h4 className="font-semibold">Advanced Equipment</h4>
                  <p className="text-sm text-slate-300 mt-1">Lorem Ipsum is simply dummy text of the printing industry.</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            {themeFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-semibold">{f.title}</h4>
                <p className="text-sm text-slate-300 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="h-80 rounded-3xl border border-white/10 bg-slate-900/70" />
        </section>

        <section className="bg-slate-900 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-indigo-300"><ShieldCheck size={16} /> Secure Your Messages</p>
              <h3 className="text-3xl font-black mt-2">The world's top secure App</h3>
              <p className="text-slate-300 mt-3">Easy to use chat app with dark & light themes, recent chats, and secure communication UX.</p>
            </div>
            <div className="rounded-3xl bg-gradient-to-r from-indigo-500/15 to-violet-500/15 border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Top Trending Template</p>
                <Star className="text-amber-300" size={18} />
              </div>
              <p className="mt-2 text-slate-300 text-sm">Overall best rated style direction with clean landing sections.</p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <p className="text-indigo-300 font-semibold">Choose your pricing plan</p>
            <h3 className="text-4xl font-black mt-2">Affordable for everyone!</h3>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <p className="text-indigo-300 font-semibold">{plan.name}</p>
                <p className="text-3xl font-black mt-2">{plan.price}<span className="text-sm text-slate-400"> / Month</span></p>
                <p className="text-sm text-slate-300 mt-2">{plan.desc}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {plan.points.map((point) => (
                    <li key={point} className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> {point}</li>
                  ))}
                </ul>
                <button className="mt-6 w-full px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-semibold inline-flex items-center justify-center gap-2">
                  Get Started <ArrowRight size={14} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <h3 className="text-3xl font-black">Subscribe our newsletter get new update.</h3>
              <p className="text-slate-300 mt-2">Subscribe our newsletter to stay updated every moment.</p>
              <div className="mt-5 max-w-xl mx-auto flex gap-2">
                <input className="flex-1 rounded-xl bg-slate-900 border border-white/10 px-4 py-3" placeholder="Email" />
                <button className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-semibold">Submit</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 lg:grid-cols-5 gap-8 text-sm">
          <div className="lg:col-span-2">
            <h4 className="text-xl font-bold">Chatzy</h4>
            <p className="text-slate-300 mt-3 max-w-sm">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a classical source.</p>
            <div className="flex gap-2 mt-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-white/10 grid place-items-center"><Icon size={16} /></button>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-semibold">Useful Links</h5>
            <ul className="space-y-2 mt-3 text-slate-300">
              <li>Home</li><li>About us</li><li>Services</li><li>Blog</li><li>Contact</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Chatzy Help</h5>
            <ul className="space-y-2 mt-3 text-slate-300">
              <li>Privacy Policy</li><li>FAQ</li><li>Support</li><li>Contact</li><li>Term</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold">Download For</h5>
            <ul className="space-y-2 mt-3 text-slate-300">
              <li>Windows</li><li>Linux</li><li>iOS</li><li>Android</li><li>Mac</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4">
          <div className="max-w-7xl mx-auto px-6 text-xs text-slate-400 flex flex-col md:flex-row gap-2 justify-between">
            <p>© 2024 Chatzy. All Right Reserved</p>
            <p>Made with ♥ By Template Pixelstrap</p>
          </div>
        </div>
      </footer>

      <button className="fixed bottom-5 right-5 w-10 h-10 rounded-full bg-indigo-500 text-white grid place-items-center shadow-lg">
        <ChevronUp size={18} />
      </button>
    </div>
  );
}
