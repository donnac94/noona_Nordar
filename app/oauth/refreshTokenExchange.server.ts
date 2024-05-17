import { OAuthTokenRequestGrantType } from 'api/models';
import { getOAuthToken } from 'api/oauth';

type RefreshTokenExchangeParams = {
	refreshToken: string;
};

export const refreshTokenExchange = async ({ refreshToken }: RefreshTokenExchangeParams) => {
	const { data: tokens } = await getOAuthToken(
		{
			refresh_token: refreshToken,
			grant_type: OAuthTokenRequestGrantType.refresh_token,
		},
		{
			client_id: process.env.CLIENT_ID!,
			client_secret: process.env.CLIENT_SECRET!,
		}
	);

	return tokens;
};
