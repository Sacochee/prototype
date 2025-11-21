import { execFile } from "child_process";
import { writeFile, readFile, unlink } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import mammoth from "mammoth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const entry = form.get("file");
    if (!(entry instanceof File))
      return Response.json({ error: "Invalid file" }, { status: 400 });

    const buffer = Buffer.from(await entry.arrayBuffer());
    const inputPath = path.join(tmpdir(), `input-${Date.now()}.docx`);
    const outputPath = inputPath.replace(".docx", ".html");
    await writeFile(inputPath, buffer);

    const unoconvPath = path.resolve("src", "scripts", "unoconv.py");

    await new Promise((resolve, reject) => {
      execFile(
        "python",
        [unoconvPath, "-f", "html", "-o", outputPath, "--port 2002", inputPath],
        (err) => (err ? reject(err) : resolve(() => {}))
      );
    });

    const html = await readFile(outputPath, "utf8");

    await unlink(inputPath);
    // await unlink(outputPath);

    return Response.json({ html });
  } catch (e: any) {
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// export async function POST(req: Request) {
//   try {
//     const form = await req.formData();
//     const entry = form.get("file");
//     if (!(entry instanceof File))
//       return Response.json({ error: "Invalid file" }, { status: 400 });

//     const buffer = Buffer.from(await entry.arrayBuffer());

//     const input = buffer;

//     const mammothOptions = {
//       styleMap:

//         [
//           "p[style-name='Heading 1'] => h1:fresh",
//           "p[style-name='Heading 2'] => h2:fresh",
//           "b => strong",
//           "i => em",
//               "r[style-name='Texte rouge'] => span.color-red",

//         ].join("\n"),
//       convertImage: mammoth.images.imgElement(function (element) {
//         return element.read("base64").then(function (imageBuffer) {
//           return {
//             src: "data:" + element.contentType + ";base64," + imageBuffer,
//           };
//         });
//       }),
//       includeDefaultStyleMap: false,
//     };

//     const result = await mammoth.convertToHtml(
//       { buffer: input },
//       mammothOptions
//     );

//     return Response.json({ html: result.value, messages: result.messages });
//   } catch (e: any) {
//     console.error(e);
//     return Response.json({ error: e.message }, { status: 500 });
//   }
// }
