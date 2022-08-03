declare type num2 = { x: number, y: number };
declare type num3 = num2 & { z: number };
declare type num4 = num3 & { w: number };

declare type num2x2 = {
    c0: num2,
    c1: num2
}
declare type num3x3 = {
    c0: num3,
    c1: num3,
    c2: num3
};
declare type num4x4 = {
    c0: num4,
    c1: num4,
    c2: num4,
    c3: num4
};

declare type affine2 = {
    scale: num2,
    rotate: Rad,
    translate: num2
}
declare type affine3 = {
    scale: num3,
    rotate: quat,
    translate: num3
}

declare type Rad = number;
declare type Deg = number;