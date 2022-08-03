# ulm
An object-based linear algebra math library for game development.

```ts
import { vec3, type Vec3 } from "ulm";

let pos: Vec3 = vec3(0,0,0)

pos.add(vec3(5,5,5))
   .scale(5)
   .mul(vec3(2,2,2));

vec3.sub(pos, vec3(...pos.toArray()), pos)

// (0,0,0)
console.log(vec3)

```

## Features
- Vec2
- Vec3
- Vec4
- Mat2
- Mat3
- Mat4
- Affine2
- Affine3
