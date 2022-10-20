import Head from 'next/head';

const imageUrl =
  'https://res.cloudinary.com/db0lf6jpc/image/upload/v1666278975/Screen_Shot_2022-10-20_at_9.58.46_AM_dfcznf.png';

const title = 'T-Account Helper';

export default function Seo() {
  return (
    <Head>
      <title>{title}</title>
      <meta name='title' content='T-Account Helper' />
      <meta
        name='description'
        content='An easy-to-use web app for working with T-Accounts and double-entry bookkeeping for accountants.'
      />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content='https://t-acct-helper.vercel.app/' />
      <meta property='og:title' content='T-Account Helper' />
      <meta
        property='og:description'
        content='An easy-to-use web app for working with T-Accounts and double-entry bookkeeping for accountants.'
      />
      <meta property='og:image' content={imageUrl} />

      {/* Twitter */}
      {/* <meta property="twitter:card" content="summary_large_image"/> */}
      <meta
        property='twitter:url'
        content='https://t-acct-helper.vercel.app/'
      />
      <meta property='twitter:title' content='T-Account Helper' />
      <meta
        property='twitter:description'
        content='An easy-to-use web app for working with T-Accounts and double-entry bookkeeping for accountants.'
      />
      <meta property='twitter:image' content={imageUrl} />
    </Head>
  );
}
