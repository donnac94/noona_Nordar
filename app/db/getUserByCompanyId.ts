import { prisma } from '~/utils/prisma.server';

type GetUserByCompanyIdParams = {
	companyId: string;
};

export const getUserByCompanyId = ({ companyId }: GetUserByCompanyIdParams) => {
	return prisma.user.findFirstOrThrow({
		where: { companyId },
	});
};