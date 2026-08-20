import { useMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import Link from "next/link";

function CustomLink(props: any) {
  const href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function CustomImage(props: any) {
  return (
    <Image alt={props.alt} {...props} className="mx-auto rounded-md" priority />
  );
}

const components = {
  a: CustomLink,
  Image: CustomImage,
};

export function Mdx({ code }: { code: string }) {
  const Component = useMDXComponent(code);

  return (
    <article className="prose prose-sm max-w-none break-keep text-ink-secondary prose-headings:text-ink prose-a:text-primary sm:prose-base">
      <Component components={{ ...components }} />
    </article>
  );
}
