export class AssertionError extends Error {
  name = "AssertionError";
}

/** Throws an `AssertionError` if condition fails. */
export function assert(condition: boolean, message?: string): asserts condition {
  if (condition === false) {
    panic(new AssertionError(message));
  }
}

/** Throw an error with a message.*/
export function panic(error: string | Error): never {
  throw typeof error === "string" ? new Error(error) : error;
}
