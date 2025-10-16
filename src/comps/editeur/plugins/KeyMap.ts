import { Plugin } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { BoldCommand, ItalicCommand, UnderlineCommand } from "../commands";
import { baseKeymap } from "prosemirror-commands";
import { splitListItem } from "prosemirror-schema-list";
import schema from "../schemas/schema";
import { EnterCommand } from "../commands/EnterCommand";
import { delCommand } from "../commands/DelCommand";
import {
  TextAlignCommandCenter,
  TextAlignCommandEnd,
  TextAlignCommandJustify,
  TextAlignCommandStart,
} from "../commands/AlignText";
import { ToggleOlCommand, ToggleUlCommand } from "../commands/ListesCommands";
import {
  ReduceBlockLeftSpacingCommand,
  IncrementBlockLeftSpacingCommand,
} from "../commands/RetraitCommand";
import { ClearFormattingCommand } from "../commands/DelMiseEnForme";

export default keymap({
  ...baseKeymap,
  "Mod-b": BoldCommand,
  "Mod-u": UnderlineCommand,
  "Mod-i": ItalicCommand,
  Enter: EnterCommand,
  // 'Mod-Delete' : delCommand,
  Backspace: delCommand,

  //textAlign
  "Mod-Shift-l": TextAlignCommandStart,
  "Mod-Shift-e": TextAlignCommandCenter,
  "Mod-Shift-r": TextAlignCommandEnd,
  "Mod-Shift-j": TextAlignCommandJustify,
  //liste
  "Mod-Shift-8": ToggleUlCommand,
  "Mod-Shift-7": ToggleOlCommand,
  //retrait //TODO find le raccourci
  // "Mod-[": ReduceBlockLeftSpacingCommand,
  // "Mod-]": IncrementBlockLeftSpacingCommand,
  // "Mod-Alt-[": ReduceBlockLeftSpacingCommand,
  // "Mod-Alt-]": IncrementBlockLeftSpacingCommand,
  //clear formating
  "Mod-Alt-\\" : ClearFormattingCommand,
  "Mod-\\" : ClearFormattingCommand
});
