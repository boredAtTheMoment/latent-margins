import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { withBase } from "../lib/paths";

export async function GET(context) {
  const posts = (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: "Latent Margins",
    description: "Technical writing with code, diagrams, citations, and experiments.",
    site: new globalThis.URL(withBase("/"), context.site).toString(),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: withBase(`/blog/${post.slug}/`)
    }))
  });
}
