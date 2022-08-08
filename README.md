# ulm

An object-based linear algebra math library for game development.

```ts
import { vec2, vec3, mat2, mat3, affine3 } from "olam";

let pos: vec3 = vec3(0,0,0)

pos.add(vec3(5,5,5))
   .scale(5)
   .mul(vec3(2,2,2));

vec3.sub(pos, vec3(...pos.toArray()), pos)

// (0,0,0)
console.log(vec3)
```

## Features
   * vectors: `vec2`, `vec3` and `vec4`
   * matrices: `mat2`, `mat3` and `mat4`
   * a quaternion type: `quat`
   * affine transformation types: `affine2` and `affine3`
