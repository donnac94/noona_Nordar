import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { listGroupsAndProducts } from 'api/product-groups';
import { updateProduct } from 'api/products';
import * as jose from 'jose';
import { useEffect, useState } from 'react';
import { getUserByCompanyId } from '~/db/getUserByCompanyId';
import { refreshTokenExchange } from '~/oauth/refreshTokenExchange.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	try {
		const url = new URL(request.url);
		const idToken = jose.decodeJwt(url.searchParams.get('id_token')!);
		const user = await getUserByCompanyId({ companyId: idToken['company_id'] as string });
		const newAccessTokens = await refreshTokenExchange({ refreshToken: user.token.refreshToken });

		return { user, accessToken: newAccessTokens.access_token };
	} catch (exception) {
		console.error(exception);
	}

	return new Response('Unauthorized', { status: 401 });
};

export default function Home() {
	const { user, accessToken } = useLoaderData<typeof loader>();
	const [products, setProducts] = useState<any>(null);
	const [stockLevels, setStockLevels] = useState<{ [key: string]: number }>({});
	const [updateMessage, setUpdateMessage] = useState<string | null>(null);

	if (!user) return null;

	useEffect(() => {
		if (accessToken) {
			getProducts(accessToken);
		}
	}, [user, accessToken]);

	async function getProducts(accessToken: any) {
		const productsResponse = await listGroupsAndProducts(undefined, { headers: { Authorization: `Bearer ${accessToken}` } });
		setProducts(productsResponse);
		return productsResponse;
	}

	async function updateAllProducts() {
		const updatePromises = Object.keys(stockLevels).map((id) => {
			const stockToAdd = stockLevels[id];
			if (stockToAdd !== undefined && stockToAdd !== '') {
				const product = products.data[0].group_products.find((p: any) => p.id === id);
				if (product) {
					const newStockLevel = product.stock_level + stockToAdd;
					return updateProduct(id, { stock_level: newStockLevel }, undefined, { headers: { Authorization: `Bearer ${accessToken}` } });
				}
			}
			return Promise.resolve();
		});
		await Promise.all(updatePromises);
		getProducts(accessToken);
		setStockLevels({});
		setUpdateMessage('Stock levels updated successfully!');
		setTimeout(() => setUpdateMessage(null), 3000); // Hide the message after 3 seconds
	}

	const handleInputChange = (productId: string, value: string) => {
		setStockLevels((prev) => ({
			...prev,
			[productId]: Number(value),
		}));
	};

	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-700 via-gray-900 to-black">
			<h1 className="text-6xl text-white font-bold mb-8">Welcome to stock inventory manager 🎉</h1>
			<p className="text-xl text-white mb-4">Hi, {user.email} 👋 You are logged in 🎉</p>
			{updateMessage && <p className="text-xl text-green-500 mb-4">{updateMessage}</p>}
			{products && (
				<div className="w-full flex flex-wrap justify-center gap-6 p-6">
					{products.data[0].group_products.map((product: any) => (
						<div key={product.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center w-full max-w-xs">
							<p className="text-xl font-bold mb-4">{product.title}</p>
							<p className="text-lg mb-4">Stock Level: {product.stock_level}</p>
							<input
								type="number"
								placeholder="Enter Stock to Add"
								value={stockLevels[product.id] || ''}
								onChange={(e) => handleInputChange(product.id, e.target.value)}
								className="mb-2 p-2 border border-gray-300 rounded w-full"
							/>
						</div>
					))}
				</div>
			)}
			<button onClick={updateAllProducts} className="p-2 bg-blue-500 text-white rounded mt-5">
				Update All Stock Levels
			</button>
		</div>
	);
}
