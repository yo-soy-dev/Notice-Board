import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = parseInt(id, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: "Invalid notice ID" });
  }

  if (req.method === "GET") {
    try {
      const notice = await prisma.notice.findUnique({
        where: { id: noticeId },
      });
      if (!notice) {
        return res.status(404).json({ error: "Notice not found" });
      }
      return res.status(200).json(notice);
    } catch (error) {
      console.error(`GET /api/notices/${id} error:`, error);
      return res.status(500).json({ error: "Failed to fetch notice" });
    }
  }

  if (req.method === "PUT") {
    const { title, body, category, priority, publishDate, imageUrl, location } = req.body;

    // Server-side validation
    const errors = {};

    if (!title || title.trim() === "") {
      errors.title = "Title is required.";
    } else if (title.trim().length > 255) {
      errors.title = "Title must be 255 characters or fewer.";
    }

    if (!body || body.trim() === "") {
      errors.body = "Body is required.";
    }

    if (!category || !["Exam", "Event", "General"].includes(category)) {
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
      // Check if notice exists
      const existing = await prisma.notice.findUnique({
        where: { id: noticeId },
      });
      if (!existing) {
        return res.status(404).json({ error: "Notice not found" });
      }

      const updated = await prisma.notice.update({
        where: { id: noticeId },
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
      return res.status(200).json(updated);
    } catch (error) {
      console.error(`PUT /api/notices/${id} error:`, error);
      return res.status(500).json({ error: "Failed to update notice" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const existing = await prisma.notice.findUnique({
        where: { id: noticeId },
      });
      if (!existing) {
        return res.status(404).json({ error: "Notice not found" });
      }

      await prisma.notice.delete({ where: { id: noticeId } });
      return res.status(200).json({ message: "Notice deleted successfully" });
    } catch (error) {
      console.error(`DELETE /api/notices/${id} error:`, error);
      return res.status(500).json({ error: "Failed to delete notice" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
