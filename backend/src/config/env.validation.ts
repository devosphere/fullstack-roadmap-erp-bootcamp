type Environment = {
  PORT: number;
  DATABASE_URL: string;
  CORS_ORIGIN: string;
};

const requiredVariables = ['PORT', 'DATABASE_URL', 'CORS_ORIGIN'] as const;

export function validateEnv(config: Record<string, unknown>): Environment {
  for (const variable of requiredVariables) {
    if (!config[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  }

  const port = Number(config.PORT);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  return {
    PORT: port,
    DATABASE_URL: String(config.DATABASE_URL),
    CORS_ORIGIN: String(config.CORS_ORIGIN),
  };
}
