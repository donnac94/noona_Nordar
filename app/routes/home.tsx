import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import * as jose from 'jose';
import { getUserByCompanyId } from '~/db/getUserByCompanyId';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	try {
		const url = new URL(request.url);
		// TODO: Verify signature against Noona public key
		const idToken = jose.decodeJwt(url.searchParams.get('id_token')!);
		const user = await getUserByCompanyId({ companyId: idToken['company_id'] as string });

		return { user };
	} catch (exception) {
		console.error(exception);
	}

	return new Response('Unauthorized', { status: 401 });
};

export default function Home() {
	const { user } = useLoaderData<typeof loader>();

	if (!user) return null;

	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-700 via-gray-900 to-black">
			<h1 className="text-6xl text-white font-bold mb-8">Hi, {user.email} 👋</h1>
			<h3 className="text-4xl text-white font-bold mb-8">Welcome to app-template-remix</h3>
			<p className="text-xl text-white mb-4">You are logged in 🎉</p>
		</div>
	);
}