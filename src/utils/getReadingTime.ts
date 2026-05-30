export function getReadingTime(
    content: string
  ) {
    const words =
      content.trim().split(/\s+/).length;
  
    return Math.ceil(words / 200);
  }