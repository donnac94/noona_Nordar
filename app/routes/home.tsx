import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { listGroupsAndProducts } from 'api/product-groups';
import * as jose from 'jose';
import { useEffect, useState } from 'react';
import { getUserByCompanyId } from '~/db/getUserByCompanyId';
import { refreshTokenExchange } from '~/oauth/refreshTokenExchange.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	try {
		const url = new URL(request.url);
		// TODO: Verify signature against Noona public key
		const idToken = jose.decodeJwt(url.searchParams.get('id_token')!);
		const user = await getUserByCompanyId({ companyId: idToken['company_id'] as string });
		const newAccessTokens = await refreshTokenExchange({ refreshToken: user.token.refreshToken });
		console.log('User is ', user);
		// console.log("company_id is ", idToken['company_id'] as string);

		return { user, accessToken: newAccessTokens.access_token };
	} catch (exception) {
		console.error(exception);
	}

	return new Response('Unauthorized', { status: 401 });
};

export default function Home() {
	const { user, accessToken } = useLoaderData<typeof loader>();
	const [products, setProducts] = useState<any>(null);
	if (!user) return null;

	// eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps
	useEffect(() => {
		if (accessToken) {
			getProducts(accessToken);
		}
	}, [user, accessToken]);

	async function getProducts(access_token: any) {
		const productsResponse1 = await listGroupsAndProducts(undefined, { headers: { Authorization: `Bearer ${accessToken}` } });
		console.log('productsResponse1 is ', productsResponse1);
		setProducts(productsResponse1);
		return productsResponse1;
	}

	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-700 via-gray-900 to-black">
			<h1 className="text-6xl text-white font-bold mb-8">Hi, {user.email} 👋</h1>
			<h3 className="text-4xl text-white font-bold mb-8">Welcome to app-template-remix</h3>
			<p className="text-xl text-white mb-4">You are logged in 🎉</p>
			{products && (
				<table className="table-auto text-white">
					<thead>
						<tr>
							<th className="px-4 py-2">Name</th>
							<th className="px-4 py-2">Quantity</th>
							<th className="px-4 py-2">Action</th>
						</tr>
					</thead>
					<tbody>
						{products.data[0].group_products.map((product: any) => (
							<tr key={product.title}>
								<td className="border px-4 py-2">{product.title}</td>
								<td className="border px-4 py-2">{product.stock_level}</td>
								<td className="border px-4 py-2">
									<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => alert(`Adding product: ${product.title}`)}>
										Add Product
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
