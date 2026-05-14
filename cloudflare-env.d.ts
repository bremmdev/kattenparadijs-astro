/** Augments generated `Cloudflare.Env` from worker-configuration.d.ts with app secrets / vars. */
declare namespace Cloudflare {
	interface Env {
		AWS_BEARER_TOKEN_BEDROCK: string;
		AWS_BEDROCK_RUNTIME_URL: string;
		AZURE_SEARCH_ENDPOINT: string;
		AZURE_SEARCH_ADMIN_KEY: string;
	}
}
