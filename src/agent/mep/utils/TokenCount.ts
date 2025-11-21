import path from "path";
import llama3Tokenizer from "llama3-tokenizer-js";
import fs from "fs";

export default class {
  private input = 0;
  private output = 0;

  addInput(messages: { role: string; content: string }[]) {
    const BOS = "<|begin_of_text|>";
    const END = "<|eot_id|>";

    // Mappage des rôles vers les balises Llama
    const ROLE_TAGS = {
      system: "<|start_header_id|>system<|end_header_id|>\n",
      user: "<|start_header_id|>user<|end_header_id|>\n",
      assistant: "<|start_header_id|>assistant<|end_header_id|>\n",
    };

    // Construit la séquence complète telle que Llama l'interprète
    let serialized = BOS;

    for (const msg of messages) {
      //@ts-ignore
      const roleTag = ROLE_TAGS[msg.role] || ROLE_TAGS.user;
      serialized += roleTag + (msg.content || "") + END;
    }

    // Tokenisation
    const tokens = llama3Tokenizer.encode(serialized, {
      bos: false,
      eos: false,
    });
    this.input += tokens.length;
  }
  addOutput(str: string) {
    const tokens = llama3Tokenizer.encode(str, {
      bos: false,
      eos: false,
    });
    this.output += tokens.length;
  }

  getToken = () => ({ input: this.input, output: this.output });
  saveToken() {
    const pathSave = path.join(process.cwd(), "data", "SaveToken.json");

    const newObj = {
      input: this.input,
      output: this.output,
      date: Date.now(),
    };
    let data = [];

    // Lire le fichier si présent
    if (fs.existsSync(pathSave)) {
      const content = fs.readFileSync(pathSave, "utf8");
      try {
        data = JSON.parse(content);
        if (!Array.isArray(data)) data = [];
      } catch {
        data = [];
      }
    }

    // Ajouter et réécrire
    data.push(newObj);
    fs.writeFileSync(pathSave, JSON.stringify(data, null, 2), "utf8");
  }
}
