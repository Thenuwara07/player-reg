// Small helper so a missing JWT secret fails loudly at startup
// instead of silently falling back to a guessable default.
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error(
    "JWT_SECRET environment variable is not set. Add it to your .env file."
  );
}

export const JWT_SECRET = secret;
