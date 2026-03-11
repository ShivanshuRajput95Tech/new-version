import { useEffect, useState } from "react";
import {
  Layers,
  MessageSquare,
  Shield,
  Database,
  Wifi,
  Bell,
  Phone,
  CheckCircle2,
  Monitor,
  Server,
  Link,
  Route,
} from "lucide-react";
import { fetchPlatformProject, fetchPlatformReview } from "../api/platformApi";

const fallbackReview = {
  product: "Real-time Chat SaaS Platform",
  positioning: "Messaging infrastructure for applications",
  frontend: { focus: [], stack: [] },
  backend: { architecture: [], data: [], requirements: [] },
  mvp: [],
};

const fallbackProject = {
  name: "Connected Chat SaaS Prototype",
  status: "degraded",
  modules: [],
  roadmap: [],
};

const coreFeatures = [
  "Real-time text messaging",
  "Delivery/read status",
  "Replies, edit & delete",
  "Typing indicator",
  "Emoji reactions",
  "1-to-1 and group chat",
  "Media/file sharing",
  "Push notifications",
  "Voice/video calls",
];

export default function Developer() {
  const [review, setReview] = useState(fallbackReview);
  const [project, setProject] = useState(fallbackProject);

  useEffect(() => {
    const run = async () => {
      try {
        const [reviewData, projectData] = await Promise.all([
          fetchPlatformReview(),
          fetchPlatformProject(),
        ]);
        setReview(reviewData || fallbackReview);
        setProject(projectData || fallbackProject);
      } catch {
        setReview(fallbackReview);
        setProject(fallbackProject);
      }
    };
    run();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="text-indigo-300 text-sm font-semibold">Frontend + Backend Review</p>
          <h1 className="text-4xl font-black mt-2">{review.product}</h1>
          <p className="text-slate-300 mt-4">{review.positioning}</p>
          <div className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs">
            <Link size={14} className="text-emerald-400" />
            Project connection status:
            <span className={`font-semibold ${project.status === "active" ? "text-emerald-400" : "text-amber-400"}`}>{project.status}</span>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Route size={18} /> Connected Project Modules</h2>
          <p className="text-sm text-slate-400 mt-2">{project.name}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-white/10">
                  <th className="py-2 pr-3">Module</th>
                  <th className="py-2 pr-3">Owner</th>
                  <th className="py-2 pr-3">Endpoint</th>
                  <th className="py-2 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {project.modules.map((module) => (
                  <tr key={`${module.name}-${module.endpoint}`} className="border-b border-white/5">
                    <td className="py-2 pr-3">{module.name}</td>
                    <td className="py-2 pr-3 text-slate-300">{module.owner}</td>
                    <td className="py-2 pr-3 text-indigo-300">{module.endpoint}</td>
                    <td className="py-2 pr-3">
                      <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs">{module.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Monitor size={18} /> Frontend Design Focus</h2>
            <ul className="mt-4 space-y-2 text-slate-300 text-sm">
              {review.frontend.focus.map((item) => (
                <li key={item} className="flex items-start gap-2"><CheckCircle2 size={15} className="text-emerald-400 mt-0.5" />{item}</li>
              ))}
            </ul>
            <h3 className="font-semibold mt-5">Recommended Frontend Stack</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {review.frontend.stack.map((item) => (
                <span key={item} className="px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-200 text-xs">{item}</span>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Server size={18} /> Backend Design Focus</h2>
            <h3 className="font-semibold mt-4 text-sm text-slate-200">Architecture Components</h3>
            <ul className="mt-2 space-y-1 text-slate-300 text-sm">
              {review.backend.architecture.map((item) => <li key={item}>• {item}</li>)}
            </ul>
            <h3 className="font-semibold mt-4 text-sm text-slate-200">Data & Infrastructure</h3>
            <ul className="mt-2 space-y-1 text-slate-300 text-sm">
              {review.backend.data.map((item) => <li key={item}>• {item}</li>)}
            </ul>
            <h3 className="font-semibold mt-4 text-sm text-slate-200">Operational Requirements</h3>
            <ul className="mt-2 space-y-1 text-slate-300 text-sm">
              {review.backend.requirements.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </article>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Layers size={18} /> High-Level SaaS Architecture</h2>
          <div className="mt-4 rounded-xl bg-slate-900 border border-white/10 p-4 text-sm text-slate-300 overflow-x-auto">
            <pre>{`Client SDKs (Web / Mobile)
        │
        ▼
API Gateway
        │
 ┌───────────────┬───────────────┬───────────────┐
 ▼               ▼               ▼
Auth Service     Chat Service    Presence Service
 ▼               ▼               ▼
Database       Message Queue       Cache
        ▼
   Media Storage`}</pre>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><MessageSquare size={18} /> Core Product Features</h2>
            <ul className="mt-4 space-y-2 text-slate-300 text-sm">
              {coreFeatures.map((item) => (
                <li key={item} className="flex items-start gap-2"><CheckCircle2 size={15} className="text-emerald-400 mt-0.5" />{item}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><Bell size={18} /> Suggested MVP Scope</h2>
            <ol className="mt-4 space-y-2 text-slate-300 text-sm list-decimal list-inside">
              {review.mvp.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <h2 className="text-xl font-bold flex items-center gap-2 mt-6"><Wifi size={18} /> Realtime Layer</h2>
            <p className="text-slate-300 mt-2 text-sm">WebSockets / Socket.IO for bidirectional low-latency communication.</p>
            <h2 className="text-xl font-bold flex items-center gap-2 mt-6"><Database size={18} /> Security & Moderation</h2>
            <p className="text-slate-300 mt-2 text-sm">Token auth, tenant isolation, RBAC, rate limiting, and moderation hooks.</p>
          </article>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Phone size={18} /> Basic Delivery Flow</h2>
          <ol className="mt-4 space-y-2 text-slate-300 text-sm list-decimal list-inside">
            <li>Tenant application authenticates with API key/token.</li>
            <li>Client opens WebSocket connection and joins channel.</li>
            <li>Message is accepted via API and persisted.</li>
            <li>Message fan-out is published to recipients.</li>
            <li>Offline users receive push notifications and later sync.</li>
          </ol>
          <h2 className="text-xl font-bold flex items-center gap-2 mt-6"><Shield size={18} /> Monetization Model</h2>
          <p className="text-slate-300 mt-2 text-sm">Tiered SaaS pricing by MAU, message volume, API requests, and storage.</p>
          <h2 className="text-xl font-bold flex items-center gap-2 mt-6"><CheckCircle2 size={18} /> Next Roadmap</h2>
          <ul className="mt-2 space-y-2 text-slate-300 text-sm">
            {project.roadmap.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
