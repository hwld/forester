import { json } from "@remix-run/node";
import type { FieldErrors, ValidatorError } from "remix-validated-form";

// remix-validated-formにformErrorを追加した
type ValidationErrorResponseData<T> = {
  formError?: string | undefined;
  subaction?: string | undefined;
  formId?: string | undefined;
  fieldErrors: FieldErrors;
  repopulateFields?: T;
};

export function validationErrorResponse<T>(
  error: ValidatorError & { formError?: string },
  repopulateFields?: T,
  init?: ResponseInit
) {
  return json<ValidationErrorResponseData<T>>(
    {
      formError: error.formError,
      fieldErrors: error.fieldErrors,
      subaction: error.subaction,
      repopulateFields,
      formId: error.formId,
    },
    { status: 422, ...init }
  );
}
