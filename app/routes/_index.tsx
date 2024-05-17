import type { MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const meta: MetaFunction = () => {
	return [{ title: 'noona_Nordar' }, { name: 'description', content: 'Welcome to noona_Nordar' }];
};

export const loader = () => {
	const params = new URLSearchParams();
	params.append('client_id', process.env.CLIENT_ID!);
	params.append('response_type', 'code');
	params.append('redirect_uri', `${process.env.APP_BASE_URL!}/oauth/callback`);
	// TODO: Request the scopes you need
	params.append('scope', 'events:read');

	return {
		consentScreenUrl: `${process.env.CONSENT_SCREEN_URL!}?${params.toString()}`,
	};
};

export default function Index() {
	const { consentScreenUrl } = useLoaderData<typeof loader>();

	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-700 via-gray-900 to-black">
			<h1 className="text-4xl text-white font-bold mb-8">Welcome to noona_Nordar</h1>
			<a href={consentScreenUrl} className=" flex gap-4 items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md focus:outline-none text-xl">
				<span>Login with</span>
				<img src="/images/noona-logo.svg" alt="Login with Noona" className="h-6" />
			</a>
		</div>
	);
}
