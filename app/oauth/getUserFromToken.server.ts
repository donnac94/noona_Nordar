import { getUser } from 'api/user';

export const getUserFromToken = async (token: string) => {
	const { data: user } = await getUser(
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return user;
};
