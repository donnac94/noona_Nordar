import { WebhookEvent } from 'api/models';
import { createWebhook } from 'api/webhooks';

type CreateWebhookParams = {
	token: string;
	companyId: string;
};

export const createWebhooks = async ({ token, companyId }: CreateWebhookParams) => {
	const { data: webhook } = await createWebhook(
		{
			title: 'noona_Nordar webhook',
			description: 'A webhook for the noona_Nordar',
			callback_url: `${process.env.APP_BASE_URL!}/webhook/event_created`,
			company: companyId,
			enabled: true,
			headers: [
				{
					key: 'Authorization',
					values: [`Bearer ${process.env.APP_WEBHOOK_TOKEN!}`],
				},
			],
			events: [WebhookEvent.eventcreated],
		},
		{},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return webhook;
};
