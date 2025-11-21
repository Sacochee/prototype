import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, unlink } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    // Lecture du corps de la requête (string HTML)
    const html = await req.text();
    if (!html) {
      return NextResponse.json({ error: "Empty HTML body" }, { status: 400 });
    }

    // Création de fichiers temporaires
    const tmpDir = os.tmpdir();
    const htmlPath = path.join(tmpDir, `input-${Date.now()}.html`);
    const docxPath = htmlPath.replace(/\.html$/, ".docx");

    // Écrit le HTML dans un fichier temporaire
    await writeFile(htmlPath, html, "utf8");
    const unoconvPath = path.resolve("src", "scripts", "unoconv.py");
    // Conversion HTML → DOCX avec unoconv
    await execAsync(`python ${unoconvPath} -f docx "${htmlPath}"`);

    // Lecture du DOCX généré
    const docxBuffer = await readFile(docxPath);

    // Nettoyage
    await unlink(htmlPath);
    await unlink(docxPath);

    // Retourne le fichier DOCX
    return new NextResponse(new Uint8Array(docxBuffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="converted.docx"',
      },
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
