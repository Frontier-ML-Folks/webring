import memberData from "./data/member.json"
import type { Member } from "./types.ts"
import { buildHtml } from "./html.ts"

type Redirection = "prev" | "next" | "random";

const members: Member[] = memberData.members;

function getRedirectMember(from : string | null , redirection: Redirection): Member | undefined {

    if (members.length < 2) return undefined;

	if (redirection === "random") {
		if (from) {
			const index = members.findIndex(
				member => member.id === from
			);

			if (index === -1 ) {
				return undefined;
			}

			const offset = 1 + Math.floor(
				Math.random() * (members.length - 1)
			);

			return members[(index + offset) % members.length];
		}
		return members[
			Math.floor(Math.random() * members.length)
		];
	}

    if (!from) return undefined;

	const index = members.findIndex(
		member => member.id === from
	);

	if (index === -1 ) {
		return undefined;
	}

	switch(redirection) {

		case "prev": {
			const prevIndex = (index - 1 + members.length ) % members.length;

			return members[prevIndex ];
		}
		case "next": {
			const nextIndex = (index + 1 ) % members.length;

			return members[nextIndex];
		}
	}
}


function navigate(url: URL, redirection: Redirection): Response {
	const from = url.searchParams.get("from");
	if (redirection !== "random" && !from) {
		return new Response("Missing member ID", {
			status: 400
		});
	}

	const redir = getRedirectMember(from, redirection);

	console.log(redir);
	if(!redir) {
		return new Response("Member n!!ot found", {
			status: 404
		});
	}
	return Response.redirect(redir.website, 302);
}

export default {
	async fetch(request, env, ctx): Promise<Response> {

		const url = new URL(request.url);
		const from = url.searchParams.get("from");
		if (url.pathname === "/") {

			const html = buildHtml(members);

			return new Response(html, {
				headers: {
					"Content-Type": "text/html; charset=utf-8",
				},
			});
		}
		if (url.pathname === "/api/members") {
			return Response.json(members);
		}

		if (url.pathname === "/api/next") {
			return navigate(url, "next");
		}

		if (url.pathname === "/api/prev") {
			return navigate(url, "prev");
		}
		if (url.pathname === "/api/random") {
			return navigate(url, "random");
		}
		return new Response("Not Found", {
			status: 404
		});
	},
} satisfies ExportedHandler<Env>;
