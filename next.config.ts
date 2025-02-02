import config from './package.json' with {type: 'json'};
import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    experimental: {
        serverActions: {
            bodySizeLimit: '15mb',
        },
    },
    publicRuntimeConfig: {
        version: config.version,
    },
};

export default nextConfig;
