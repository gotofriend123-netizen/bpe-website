const POSTGRES_PROTOCOLS = ["postgresql://", "postgres://"] as const;

export class DatabaseConfigurationError extends Error {
  constructor(message = "Database connection is not configured.") {
    super(message);
    this.name = "DatabaseConfigurationError";
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: string }).message ?? "");
  }

  return "";
}

function isValidPostgresUrl(value?: string) {
  return Boolean(value && POSTGRES_PROTOCOLS.some((protocol) => value.startsWith(protocol)));
}

export function ensureDatabaseConfiguration() {
  if (isValidPostgresUrl(process.env.DATABASE_URL)) {
    return;
  }

  throw new DatabaseConfigurationError(
    "DATABASE_URL must start with postgresql:// or postgres://.",
  );
}

export function isDatabaseConfigurationError(error: unknown) {
  if (error instanceof DatabaseConfigurationError) {
    return true;
  }

  const message = getErrorMessage(error);

  return (
    message.includes("DATABASE_URL must start with postgresql:// or postgres://") ||
    message.includes("Error validating datasource") ||
    message.includes("Environment variable not found: DATABASE_URL") ||
    message.includes("the URL must start with the protocol `postgresql://` or `postgres://`")
  );
}

function getDatabaseConfigurationMessage() {
  const baseMessage =
    "The booking system is temporarily unavailable because the database connection is not configured on this environment.";

  if (process.env.NODE_ENV !== "production") {
    return `${baseMessage} Add DATABASE_URL and DIRECT_URL to .env.local and restart the app.`;
  }

  return baseMessage;
}

export function getPublicApiError(
  error: unknown,
  fallbackMessage: string,
) {
  if (isDatabaseConfigurationError(error)) {
    return {
      message: getDatabaseConfigurationMessage(),
      status: 503,
      code: "database_not_configured",
    };
  }

  if (error && typeof error === "object" && "status" in error) {
    const serviceError = error as {
      message?: string;
      status?: number;
      code?: string;
      details?: unknown;
    };

    return {
      message: serviceError.message || fallbackMessage,
      status: serviceError.status || 500,
      code: serviceError.code,
      details: serviceError.details,
    };
  }

  const status =
    error instanceof Error && "status" in error
      ? Number((error as { status?: number }).status) || 500
      : 500;

  return {
    message: getErrorMessage(error) || fallbackMessage,
    status,
  };
}
