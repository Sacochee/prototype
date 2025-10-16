import {  Schema } from "prosemirror-model";
import { marks } from "./Marks";
import { nodes } from "./Nodes";

export default new Schema({
  nodes: nodes,
  marks: marks,
});
