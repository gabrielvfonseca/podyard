import { Button } from "@podyard/design-system/components/ui/button";
import type { Dictionary } from "@podyard/internationalization";
import Link from "next/link";
import { env } from "@/env";

interface HeroProps {
  dictionary: Dictionary;
}

export const Hero = ({ dictionary }: HeroProps) => {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-center font-regular text-5xl tracking-tighter md:text-7xl">
              {dictionary.web.home.meta.title}
            </h1>
            <p className="max-w-2xl text-center text-lg text-muted-foreground leading-relaxed tracking-tight md:text-xl">
              {dictionary.web.home.meta.description}
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Get in touch</Link>
            </Button>
            <Button asChild size="lg">
              <Link href={env.NEXT_PUBLIC_APP_URL}>Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
