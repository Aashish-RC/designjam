import test from 'node:test';
import assert from 'node:assert/strict';
import { compileToReactTailwind } from './reactTailwind.ts';
import { userProfileCardFixture, navigationBarFixture, contactFormFixture } from './fixtures.ts';

test('Grida React+Tailwind: Compiles User Profile Card fixture correctly', () => {
  const code = compileToReactTailwind(userProfileCardFixture);

  // Assertions for React structure
  assert.match(code, /export const UserProfileCard: React\.FC<UserProfileCardProps>/);
  assert.match(code, /export default UserProfileCard;/);

  // Assertions for Tailwind classes
  assert.match(code, /flex flex-col/);
  assert.match(code, /gap-4/); // 16px gap
  assert.match(code, /p-6/); // 24px padding
  assert.match(code, /rounded-2xl/); // 16px radius
  assert.match(code, /bg-slate-800/);
  assert.match(code, /border border-slate-700/);

  // Assertions for semantic tags
  assert.match(code, /<h2 className="[^"]*text-xl[^"]*font-bold[^"]*">Alex Morgan<\/h2>/);
  assert.match(code, /<h3 className="[^"]*text-sm[^"]*">Lead Design Engineer<\/h3>/);
  assert.match(code, /<button/); // Inferred button tag for FollowButton
});

test('Grida React+Tailwind: Compiles Navigation Bar fixture correctly', () => {
  const code = compileToReactTailwind(navigationBarFixture);

  assert.match(code, /export const TopNavBar: React\.FC<TopNavBarProps>/);
  assert.match(code, /<nav className="[^"]*flex flex-row[^"]*justify-between[^"]*items-center/);
  assert.match(code, /bg-slate-900/);
  assert.match(code, /<h1|<h2/);
  assert.match(code, /DesignJam OS/);
  assert.match(code, /<button/);
  assert.match(code, /Sign In/);
});

test('Grida React+Tailwind: Compiles Contact Form fixture correctly', () => {
  const code = compileToReactTailwind(contactFormFixture);

  assert.match(code, /export const ContactForm: React\.FC<ContactFormProps>/);
  assert.match(code, /<form className="[^"]*flex flex-col[^"]*gap-4/);
  assert.match(code, /Get in Touch/);
  assert.match(code, /<input type="text" placeholder="name@company\.com"/);
  assert.match(code, /<button/);
  assert.match(code, /Send Message/);
  assert.match(code, /bg-emerald-500/);
});
