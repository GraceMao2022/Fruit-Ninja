import {defs, tiny} from './examples/common.js';
import {Shape_From_File} from "./examples/obj-file-demo.js";

// Pull these names into this module's scope for convenience:
// const {vec3, vec4, color, hex_color, Mat4, Light, Shape, Material, Shader, Texture, Scene} = tiny;
const {Triangle, Square, Tetrahedron, Windmill, Rounded_Closed_Cone, Cylindrical_Tube, Cube, Grid_Patch, Subdivision_Sphere, Textured_Phong} = defs;
const {
    Vector, Vec, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;


export class Transforms_Sandbox_Base extends Scene {
    // **Transforms_Sandbox_Base** is a Scene that can be added to any display canvas.
    // This particular scene is broken up into two pieces for easier understanding.
    // The piece here is the base class, which sets up the machinery to draw a simple
    // scene demonstrating a few concepts.  A subclass of it, Transforms_Sandbox,
    // exposes only the display() method, which actually places and draws the shapes,
    // isolating that code so it can be experimented with on its own.
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        // At the beginning of our program, load one of each of these shape
        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape it
        // would be redundant to tell it again.  You should just re-use the
        // one called "box" more than once in display() to draw multiple cubes.
        // Don't define more than one blueprint for the same thing here.
        this.shapes = {
            'box': new Cube(),
            'watermelon': new Subdivision_Sphere(4),
            'watermelon_inside': new defs.Regular_2D_Polygon(30, 30),
            'orange': new Subdivision_Sphere(4),
            'orange_inside': new defs.Regular_2D_Polygon(30, 30),
            'peach': new Subdivision_Sphere(4),
            'peach_inside': new defs.Regular_2D_Polygon(30, 30),
            'apple': new Subdivision_Sphere(4),
            'apple_inside': new defs.Regular_2D_Polygon(30, 30),
            'mango': new Subdivision_Sphere(4),
            'mango_inside': new defs.Regular_2D_Polygon(30, 30),
            'bomb': new Subdivision_Sphere(4),
            'background': new Square(),
        };

        // *** Materials: *** Define a shader, and then define materials that use
        // that shader.  Materials wrap a dictionary of "options" for the shader.
        // Here we use a Phong shader and the Material stores the scalar
        // coefficients that appear in the Phong lighting formulas so that the
        // appearance of particular materials can be tweaked via these numbers.
        const phong = new defs.Phong_Shader();
        this.materials = {
            watermelon_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/watermelon_texture.jpg", "NEAREST")
            }),
            half_watermelon_texture: new Material(new Hemi_Sphere(1.0), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/watermelon_texture.jpg", "NEAREST")
            }),
            watermelon_inside_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/watermelon_inside.jpeg", "NEAREST")
            }),
            orange_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.1,
                texture: new Texture("assets/orange_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            half_orange_texture: new Material(new Hemi_Sphere(10.0), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.1,
                texture: new Texture("assets/orange_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            orange_inside_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/orange_inside.jpeg", "LINEAR_MIPMAP_LINEAR")
            }),
            peach_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.1,
                texture: new Texture("assets/peach_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            half_peach_texture: new Material(new Hemi_Sphere(1.0), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.1,
                texture: new Texture("assets/peach_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            peach_inside_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/peach_inside.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            apple_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 1.0,
                texture: new Texture("assets/apple_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            half_apple_texture: new Material(new Hemi_Sphere(1.0), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 1.0,
                texture: new Texture("assets/apple_skin.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            apple_inside_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/apple_inside.jpg", "LINEAR_MIPMAP_LINEAR")
            }),
            mango_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 1.0,
                texture: new Texture("assets/mango_skin.jpeg", "LINEAR_MIPMAP_LINEAR")
            }),
            half_mango_texture: new Material(new Hemi_Sphere(1.0), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 1.0,
                texture: new Texture("assets/mango_skin.jpeg", "LINEAR_MIPMAP_LINEAR")
            }),
            mango_inside_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/mango_inside.jpeg", "LINEAR_MIPMAP_LINEAR")
            }),
            bomb_texture: new Material(new defs.Phong_Shader(),
                {ambient: 1, specularity: 1, color: hex_color("#000000")}),
            background_texture: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                specularity: 0.0,
                texture: new Texture("assets/cutting_board.jpg", "LINEAR_MIPMAP_LINEAR")}),
        };
    }

    make_control_panel() {
        // make_control_panel(): Sets up a panel of interactive HTML elements, including
        // buttons with key bindings for affecting this scene, and live info readouts.
        this.control_panel.innerHTML += "Dragonfly rotation angle: ";
        // The next line adds a live text readout of a data member of our Scene.
        this.live_string(box => {
            box.textContent = (this.hover ? 0 : (this.t % (2 * Math.PI)).toFixed(2)) + " radians"
        });
        this.new_line();
        this.new_line();
        // Add buttons so the user can actively toggle data members of our Scene:
        this.key_triggered_button("Hover dragonfly in place", ["h"], function () {
            this.hover ^= 1;
        });
        this.new_line();
        this.key_triggered_button("Swarm mode", ["m"], function () {
            this.swarm ^= 1;
        });
    }

    display(context, program_state) {
        // display():  Called once per frame of animation.  We'll isolate out
        // the code that actually draws things into Transforms_Sandbox, a
        // subclass of this Scene.  Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());

            // Define the global camera and projection matrices, which are stored in program_state.  The camera
            // matrix follows the usual format for transforms, but with opposite values (cameras exist as
            // inverted matrices).  The projection matrix follows an unusual format and determines how depth is
            // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() and
            // orthographic() automatically generate valid matrices for one.  The input arguments of
            // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.
            program_state.set_camera(Mat4.translation(0, 3, -10));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // *** Lights: *** Values of vector or point lights.  They'll be consulted by
        // the shader when coloring shapes.  See Light's class definition for inputs.
        const t = this.t = program_state.animation_time / 1000;
        const angle = Math.sin(t);
        const light_position = Mat4.rotation(angle, 1, 0, 0).times(vec4(0, -1, 1, 0));
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
    }
}


