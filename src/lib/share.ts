export async function shareVerse(
  reference: string,
  text: string,
): Promise<"shared" | "copied"> {
  const content = `"${text}"\n— ${reference}\n\nOne In Him Biblestudy & Church History`;

  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({ text: content });
    return "shared";
  }

  await navigator.clipboard.writeText(content);
  return "copied";
}
