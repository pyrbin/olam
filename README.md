# ulm
An object-based linear algebra math library for game development.

```ts
import { vec3 } from "ulm";

let pos: vec3 = vec3(0,0,0)

pos.add(vec3(5,5,5))
   .scale(5)
   .mul(vec3(2,2,2));

vec3.sub(pos, vec3(...pos.toArray()), pos)

// (0,0,0)
console.log(vec3)

```

## Features
- vec2
- vec3
- vec4
- mat2
- mat3
- mat4
- affine2
- affine3
