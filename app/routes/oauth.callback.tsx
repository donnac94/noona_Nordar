import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { upsertUserFromNoonaUser } from '~/db/upsertUser';
import { codeTokenExchange } from '~/oauth/codeTokenExchange.server';
import { createWebhooks } from '~/oauth/createWebhooks.server';
import { getUserFromToken } from '~/oauth/getUserFromToken.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const code = url.searchParams.get('code');
	const scopes = url.searchParams.getAll('scope') ?? [];

	if (!code) {
		return redirect('/');
	}

	const token = await codeTokenExchange({ code });

	const user = await getUserFromToken(token.access_token!);

	await createWebhooks({
		token: token.access_token!,
		companyId: user.companies![0] as string,
	});

	const localUser = await upsertUserFromNoonaUser({
		user,
		scopes,
		token,
	});

	return json({ user: localUser, appStoreUrl: process.env.APP_STORE_URL! });
};

export default function OAuthAuthorize() {
	const { user, appStoreUrl } = useLoaderData<typeof loader>();

	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-700 via-gray-900 to-black">
			<h1 className="text-6xl text-white font-bold mb-8">Hi, {user.email} 👋</h1>
			<h3 className="text-4xl text-white font-bold mb-8">Welcome to app-template-remix</h3>
			<p className="text-xl text-white mb-4">You have now successfully connected your account.</p>
			<p className="text-xl text-white">
				Press{' '}
				<a className="text-bold underline" href={appStoreUrl}>
					here
				</a>{' '}
				to go back to Noona HQ
			</p>
		</div>
	);
}