export class Fruit_Textures extends Transforms_Sandbox_Base {
    // **Transforms_Sandbox** is a Scene object that can be added to any display canvas.
    // This particular scene is broken up into two pieces for easier understanding.
    // See the other piece, Transforms_Sandbox_Base, if you need to see the setup code.
    // The piece here exposes only the display() method, which actually places and draws
    // the shapes.  We isolate that code so it can be experimented with on its own.
    // This gives you a very small code sandbox for editing a simple scene, and for
    // experimenting with matrix transformations.
    display(context, program_state) {
        // display():  Called once per frame of animation.  For each shape that you want to
        // appear onscreen, place a .draw() call for it inside.  Each time, pass in a
        // different matrix value to control where the shape appears.

        // Variables that are in scope for you to use:
        // this.shapes.box:   A vertex array object defining a 2x2x2 cube.
        // this.shapes.ball:  A vertex array object defining a 2x2x2 spherical surface.
        // this.materials.metal:    Selects a shader and draws with a shiny surface.
        // this.materials.plastic:  Selects a shader and draws a more matte surface.
        // this.lights:  A pre-made collection of Light objects.
        // this.hover:  A boolean variable that changes when the user presses a button.
        // program_state:  Information the shader needs for drawing.  Pass to draw().
        // context:  Wraps the WebGL rendering context shown onscreen.  Pass to draw().

        // Call the setup code that we left inside the base class:
        super.display(context, program_state);

        let model_transform = Mat4.identity()

        let background_model_transform = Mat4.translation(0,-3,0).times(Mat4.scale(10,5,1))

        this.shapes.background.draw(context, program_state, background_model_transform, this.materials.background_texture)

        let t = program_state.animation_time / 1000
        // Tweak our coordinate system downward 2 units for the next shape.
        model_transform = model_transform.times(Mat4.translation(0, -2, 0)).times(Mat4.rotation(t, 0, 1,0)).times(Mat4.scale(1, 1.25,1));
        this.shapes.watermelon.arrays.texture_coord.forEach(
            (v, i, l) => {
                v[0] = v[0] * 2
                //console.log(v)
            }
        )
        this.shapes.watermelon.draw(context, program_state, model_transform, this.materials.watermelon_texture)

        let half_watermelon_translate = vec4(0,-4,0,1)
        let half_watermelon_rotate = vec4(0,1,0,1)
        let half_watermelon_outside_scale = vec4(1,1.25,1)
        let half_watermelon_inside_scale = vec4(1,1,1)
        this.draw_half_fruit(context, program_state, half_watermelon_translate, half_watermelon_rotate, half_watermelon_outside_scale, half_watermelon_inside_scale,
            this.shapes.watermelon, this.materials.half_watermelon_texture, this.shapes.watermelon_inside, this.materials.watermelon_inside_texture)

        //orange

        let orange_model_transform = Mat4.translation(2, -2, 0).times(Mat4.rotation(t, 0, 1,0)).times(Mat4.scale(0.5, 0.5,0.5));
        this.shapes.orange.arrays.texture_coord.forEach(
            (v, i, l) => {
                v[0] = v[0] * 10
                v[1] = v[1] * 10
                //console.log(v)
            }
        )
        this.shapes.orange.draw(context, program_state, orange_model_transform, this.materials.orange_texture)

        let half_orange_translate = vec4(2,-4,0,1)
        let half_orange_rotate = vec4(0,1,0,1)
        let half_orange_outside_scale = vec4(0.5, 0.5, 0.5)
        let half_orange_inside_scale = vec4(0.5, 0.5, 0.5)
        this.draw_half_fruit(context, program_state, half_orange_translate, half_orange_rotate, half_orange_outside_scale, half_orange_inside_scale,
            this.shapes.orange, this.materials.half_orange_texture, this.shapes.orange_inside, this.materials.orange_inside_texture)

        //peach
        let peach_model_transform = Mat4.translation(4, -2, 0).times(Mat4.rotation(t, 0, 1,0)).times(Mat4.scale(0.5, 0.5,0.5));
        this.shapes.peach.arrays.texture_coord.forEach(
            (v, i, l) => {
                // v[0] = v[0] * 10
                // v[1] = v[1] * 10
                //console.log(v)
            }
        )
        this.shapes.peach.draw(context, program_state, peach_model_transform, this.materials.peach_texture)

        let half_peach_translate = vec4(4,-4,0,1)
        let half_peach_rotate = vec4(0,1,0,1)
        let half_peach_outside_scale = vec4(0.5, 0.5, 0.5)
        let half_peach_inside_scale = vec4(0.5, 0.5, 0.5)
        this.draw_half_fruit(context, program_state, half_peach_translate, half_peach_rotate, half_peach_outside_scale, half_peach_inside_scale,
            this.shapes.peach, this.materials.half_peach_texture, this.shapes.peach_inside, this.materials.peach_inside_texture)

        //apple
        let apple_model_transform = Mat4.translation(-2, -2, 0).times(Mat4.rotation(t, 0, 1,0)).times(Mat4.scale(0.5, 0.5,0.5));
        this.shapes.apple.arrays.texture_coord.forEach(
            (v, i, l) => {
                // v[0] = v[0] * 10
                // v[1] = v[1] * 10
                //console.log(v)
            }
        )
        this.shapes.apple.draw(context, program_state, apple_model_transform, this.materials.apple_texture)

        let half_apple_translate = vec4(-2,-4,0,1)
        let half_apple_rotate = vec4(0,1,0,1)
        let half_apple_outside_scale = vec4(0.5, 0.5, 0.5)
        let half_apple_inside_scale = vec4(0.5, 0.5, 0.5)
        this.draw_half_fruit(context, program_state, half_apple_translate, half_apple_rotate, half_apple_outside_scale, half_apple_inside_scale,
            this.shapes.apple, this.materials.half_apple_texture, this.shapes.apple_inside, this.materials.apple_inside_texture)

        //mango
        let mango_model_transform = Mat4.translation(-4, -2, 0).times(Mat4.rotation(t, 0, 1,0)).times(Mat4.scale(0.75, 0.6,0.6));
        this.shapes.mango.arrays.texture_coord.forEach(
            (v, i, l) => {
                // v[0] = v[0] * 10
                // v[1] = v[1] * 10
                //console.log(v)
            }
        )
        this.shapes.mango.draw(context, program_state, mango_model_transform, this.materials.mango_texture)

        let half_mango_translate = vec4(-4,-4,0,1)
        let half_mango_rotate = vec4(0,1,0,1)
        let half_mango_outside_scale = vec4(0.75, 0.6, 0.6)
        let half_mango_inside_scale = vec4(0.75, 0.6, 1)
        this.draw_half_fruit(context, program_state, half_mango_translate, half_mango_rotate, half_mango_outside_scale, half_mango_inside_scale,
            this.shapes.mango, this.materials.half_mango_texture, this.shapes.mango_inside, this.materials.mango_inside_texture)

        //bomb
        let bomb_model_transform = Mat4.translation(-6, -2, 0).times(Mat4.rotation(t, 0, 1,0))
        this.shapes.bomb.draw(context, program_state, bomb_model_transform, this.materials.bomb_texture)
    }

