import Script from "next/script";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const PIXEL_LOADER = (id: string) => `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');
`.trim();

export default function MetaPixelScript() {
  if (!META_PIXEL_ID) return null;

  return (
    <>
      {/* Warm up the Meta Pixel origin so the deferred fbevents.js fetch
          doesn't pay a fresh DNS+TLS round-trip when the loader fires. */}
      <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="" />
      <link rel="dns-prefetch" href="https://connect.facebook.net" />

      {/* lazyOnload defers the loader (and the fbevents.js fetch it kicks
          off) until after window 'load', so it doesn't compete with hydration
          for main-thread time. PageView still fires within the session and
          subsequent fbq() calls work normally — the loader sets up a queue
          stub so calls before fbevents.js arrives are replayed. */}
      <Script id="meta-pixel" strategy="lazyOnload">
        {PIXEL_LOADER(META_PIXEL_ID)}
      </Script>

      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
