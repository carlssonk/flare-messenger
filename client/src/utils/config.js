const dev = process.env.NODE_ENV !== "production";

export const url = dev ? "http//localhost:4000" : "https://mywebsite.com";
