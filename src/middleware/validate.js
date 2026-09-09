const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Validation Failed",
          error: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
          })),
        });
      }
      req[source] = result.data;
      next();
    } catch (error) {
      console.error("Validation middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};
export default validate;
