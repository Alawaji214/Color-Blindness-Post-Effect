vec3 rgbtosrgb(vec3 c) {
    c.r = c.r <= 0.04045 ? c.r / 12.92 : pow((c.r + 0.055) / 1.055, 2.4);
    c.g = c.g <= 0.04045 ? c.g / 12.92 : pow((c.g + 0.055) / 1.055, 2.4);
    c.b = c.b <= 0.04045 ? c.b / 12.92 : pow((c.b + 0.055) / 1.055, 2.4);
    return c;
}

vec3 srgbtorgb(vec3 c) {
    c.r = c.r <= 0.0031308 ? c.r * 12.92 : (pow(1.055 * c.r, 0.41666) - 0.055);
    c.g = c.g <= 0.0031308 ? c.g * 12.92 : (pow(1.055 * c.g, 0.41666) - 0.055);
    c.b = c.b <= 0.0031308 ? c.b * 12.92 : (pow(1.055 * c.b, 0.41666) - 0.055);
    return c;
}

vec3 srgbtolms(vec3 c) {
    mat3 m = mat3(
        vec3(0.31399022, 0.15537241, 0.01775239),
        vec3(0.63951294, 0.75789446, 0.10944209),
        vec3(0.04649755, 0.08670142, 0.87256922)
    );
    return m * c;
}

vec3 lmstosrgb(vec3 c) {
    mat3 m = mat3(
        vec3( 5.47221206, -1.1252419,   0.02980165),
        vec3(-4.6419601,   2.29317094, -0.19318073),
        vec3( 0.16963708, -0.1678952,   1.16364789)
    );
    return m * c;
}
vec3 protanopia(vec3 c) {
    mat3 m = mat3(
        vec3( 0,           0, 0),
        vec3( 1.05118294,  1, 0),
        vec3(-0.05116099,  0, 1)
    );
    return m * c;
}
void fragment() {
    vec4 originalColor4 = texture2D(_Layer, gl_TexCoord[0].xy,0.0);
    originalColor4 = clamp(originalColor4, 0.0, 1.0);
    
    vec3 originalColor = vec3(1,1,1);
    originalColor.r = originalColor4.r;
    originalColor.g = originalColor4.g;
    originalColor.b = originalColor4.b;

    originalColor = rgbtosrgb(originalColor);
    originalColor = srgbtolms(originalColor);
    
    vec3 outputColor = originalColor;
    outputColor = protanopia(originalColor);
    
    outputColor = lmstosrgb(outputColor);
    outputColor = srgbtorgb(outputColor);
    
    vec4 outputColor4 = vec4(1,1,1,1);
    outputColor4.a  = originalColor4.a;
    outputColor4.r = outputColor.r;
    outputColor4.g = outputColor.g;
    outputColor4.b = outputColor.b;
    gl_FragColor = outputColor4;
}
void main()
{
    fragment();
}