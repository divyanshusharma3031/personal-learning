// This is a small parser to convert the md file  

export interface Frontmatter {
    title: string;
    date: string;
    category: string;
    summary: string;
    tags: string[];
  }


  
  export function parseFrontmatter(
    raw: string
  ) {
    raw = raw.replace(/\r\n/g, "\n");
    console.log("Raw",raw);
    const match = raw.match(
      /^---\n([\s\S]*?)\n---/
    );
  
    if (!match) {
      return {
        metadata: {},
        content: raw,
      };
    }
  
    const metadataBlock = match[1];
    const content = raw.replace(match[0], "").trim();
  
    const metadata: Record<string, any> = {};
  
    let currentKey = "";
  
    metadataBlock.split("\n").forEach((line) => {
      if (line.includes(":")) {
        const [key, ...rest] = line.split(":");
  
        currentKey = key.trim();
  
        metadata[currentKey] =
          rest.join(":").trim();
      } else if (
        line.trim().startsWith("-")
      ) {
        metadata[currentKey] ??= [];
        console.log("Metadata",metadata);
        console.log("Currentkey",currentKey);
        console.log("Metadata current Key",metadata[currentKey]);
        metadata[currentKey].push(
          line.replace("-", "").trim()
        );
      }
    });
  
    return {
      metadata,
      content,
    };
  }