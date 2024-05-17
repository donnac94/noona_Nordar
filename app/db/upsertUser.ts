import { OAuthToken, User } from 'api/models';
import { prisma } from '~/utils/prisma.server';

type UpsertUserFromNoonaUserParams = {
	user: User;
	scopes: string[];
	token: OAuthToken;
};

export const upsertUserFromNoonaUser = async ({ user, scopes, token }: UpsertUserFromNoonaUserParams) => {
	const updates = {
		companyId: user.companies![0] as string,
		scopes,
		token: {
			accessToken: token.access_token!,
			refreshToken: token.refresh_token!,
			expiresAt: new Date(token.expires_at!),
		},
	};

	return prisma.user.upsert({
		where: { email: user.email! },
		create: {
			email: user.email!,
			...updates,
		},
		update: {
			...updates,
			updatedAt: new Date(),
		},
	});
};
