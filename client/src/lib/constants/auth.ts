import discordIcon from '/discord.svg';
import googleIcon from '/google.svg';
import linkedinIcon from '/linkedin.svg';
import microsoftIcon from '/microsoft.svg';

/**
 * Authentication-related constants
 */

export const oauthProviders = [
  {
    provider: 'google',
    name: 'Google',
    icon: googleIcon,
  },
  {
    provider: 'azure',
    name: 'Microsoft',
    icon: microsoftIcon,
  },
  {
    provider: 'discord',
    name: 'Discord',
    icon: discordIcon,
  },
  {
    provider: 'linkedin_oidc',
    name: 'LinkedIn',
    icon: linkedinIcon,
  },
] as const;

export type OAuthProvider = (typeof oauthProviders)[number];
export type OAuthProviderName = (typeof oauthProviders)[number]['provider'];
