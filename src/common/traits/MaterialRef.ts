import { trait } from "koota";
import { MeshLambertMaterial } from "three";

export const MaterialRef = trait(() => new MeshLambertMaterial());
