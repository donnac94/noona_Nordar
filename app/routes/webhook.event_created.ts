import { ActionFunctionArgs, json } from '@remix-run/node';

export async function action({ request }: ActionFunctionArgs) {
	const authorization = request.headers.get('Authorization')?.match(/Bearer (.+)/)?.[1];

	if (authorization !== process.env.APP_WEBHOOK_TOKEN!) {
		return json({ success: true }, { status: 401 });
	}

	// TODO: Handle webhook

	return json({ success: true });
}
