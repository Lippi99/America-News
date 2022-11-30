export const dateFormat = (
  date: string,
  lang?: string,
  day?: "numeric" | "2-digit" | undefined,
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined,
  year?: "numeric" | "2-digit" | undefined
) => {
  const publicationDateFormatted = new Date(date).toLocaleDateString(lang, {
    day,
    month,
    year,
  });

  return publicationDateFormatted;
};
