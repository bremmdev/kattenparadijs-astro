import { createClient } from '@sanity/client'

export const config = {
    /**
     * Find your project ID and dataset in `sanity.json` in your studio project.
     * These are considered “public”, but you can use environment variables
     * if you want differ between local dev and production.
     *
     * https://nextjs.org/docs/basic-features/environment-variables
     **/
    dataset: import.meta.env.SANITY_DATASET,
    projectId: import.meta.env.SANITY_PROJECT_ID,
    apiVersion: "2021-08-11", // or today's date for latest
    /**
     * Set useCdn to `false` if your application require the freshest possible
     * data always (potentially slightly slower and a bit more expensive).
     * Authenticated request (like preview) will always bypass the CDN
     **/
    useCdn: false,
};

//set up the client for fetching data in getStaticProps
export const sanityClient = createClient(config)