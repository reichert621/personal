import {NextPage} from 'next';
import Link from 'next/link';
import React from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';

import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {useToast} from '@/components/ui/use-toast';

import {useState} from 'react';
import {auth} from '@instantdb/react';

function Login() {
  const [state, setState] = useState({
    sentEmail: '',
    email: '',
    code: '',
  });
  const {sentEmail, email, code} = state;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div>
        {!sentEmail ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <h2 style={{color: '#333', marginBottom: '20px'}}>
              Let's log you in!
            </h2>
            <div>
              <input
                style={{
                  padding: '10px',
                  marginBottom: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  width: '300px',
                }}
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setState({...state, email: e.target.value})}
              />
            </div>
            <div>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (!email) return;
                  setState({...state, sentEmail: email});
                  auth.sendMagicCode({email}).catch((err: any) => {
                    alert('Uh oh :' + err.body?.message);
                    setState({...state, sentEmail: ''});
                  });
                }}
              >
                Send Code
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <h2 style={{color: '#333', marginBottom: '20px'}}>
              Okay we sent you an email! What was the code?
            </h2>
            <div>
              <input
                style={{
                  padding: '10px',
                  marginBottom: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  width: '300px',
                }}
                type="text"
                placeholder="Code plz"
                value={code || ''}
                onChange={(e) => setState({...state, code: e.target.value})}
              />
            </div>
            <button
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                auth
                  .verifyMagicCode({email: sentEmail, code})
                  .catch((err: any) => {
                    alert('Uh oh :' + err.body?.message);
                    setState({...state, code: ''});
                  });
              }}
            >
              Verify
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const LoginPage: NextPage = () => {
  const router = useRouter();

  const [email, setUserEmail] = React.useState('');
  const [password, setUserPassword] = React.useState('');
  const [isLoggingIn, setLoggingInState] = React.useState(false);
  const [error, setErrorMessage] = React.useState<string | null>(null);

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col items-center justify-center bg-white">
      <Head>
        <title>Log in</title>
      </Head>

      <main className="mx-auto w-full max-w-md px-4 py-12">
        <h1 className="mb-1.5 mt-8 text-2xl font-bold tracking-[-0.16px] text-zinc-900">
          Log in
        </h1>
        <p className="text-zinc-500">
          Don&apos;t have an account?{' '}
          <Link className="text-purple-500" href="/register">
            Sign up.
          </Link>
        </p>

        <Button className="mt-8 w-full" variant="secondary">
          <span className="mr-2 text-[#70757E]">
            <svg
              viewBox="0 0 24 24"
              className="mr-2 h-4 w-4"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
          </span>
          Sign in with Google
        </Button>
        <div className="mb-6 mt-6 flex items-center justify-center">
          <div
            aria-hidden="true"
            data-orientation="horizontal"
            role="separator"
            className="h-px w-full bg-zinc-200"
          ></div>
          <span className="mx-4 text-xs font-normal text-zinc-400">OR</span>
          <div
            aria-hidden="true"
            data-orientation="horizontal"
            role="separator"
            className="h-px w-full bg-zinc-200"
          ></div>
        </div>
        <form className="mb-8" onSubmit={console.log}>
          <div className="mb-4 space-y-2">
            <Label htmlFor="email" className="select-none text-zinc-500">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoFocus
              placeholder="jane.doe@example.com"
              required
              value={email}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <div className="mb-6 space-y-2">
            <Label htmlFor="password" className="select-none text-zinc-500">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>
          <Button className="w-full" type="submit">
            Log in
            <svg
              className="ml-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.75 6.75L19.25 12L13.75 17.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M19 12H4.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </Button>
        </form>
        <p className="text-xs font-normal text-zinc-400">
          By signing in, you agree to our{' '}
          <a className="text-purple-500" href="/legal/terms-of-service">
            Terms of Service
          </a>{' '}
          and{' '}
          <a className="text-purple-500" href="/legal/privacy-policy">
            Privacy Policy
          </a>
          .
        </p>
      </main>
    </div>
  );
};

export default function Page() {
  return <Login />;
}
