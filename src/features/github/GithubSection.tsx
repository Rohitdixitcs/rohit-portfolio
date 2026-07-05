import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiGithub, FiStar, FiGitBranch, FiUsers, FiExternalLink, FiCode, FiClock } from "react-icons/fi";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ENV } from "@/lib/env";
import { trackEvent } from "@/lib/analytics";

interface GhUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GhRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  fork: boolean;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  "C++": "#f34b7d",
  Java: "#b07219",
  Shell: "#89e051",
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function StatCard({ icon: Icon, label, value, delay }: { icon: React.ElementType; label: string; value: string | number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 flex items-center gap-4 hover:border-primary/30 transition-colors"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
      </div>
      <div>
        <div className="font-display font-bold text-3xl text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  );
}

export function GithubSection() {
  const username = ENV.GITHUB_USERNAME;
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`),
        ]);
        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API request failed");
        const userData: GhUser = await userRes.json();
        const repoData: GhRepo[] = await reposRes.json();
        if (cancelled) return;
        setUser(userData);
        setRepos(repoData.filter((r) => !r.fork));
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    load();
    return () => { cancelled = true; };
  }, [username]);

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const languageCounts = repos.reduce<Record<string, number>>((acc, r) => {
    if (r.language) acc[r.language] = (acc[r.language] ?? 0) + 1;
    return acc;
  }, {});
  const topLanguages = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxLangCount = topLanguages[0]?.[1] ?? 1;

  const featuredRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 3);
  const recentActivity = [...repos]
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 4);

  const profileUrl = `https://github.com/${username}`;

  return (
    <SectionWrapper id="github" label="GitHub">
      <SectionHeader
        eyebrow="Live from GitHub"
        title="Open Source"
        description={`Real-time stats pulled directly from the public GitHub API for @${username}.`}
      />

      {status === "error" && (
        <div className="text-center py-14 rounded-3xl border border-white/[0.07] bg-white/[0.02]">
          <FiGithub className="w-9 h-9 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-base mb-4">
            Couldn't reach the GitHub API right now — view the profile directly instead.
          </p>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="CODE"
            onClick={() => trackEvent("github_click")}
            className="inline-flex items-center gap-1.5 text-primary font-medium"
          >
            github.com/{username} <FiExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {status !== "error" && (
        <>
          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8 rounded-3xl bg-white/[0.03] border border-white/[0.07] mb-10 backdrop-blur-xl"
          >
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0 bg-white/[0.05]">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name ?? username} width={96} height={96} loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center animate-pulse bg-white/[0.05]" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display font-bold text-2xl text-foreground">{user?.name ?? `@${username}`}</h3>
              <p className="text-muted-foreground text-sm mt-1">@{username}</p>
              {user?.bio && <p className="text-muted-foreground text-sm mt-3 max-w-lg">{user.bio}</p>}
            </div>
            <Button
              href={profileUrl}
              external
              data-cursor="CODE"
              data-magnetic
              onClick={() => trackEvent("github_click")}
              variant="glass"
              icon={<FiExternalLink className="w-4 h-4" />}
              iconPosition="right"
            >
              View GitHub Profile
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={FiGithub} label="Public Repositories" value={status === "ready" ? user?.public_repos ?? repos.length : "—"} delay={0} />
            <StatCard icon={FiStar} label="Total Stars" value={status === "ready" ? totalStars : "—"} delay={0.05} />
            <StatCard icon={FiUsers} label="Followers" value={status === "ready" ? user?.followers ?? 0 : "—"} delay={0.1} />
            <StatCard icon={FiGitBranch} label="Following" value={status === "ready" ? user?.following ?? 0 : "—"} delay={0.15} />
          </div>

          <div className="grid lg:grid-cols-5 gap-6 mb-10">
            {/* Featured repositories */}
            <div className="lg:col-span-3">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">Featured Repositories</h3>
              <div className="space-y-3">
                {status === "loading" &&
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
                  ))}
                {status === "ready" && featuredRepos.length === 0 && (
                  <p className="text-sm text-muted-foreground">No public repositories yet.</p>
                )}
                {status === "ready" &&
                  featuredRepos.map((repo, i) => (
                    <motion.a
                      key={repo.id}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="CODE"
                      onClick={() => trackEvent("github_click")}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="block p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-primary/30 hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display font-medium text-base text-foreground group-hover:text-primary transition-colors truncate">
                            {repo.name}
                          </p>
                          {repo.description && (
                            <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{repo.description}</p>
                          )}
                        </div>
                        <FiExternalLink className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 mt-1" />
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ background: LANGUAGE_COLORS[repo.language] ?? "#818cf8" }} />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1"><FiStar className="w-3.5 h-3.5" /> {repo.stargazers_count}</span>
                        <span className="flex items-center gap-1"><FiGitBranch className="w-3.5 h-3.5" /> {repo.forks_count}</span>
                      </div>
                    </motion.a>
                  ))}
              </div>
            </div>

            {/* Top languages */}
            <div className="lg:col-span-2">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <FiCode className="w-5 h-5 text-primary" /> Top Languages
              </h3>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] space-y-4">
                {status === "loading" && <div className="h-40 animate-pulse bg-white/[0.03] rounded-xl" />}
                {status === "ready" && topLanguages.length === 0 && (
                  <p className="text-sm text-muted-foreground">No language data available yet.</p>
                )}
                {status === "ready" &&
                  topLanguages.map(([lang, count]) => (
                    <div key={lang}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-foreground font-medium">{lang}</span>
                        <span className="text-muted-foreground">{count} repos</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: LANGUAGE_COLORS[lang] ?? "#818cf8" }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(count / maxLangCount) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                {status === "ready" && (
                  <Badge variant="success" dot pulse className="mt-2">Live data · updates on page load</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Recent activity */}
          {status === "ready" && recentActivity.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <FiClock className="w-5 h-5 text-primary" /> Recent Activity
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {recentActivity.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="CODE"
                    onClick={() => trackEvent("github_click")}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 transition-colors text-sm"
                  >
                    <span className="text-foreground font-medium truncate">{repo.name}</span>
                    <span className="text-muted-foreground text-xs flex-shrink-0">{timeAgo(repo.pushed_at)}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </SectionWrapper>
  );
}
