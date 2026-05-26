export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join('; ');
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message,
          details: result.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
      });
    }

    req.validated = result.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join('; ');
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message,
        },
      });
    }

    req.validatedQuery = result.data;
    next();
  };
}
