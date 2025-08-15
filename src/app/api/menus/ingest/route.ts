import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

function parsePrice(text: string): number | null {
	const match = text.match(/\$?\s*(\d+[\.,]?\d{0,2})/);
	if (!match) return null;
	return Number(match[1].replace(",", "."));
}

type ParsedItem = { name: string; description: string | null; category: string | null; price: number };

function heuristicParse(text: string): ParsedItem[] {
	const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
	const items: ParsedItem[] = [];
	for (const line of lines) {
		const price = parsePrice(line);
		if (price !== null) {
			const name = line.replace(/\$?\s*\d+[\.,]?\d{0,2}.*/, "").trim();
			items.push({ name, description: null, category: null, price });
		}
	}
	return items;
}

export async function POST(req: Request) {
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.headers.get("cookie")?.split("; ")
                        .find((c) => c.startsWith(`${name}=`))
                        ?.split("=")[1];
                },
            },
        }
    );
	const { data: userData } = await supabase.auth.getUser();
	if (!userData.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

	const contentType = req.headers.get("content-type") || "";
	if (!contentType.includes("multipart/form-data")) {
		return NextResponse.json({ error: "invalid content type" }, { status: 400 });
	}
	const form = await req.formData();
	const file = form.get("file");
	const preview = String(form.get("preview") || "true") === "true";
	const restaurantId = String(form.get("restaurantId") || "");

	if (!(file instanceof File)) {
		return NextResponse.json({ error: "file required" }, { status: 400 });
	}
	const buffer = Buffer.from(await file.arrayBuffer());
	const { default: pdf } = await import("pdf-parse");
	const parsed = await pdf(buffer);
	const items = heuristicParse(parsed.text);

	if (preview) {
		return NextResponse.json({ items });
	}
	if (!restaurantId) return NextResponse.json({ error: "restaurantId required" }, { status: 400 });
	if (items.length > 0) {
		await supabase
			.from("menu_items")
			.insert(items.map((it) => ({ ...it, restaurant_id: restaurantId })));
	}
	return NextResponse.json({ inserted: items.length });
}


