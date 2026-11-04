'use client'
import React, { useEffect } from "react"
import { conference } from "@/config/conference"

export default function News() {

    useEffect(() => {
        if (!document.querySelector('script[src="https://w.behold.so/widget.js"]')) {
            const script = document.createElement("script");
            script.type = "module";
            script.src = "https://w.behold.so/widget.js";
            document.head.appendChild(script);
        }
    }, []);

    return (
        <section>
            <div className="bg-muted/50 py-24">
                <div className="mx-auto w-full max-w-5xl px-6">
                    <div>
                        <span className="text-primary">Latest News</span>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold">Check our instagram for the latest news!</h2>
                        <p className="text-muted-foreground mb-12 mt-4 text-lg">The secretariat is working day and night to bring your favourite conference back.</p>
                    </div>
                    <div className="border-foreground/5 space-y-6 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)] sm:space-y-0 sm:divide-y">
                        {/* A custom element from the script loaded above, so TypeScript doesn't know about it */}
                        {/* @ts-expect-error behold-widget isn't a known JSX element */}
                        <behold-widget feed-id={conference.beholdFeedId}></behold-widget>
                    </div>
                </div>
            </div>
        </section>
    )
}
