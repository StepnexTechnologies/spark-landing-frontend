import { NextRequest } from "next/server";
import TurndownService from "turndown";
import { getPostBySlug } from "@/lib/wordpress-improved";

export const revalidate = 3600;

export async function GET(
    _req: NextRequest,
    ctx: { params: Promise<{ slug: string }> }
) {
    const { slug } = await ctx.params;
    const post = await getPostBySlug(slug);
    if (!post) {
        return new Response("Not found", { status: 404 });
    }

    const td = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
        bulletListMarker: "-",
    });
    const body = td.turndown(post.content.rendered);
    const md =
        `# ${post.title.rendered}\n\n` +
        `> Source: https://www.sparkonomy.com/blogs/${post.slug}\n` +
        `> Published: ${post.date}\n\n` +
        body +
        "\n";

    return new Response(md, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
