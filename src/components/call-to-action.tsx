"use client"

import { Button } from '@/components/ui/button'
import { stages } from '@/config/stages';
import Link from 'next/link'
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

type CallToActionProps = {
  text: string;
};

export function CallToAction({ text }: CallToActionProps) {
  const { data: session } = useSession();
    return (
        <section>
            <div className="py-32 bg-muted">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="space-y-6 text-center">
                        <h2 className="text-foreground text-balance text-3xl font-semibold lg:text-4xl">{text}</h2>
                        <div className="flex justify-center gap-3">
              <Button
                asChild
                size="lg"
                disabled={!stages.accountCreation}
              >
                <Link
                  href="/user/signup"
                  onClick={(e) => {
                    if (!stages.accountCreation) {
                      e.preventDefault();
                    }
                  }}
                >
                  <span className="text-nowrap">Get Started</span>
                  <ChevronRight className="ml-1 h-4 w-4 opacity-60" />
                </Link>
              </Button>

              {!session && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  disabled={!stages.accountCreation}
                >
                  <Link
                    href="/user/login"
                    onClick={(e) => {
                      if (!stages.accountCreation) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <span className="text-nowrap">Log in</span>
                  </Link>
                </Button>
              )}
                        </div>
              {!stages.accountCreation && (
                <p className="text-sm text-muted-foreground">
                  Account creation is currently closed.
                </p>
              )}
                    </div>
                </div>
            </div>
        </section>
    )
}

