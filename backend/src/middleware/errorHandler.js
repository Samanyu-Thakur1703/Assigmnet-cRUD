export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource ID." });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "A resource with that value already exists." });
  }

  res.status(500).json({ message: "Internal server error." });
};
