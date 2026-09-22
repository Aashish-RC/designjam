import type { NodeLayout } from './types.ts';

/**
 * Fixture 1: User Profile Card Frame
 */
export const userProfileCardFixture: NodeLayout = {
  name: 'UserProfileCard',
  type: 'frame',
  layoutMode: 'flex',
  flexDirection: 'column',
  gap: 16,
  paddingTop: 24,
  paddingRight: 24,
  paddingBottom: 24,
  paddingLeft: 24,
  borderRadius: 16,
  backgroundColor: '#1e293b',
  borderColor: '#334155',
  borderWidth: 1,
  children: [
    {
      name: 'UserAvatar',
      type: 'frame',
      width: 48,
      height: 48,
      borderRadius: 999,
      backgroundColor: '#3b82f6',
    },
    {
      name: 'UserNameTitle',
      type: 'text',
      textContent: 'Alex Morgan',
      fontSize: 20,
      fontWeight: 700,
      textColor: '#f8fafc',
    },
    {
      name: 'UserRoleSubtitle',
      type: 'text',
      textContent: 'Lead Design Engineer',
      fontSize: 14,
      fontWeight: 400,
      textColor: '#94a3b8',
    },
    {
      name: 'FollowButton',
      type: 'frame',
      layoutMode: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 8,
      backgroundColor: '#3b82f6',
      children: [
        {
          name: 'ButtonLabel',
          type: 'text',
          textContent: 'Connect',
          fontSize: 14,
          fontWeight: 600,
          textColor: '#ffffff',
        },
      ],
    },
  ],
};

/**
 * Fixture 2: Top Navigation Bar
 */
export const navigationBarFixture: NodeLayout = {
  name: 'TopNavBar',
  type: 'frame',
  layoutMode: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 12,
  paddingBottom: 12,
  paddingLeft: 24,
  paddingRight: 24,
  backgroundColor: '#0f172a',
  borderColor: '#334155',
  borderWidth: 1,
  children: [
    {
      name: 'BrandHeading',
      type: 'text',
      textContent: 'DesignJam OS',
      fontSize: 18,
      fontWeight: 800,
      textColor: '#ffffff',
    },
    {
      name: 'NavMenuContainer',
      type: 'frame',
      layoutMode: 'flex',
      flexDirection: 'row',
      gap: 24,
      alignItems: 'center',
      children: [
        {
          name: 'LinkProjects',
          type: 'text',
          textContent: 'Projects',
          fontSize: 14,
          textColor: '#94a3b8',
        },
        {
          name: 'LinkAnalytics',
          type: 'text',
          textContent: 'Analytics',
          fontSize: 14,
          textColor: '#94a3b8',
        },
      ],
    },
    {
      name: 'LoginButton',
      type: 'frame',
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 6,
      backgroundColor: '#2563eb',
      children: [
        {
          name: 'BtnText',
          type: 'text',
          textContent: 'Sign In',
          fontSize: 14,
          fontWeight: 600,
          textColor: '#ffffff',
        },
      ],
    },
  ],
};

/**
 * Fixture 3: Contact / Input Form
 */
export const contactFormFixture: NodeLayout = {
  name: 'ContactForm',
  type: 'frame',
  layoutMode: 'flex',
  flexDirection: 'column',
  gap: 16,
  paddingTop: 24,
  paddingBottom: 24,
  paddingLeft: 24,
  paddingRight: 24,
  borderRadius: 12,
  backgroundColor: '#1e293b',
  children: [
    {
      name: 'FormTitle',
      type: 'text',
      textContent: 'Get in Touch',
      fontSize: 20,
      fontWeight: 700,
      textColor: '#ffffff',
    },
    {
      name: 'EmailInput',
      type: 'frame',
      textContent: 'name@company.com',
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 14,
      paddingRight: 14,
      borderRadius: 6,
      backgroundColor: '#0f172a',
      borderColor: '#475569',
      borderWidth: 1,
    },
    {
      name: 'SubmitButton',
      type: 'frame',
      layoutMode: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 6,
      backgroundColor: '#10b981',
      children: [
        {
          name: 'SubmitText',
          type: 'text',
          textContent: 'Send Message',
          fontSize: 14,
          fontWeight: 700,
          textColor: '#ffffff',
        },
      ],
    },
  ],
};
