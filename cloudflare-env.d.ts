/** Augments generated `Cloudflare.Env` from worker-configuration.d.ts with app secrets / vars. */
declare namespace Cloudflare {
	interface Env {
		AZURE_AI_ENDPOINT: string;
		AZURE_AI_KEY: string;
		AZURE_SEARCH_ENDPOINT: string;
		AZURE_SEARCH_ADMIN_KEY: string;
	}
}
