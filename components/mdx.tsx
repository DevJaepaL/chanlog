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
    <div className="prose max-w-none break-keep text-body-md text-ink-secondary sm:text-body-lg prose-headings:font-bold prose-headings:text-ink prose-h1:mb-4 prose-h1:mt-14 prose-h1:text-heading-2 prose-h2:mb-4 prose-h2:mt-14 prose-h2:text-heading-2 prose-h3:mb-3 prose-h3:mt-9 prose-h3:text-title prose-h3:font-bold prose-p:my-5 prose-a:text-primary prose-a:underline-offset-4 prose-strong:text-ink prose-blockquote:rounded-xl prose-blockquote:border-l-0 prose-blockquote:bg-canvas-soft prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-ink-tertiary prose-pre:rounded-xl prose-img:rounded-xl prose-li:my-1.5">
      <Component components={{ ...components }} />
    </div>
  );
}
