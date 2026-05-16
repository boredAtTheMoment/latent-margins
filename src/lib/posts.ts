import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export function publishedPosts(posts: BlogPost[]) {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatPostDate(date: Date) {
  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en", {
    year: "numeric",
    month: "long"
  });
}

export function groupPostsByMonth(posts: BlogPost[]) {
  const groups = new Map<string, BlogPost[]>();

  for (const post of posts) {
    const key = formatMonthYear(post.data.pubDate);
    groups.set(key, [...(groups.get(key) ?? []), post]);
  }

  return [...groups.entries()].map(([label, items]) => ({ label, items }));
}

export function tagCounts(posts: BlogPost[]) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 225));

  return `${minutes} min read`;
}
