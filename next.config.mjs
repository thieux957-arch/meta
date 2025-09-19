import createNextJsObfuscator from 'nextjs-obfuscator';

const withNextJsObfuscator = createNextJsObfuscator(
    {
        rotateStringArray: true,
        disableConsoleOutput: false,
    },
    {
        enabled: 'detect',
        patterns: ['./**/*.(js|jsx|ts|tsx)'],
        log: true,
    }
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            'node:crypto': 'commonjs crypto',
        });
        return config;
    }
};

export default withNextJsObfuscator(nextConfig);