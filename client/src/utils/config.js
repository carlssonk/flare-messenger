const dev = process.env.NODE_ENV !== "production";

export const url = dev ? "http://server:4000" : "https://mywebsite.com";