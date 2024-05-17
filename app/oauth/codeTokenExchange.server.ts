import { OAuthTokenRequestGrantType } from 'api/models';
import { getOAuthToken } from 'api/oauth';

type CodeTokenExchangeParams = {
	code: string;
};

export const codeTokenExchange = async ({ code }: CodeTokenExchangeParams) => {
	const { data: tokens } = await getOAuthToken(
		{
			code,
			grant_type: OAuthTokenRequestGrantType.authorization_code,
		},
		{
			client_id: process.env.CLIENT_ID!,
			client_secret: process.env.CLIENT_SECRET!,
		}
	);

	return tokens;
};
