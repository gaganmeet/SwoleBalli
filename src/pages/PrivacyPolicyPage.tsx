import type { ReactNode } from 'react'

const SECTIONS: { heading: string; body: ReactNode }[] = [
  {
    heading: 'What Open Gym is',
    body: (
      <p>
        Open Gym is a workout tracking app for athletes and coaches. This policy explains what information we collect
        when you use it, why, and how you can control or remove it.
      </p>
    ),
  },
  {
    heading: 'Information we collect',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Account information:</strong> email address and password, used to create and sign in to your account.
        </li>
        <li>
          <strong>Profile information:</strong> username, display name, role (athlete or coach), and, if you choose to
          add them, a profile photo and bio.
        </li>
        <li>
          <strong>Training data:</strong> workouts, exercises, sets, weights, reps, RPE, training plans, notes, and any
          gym labels you create.
        </li>
        <li>
          <strong>Coaching relationships:</strong> if you link with a coach or client, we store that connection and its
          status (pending, approved) so each side can see the training data the relationship is meant to share.
        </li>
      </ul>
    ),
  },
  {
    heading: 'How we use this information',
    body: (
      <p>
        We use your information only to operate the app: authenticating you, storing and displaying your training data,
        and — if you're linked with a coach or client — sharing the relevant training data between you. We do not use
        your data for advertising, and we do not run analytics or tracking scripts of any kind.
      </p>
    ),
  },
  {
    heading: 'Who we share it with',
    body: (
      <p>
        We don't sell or rent your data to anyone. Your data is stored with our infrastructure providers, Supabase
        (database, authentication, and file storage) and Vercel (hosting), solely to run the app. A linked coach or
        client can see the training data your relationship is set up to share, governed by database-level access rules —
        no one else can see your data.
      </p>
    ),
  },
  {
    heading: 'Where your data lives',
    body: (
      <p>
        Your data is stored in a Supabase-hosted PostgreSQL database with row-level security, restricting every query to
        only the rows you're allowed to see. Traffic between your device and our servers is encrypted (HTTPS/TLS). Open
        Gym also works offline: your session and recently viewed data are cached locally on your device (browser local
        storage) so the app keeps working without a connection, and syncs back once you're online again.
      </p>
    ),
  },
  {
    heading: 'How long we keep it, and deleting your account',
    body: (
      <p>
        We keep your data for as long as your account exists. You can permanently delete your account at any time from
        Settings — this immediately and irreversibly removes your profile, training data, plans, notes, and coaching
        links. If you'd like a copy of your data before deleting it, or have any other request, email us at{' '}
        <a href="mailto:gaganmeet.bahri96@gmail.com" className="underline underline-offset-4">
          gaganmeet.bahri96@gmail.com
        </a>
        .
      </p>
    ),
  },
  {
    heading: "Children's privacy",
    body: (
      <p>
        Open Gym is not directed at children under 13, and we do not knowingly collect information from anyone under
        that age. If you believe a child has created an account, contact us and we'll delete it.
      </p>
    ),
  },
  {
    heading: 'Your rights',
    body: (
      <p>
        You can view and edit most of your profile information directly in the app. For anything you can't change
        yourself — including requesting a copy of your data, correcting something you can't edit, or asking questions
        about how your data is handled — email{' '}
        <a href="mailto:gaganmeet.bahri96@gmail.com" className="underline underline-offset-4">
          gaganmeet.bahri96@gmail.com
        </a>
        .
      </p>
    ),
  },
  {
    heading: 'Changes to this policy',
    body: (
      <p>
        If this policy changes in a way that affects how your data is handled, we'll update the date below and, for
        significant changes, make a reasonable effort to notify you in the app.
      </p>
    ),
  },
]

export function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-muted-foreground mt-1 text-sm">Last updated August 5, 2026</p>

      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold">{section.heading}</h2>
            <div className="text-muted-foreground mt-2 text-sm leading-relaxed">{section.body}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
