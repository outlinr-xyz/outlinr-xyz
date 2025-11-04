/**
 * Authentication-related constants
 */

export const oauthProviders = [
  {
    provider: 'google',
    name: 'Google',
    icon: 'https://www.svgrepo.com/show/475656/google-color.svg',
  },
  {
    provider: 'azure',
    name: 'Microsoft',
    icon: 'https://www.svgrepo.com/show/448239/microsoft.svg',
  },
  {
    provider: 'discord',
    name: 'Discord',
    icon: 'https://www.svgrepo.com/show/353655/discord-icon.svg',
  },
  {
    provider: 'linkedin_oidc',
    name: 'LinkedIn',
    icon: 'https://www.svgrepo.com/show/448234/linkedin.svg',
  },
] as const;

export type OAuthProvider = (typeof oauthProviders)[number];
export type OAuthProviderName = (typeof oauthProviders)[number]['provider'];
