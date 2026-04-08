function normalizeProviderMessage(message: string) {
  return message.toLowerCase();
}

export function getFriendlySignupErrorMessage(message: string) {
  const normalized = normalizeProviderMessage(message);

  if (
    normalized.includes("already registered") ||
    normalized.includes("already been registered") ||
    normalized.includes("already exists") ||
    normalized.includes("user already registered")
  ) {
    return "This email is already registered. Please log in instead.";
  }

  if (normalized.includes("email") && normalized.includes("invalid")) {
    return "Enter a valid email address.";
  }

  if (normalized.includes("password") && normalized.includes("weak")) {
    return "Please choose a stronger password before continuing.";
  }

  if (normalized.includes("password") && normalized.includes("characters")) {
    return "Password must be at least 8 characters.";
  }

  return "Unable to create your account right now. Please try again in a moment.";
}

export function getFriendlyAuthFailureMessage(message: string) {
  const normalized = normalizeProviderMessage(message);

  if (normalized.includes("invalid") && normalized.includes("email")) {
    return "Enter a valid email address.";
  }

  if (normalized.includes("password") && normalized.includes("required")) {
    return "Password is required.";
  }

  return "Something went wrong. Please try again in a moment.";
}

