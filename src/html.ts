import type { Member } from "./types.ts";

const styles = `
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 16px;
        min-height: 100vh;
        color: #111;
        font-family: "Courier New", monospace;

        background-color: #eee;
        background-image: radial-gradient(
            rgba(0, 0, 0, 0.10) 0.5px,
            transparent 0.5px
        );
        background-size: 4px 4px;
    }

    .page {
        max-width: 1600px;
        margin: 0 auto;
    }

    header {
        border-bottom: 3px solid #111;
        padding-bottom: 14px;
        margin-bottom: 20px;
    }

    h1 {
        font-size: 1.5rem;
        margin: 0 0 6px;
    }

    .tagline {
        color: #555;
        font-size: 0.85rem;
        margin: 0;
    }

    .members {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
        gap: 14px;
    }

    .member-card {
        border: 2px solid #111;
        background: rgba(255, 255, 255, 0.75);
        min-height: 185px;
        padding: 14px 10px;

        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 8px;
    }

    .avatar {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border: 1px solid #111;
        background: white;
    }

    .member-card h2 {
        font-size: 0.9rem;
        margin: 0;
        overflow-wrap: anywhere;
    }

    .description {
        color: #555;
        font-size: 0.72rem;
        line-height: 1.4;
        margin: 0;
    }

    .member-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 5px 10px;
        margin-top: auto;
        font-size: 0.8rem;
    }

    a {
        color: #00e;
    }

    footer {
        border-top: 3px solid #111;
        margin-top: 20px;
        padding-top: 14px;
        text-align: center;
        font-size: 0.8rem;
    }

    .footer-links {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
        margin-top: 10px;
    }
`;

function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function safeHttpUrl(value: string): string | undefined {
    try {
        const url = new URL(value);

        if (url.protocol !== "https:" && url.protocol !== "http:") {
            return undefined;
        }

        return url.href;
    } catch {
        return undefined;
    }
}

function buildMemberCard(member: Member): string {
    const github = encodeURIComponent(member.github);
    const website = safeHttpUrl(member.website);
	const twitter = safeHttpUrl(member.twitter);
	const codeberg = safeHttpUrl(member.codeberg);

    const description = member.description
        ? `<p class="description">${escapeHtml(member.description)}</p>`
        : "";

    const websiteLink = website
        ? `<a href="${escapeHtml(website)}">Website</a>`
        : "";
	const twitterLink = twitter ? `<a href="${escapeHtml(twitter)}">X/Twitter</a>` : "";
	const codebergLink = codeberg ? `<a href="${escapeHtml(codeberg)}">codeberg</a>` : "";
	const emailLink = member.email
		? `<a href="mailto:${escapeHtml(member.email)}">Email</a>`
		: "";
    return `
        <article class="member-card">
            <img
                class="avatar"
                src="https://github.com/${escapeHtml(github)}.png"
                alt="avatar"
                loading="lazy"
            >

            <h2>${escapeHtml(member.name)}</h2>

            ${description}

            <nav class="member-links">
                ${websiteLink}
				${twitterLink}
				${codebergLink}
				${emailLink}
                <a href="https://github.com/${escapeHtml(github)}">GitHub</a>
            </nav>
        </article>
    `;
}

export function buildHtml(members: readonly Member[]): string {
    const memberCards = members
        .map(buildMemberCard)
        .join("\n");

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>My Webring</title>
            <style>${styles}</style>
        </head>

        <body>
            <div class="page">
                <header>
                    <h1>Webring</h1>
                    <p class="tagline">
                        A webring of ${members.length} members.
                    </p>
                </header>

                <main class="members">
                    ${memberCards}
                </main>

                <footer>
                    <div>
                        FMLF Webring &mdash;
                        <a href="/api/members">members list json</a> &mdash;
                        <a href="/api/random">random website</a>
                    </div>
                </footer>
            </div>
        </body>
        </html>
    `;
}
