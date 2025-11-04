import discordIcon from '../../src/assets/icons/discord.svg';
import googleIcon from '../../src/assets/icons/google.svg';
import linkedinIcon from '../../src/assets/icons/linkedin.svg';
import microsoftIcon from '../../src/assets/icons/microsoft.svg';

/**
 * Authentication-related constants
 */

export const oauthProviders = [
  {
    provider: 'google',
    name: 'Google',
    // 2. Use the imported variable instead of the static string path.
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
