export default async function streamResponse(response: Response) {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let partialChunk = "";

  console.log("Streaming response:\n");

  while (true) {
    const { done, value }: any = await reader?.read();
    if (done) break;

    partialChunk += decoder.decode(value, { stream: true });

    const lines = partialChunk.split("\n");

    partialChunk = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const json = JSON.parse(line.replace("data: ", ""));
          if (
            json.choices &&
            json.choices[0].delta &&
            json.choices[0].delta.content
          ) {
            process.stdout.write(json.choices[0].delta.content);
          }
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      }
    }
  }

  console.log("\nStream finished.");
}
