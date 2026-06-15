import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          // Urgent notices first (database-level ordering)
          { priority: "desc" },
          // Then by publishDate descending within each priority group
          { publishDate: "desc" },
        ],
      });
      return res.status(200).json(notices);
    } catch (error) {
      console.error("GET /api/notices error:", error);
      return res.status(500).json({ error: "Failed to fetch notices" });
    }
  }

  if (req.method === "POST") {
    const { title, body, category, priority, publishDate, imageUrl, location } = req.body;

    // Server-side validation
    const errors = {};

    if (!title || title.trim() === "") {
      errors.title = "Title is required.";
    } else if (title.trim().length < 5) {
      errors.title = "Title must be at least 5 characters.";
    } else if (title.trim().length > 255) {
      errors.title = "Title must be 255 characters or fewer.";
    }

    if (!body || body.trim() === "") {
      errors.body = "Body is required.";
    } else if (body.trim().length > 1000) {
      errors.body = "Body must be 1000 characters or fewer.";
    }

    if (!category || !["Exam", "Event", "General", "Holiday"].includes(category)) {
      errors.category = "Category must be Exam, Event, or General.";
    }

    if (!priority || !["Normal", "Urgent"].includes(priority)) {
      errors.priority = "Priority must be Normal or Urgent.";
    }

    if (!publishDate) {
      errors.publishDate = "Publish date is required.";
    } else {
      const parsed = new Date(publishDate);
      if (isNaN(parsed.getTime())) {
        errors.publishDate = "Publish date must be a valid date.";
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ errors });
    }

    try {
      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          imageUrl: imageUrl && imageUrl.trim() !== "" ? imageUrl.trim() : null,
          location: location && location.trim() !== "" ? location.trim() : null,
        },
      });
      return res.status(201).json(notice);
    } catch (error) {
      console.error("POST /api/notices error:", error);
      return res.status(500).json({ error: "Failed to create notice" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
