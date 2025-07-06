/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  /* config options here */
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);