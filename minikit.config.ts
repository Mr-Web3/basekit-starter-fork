const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
*/
export const minikitConfig = {
  accountAssociation: {
    header:
      'eyJmaWQiOjc4ODgwMCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDQzOTI5OEVmQUQzMEY2MjgyMWM4NWI2NUFkNzVlN0MwNDFlMzY2RDcifQ',
    payload: 'eyJkb21haW4iOiJiYXNla2l0LXN0YXJ0ZXItaW1wcm92ZWQudmVyY2VsLmFwcCJ9',
    signature:
      'R2gd0o7wd/z/J1BHj+llK5lV8yT72Bf4R57Hz80wE19BHFwV/iH5LJIOqPAivphDZ8m7d9mUJgzF+xrsE4G8sRs=',
  },
  baseBuilder: {
    allowedAddresses: ['0x1d0B2cfeBaBB59b3AF59ff77DeF5397Ce4Be9e77'],
  },
  miniapp: {
    version: '1',
    name: 'MiniForge',
    subtitle: 'MiniForge Builder Template',
    description:
      'A complete starter template for building dApp, Base and Farcaster Mini Apps.',
    screenshotUrls: [`${ROOT_URL}/screenshot1.jpg`, `${ROOT_URL}/screenshot2.jpg`, `${ROOT_URL}/screenshot3.jpg`],
    iconUrl: `${ROOT_URL}/newBrand.png`,
    splashImageUrl: `${ROOT_URL}/newBrand.png`,
    splashBackgroundColor: '#000000',
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: 'education',
    tags: ['education', 'learning', 'tutorials', 'guides', 'documentation'],
    heroImageUrl: `${ROOT_URL}/newBrand.png`,
    tagline: 'MiniForge Builder Template',
    ogTitle: 'MiniForge Builder Template',
    ogDescription: 'A complete starter template for building dApp, Base and Farcaster Mini Apps.',
    ogImageUrl: `${ROOT_URL}/newBrand.png`,
    noindex: false,
  },
} as const;