    draw_half_fruit(context, program_state, translate, rotate, outside_scale, inside_scale, outside_shape, outside_texture, inside_shape, inside_texture) {
        let t = program_state.animation_time / 1000

        let half_watermelon_model_transform = Mat4.translation(translate[0], translate[1], translate[2]).times(Mat4.rotation(t, rotate[0], rotate[1],rotate[2])).times(Mat4.scale(outside_scale[0], outside_scale[1],outside_scale[2]));
        outside_shape.draw(context, program_state, half_watermelon_model_transform, outside_texture);

        let watermelon_inside_transform = Mat4.translation(translate[0], translate[1], translate[2])
            .times(Mat4.rotation(t, rotate[0], rotate[1],rotate[2])).times(Mat4.rotation(Math.PI/2, 1, 0,0)).times(Mat4.scale(inside_scale[0], inside_scale[1],inside_scale[2]));
        inside_shape.draw(context, program_state, watermelon_inside_transform, inside_texture)
    }
}


class Hemi_Sphere extends Textured_Phong {
    constructor(scale) {
        super();
        this.scale = scale
        console.log(this.scale)
    }
    // TODO:  Modify the shader below (right now it's just the same fragment shader as Textured_Phong) for requirement #7.
    fragment_glsl_code() {
        return this.shared_glsl_code() + `
            varying vec2 f_tex_coord;
            uniform sampler2D texture;
            uniform float animation_time;
            void main(){
                // Sample the texture image in the correct place:
                vec4 tex_color = texture2D( texture, f_tex_coord);
                
                // black out half of fruit
                float v = f_tex_coord.y/${this.scale + ".0"};
                if (v >= 0.5) {
                    tex_color = vec4(0, 0, 0, 0.0);
                }
                
                if( tex_color.w < .01 ) discard;
                                                                         // Compute an initial (ambient) color:
                gl_FragColor = vec4( ( tex_color.xyz + shape_color.xyz ) * ambient, shape_color.w * tex_color.w ); 
                                                                         // Compute the final color with contributions from lights:
                gl_FragColor.xyz += phong_model_lights( normalize( N ), vertex_worldspace );
        } `;
    }
}